import cv2
import numpy as np
import time
import subprocess
import RPi.GPIO as GPIO
import os
from tflite_runtime.interpreter import Interpreter
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import datetime

print("=== INISIALISASI SMART WASTE SYSTEM (AI VISION & IOT FIREBASE) ===")

# ==========================================
# 1. KONFIGURASI FIREBASE CLOUD
# ==========================================
try:
    # Ganti dengan path folder tempat file json Anda berada
    cred = credentials.Certificate('/home/cd3/smart_waste/serviceAccountKey.json')
    firebase_admin.initialize_app(cred, {
        # GANTI URL INI DENGAN URL DATABASE FIREBASE ANDA
        'databaseURL': 'https://sipesat-b51a5-default-rtdb.asia-southeast1.firebasedatabase.app/' 
    })
    ref_sipesat = db.reference('sipesat')
    print("[INFO] Sukses Terhubung ke Cloud Firebase!")
except Exception as e:
    print(f"[ERROR] Gagal Konek Firebase: {e}")

# ==========================================
# 2. KONFIGURASI PIN GPIO
# ==========================================
# Pin Relay (Active Low)
PIN_RELAY_CONVEYOR = 22  # Pin 15

# Pin Servo (Hardware PWM)
PIN_SERVO_1 = 13  # Pin 33 (Palang Kiri - Baterai)
PIN_SERVO_2 = 19  # Pin 35 (Palang Kanan - ATK)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# Setup Relay
GPIO.setup(PIN_RELAY_CONVEYOR, GPIO.OUT)
GPIO.output(PIN_RELAY_CONVEYOR, GPIO.HIGH) # Default OFF (Active Low)

# Setup Servo
GPIO.setup(PIN_SERVO_1, GPIO.OUT)
GPIO.setup(PIN_SERVO_2, GPIO.OUT)
pwm_servo1 = GPIO.PWM(PIN_SERVO_1, 50) # Frekuensi 50Hz
pwm_servo2 = GPIO.PWM(PIN_SERVO_2, 50)
pwm_servo1.start(0)
pwm_servo2.start(0)

# ==========================================
# 3. VARIABEL GLOBAL PENGHITUNG
# ==========================================
total_baterai = 0
total_atk = 0
total_kemasan = 0
status_mesin = "STANDBY - MENCARI SAMPAH..."
last_detected = "KOSONG"
confidence_txt = "0%"

# ==========================================
# 4. FUNGSI KONTROL MEKANIK & FIREBASE
# ==========================================
def conveyor_nyala():
    """Menyalakan conveyor (Relay Active Low)"""
    GPIO.output(PIN_RELAY_CONVEYOR, GPIO.LOW)

def conveyor_mati():
    """Mematikan conveyor (Rem mendadak)"""
    GPIO.output(PIN_RELAY_CONVEYOR, GPIO.HIGH)

def set_servo(pwm, angle):
    """Menggerakkan servo ke sudut tertentu"""
    duty = 2.0 + (angle / 18.0)
    pwm.ChangeDutyCycle(duty)
    time.sleep(0.5)
    pwm.ChangeDutyCycle(0) # Matikan sinyal agar tidak bergetar (jitter)

def reset_servos():
    """Mengembalikan palang ke posisi netral/lurus (90 derajat)"""
    set_servo(pwm_servo1, 90)
    set_servo(pwm_servo2, 90)

def update_firebase(jenis_sampah, t_baterai, t_atk, t_kemasan):
    """Fungsi untuk mengirim data terbaru ke Dashboard Website"""
    try:
        waktu_sekarang = datetime.datetime.now().strftime("%H:%M:%S")
        
        # Update Counter
        ref_sipesat.child('counter').update({
            'baterai': t_baterai,
            'atk': t_atk,
            'kemasan_kotak': t_kemasan
        })
        
        # Update Log Aktivitas
        pesan_log = f"[{waktu_sekarang}] 1 {jenis_sampah.upper()} berhasil dipilah."
        ref_sipesat.update({
            'status_terakhir': pesan_log
        })
        print(f"[FIREBASE] >> Sinkronisasi data {jenis_sampah} ke Cloud sukses!")
    except Exception as e:
        print(f"[FIREBASE ERROR] Gagal mengirim data: {e}")

# ==========================================
# 5. SETUP MODEL AI (TENSORFLOW LITE)
# ==========================================
MODEL_PATH = "/home/cd3/smart_waste/model.tflite"
LABELS_PATH = "/home/cd3/smart_waste/labels.txt"
IMAGE_TEMP = "/home/cd3/smart_waste/temp_snapshot.jpg"

print("[INFO] Memuat Model AI...")
with open(LABELS_PATH, 'r') as f:
    labels = [line.strip() for line in f.readlines()]

interpreter = Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Cek apakah model menggunakan tipe data FLOAT32 atau UINT8
is_floating_model = input_details[0]['dtype'] == np.float32

# ==========================================
# 6. FUNGSI PEMROSESAN GAMBAR & GUI
# ==========================================
def process_and_display():
    global status_mesin, last_detected, confidence_txt
    
    # 1. Ambil snapshot menggunakan rpicam-still (Anti-Lag)
    subprocess.run(["rpicam-still", "-n", "-t", "50", "-o", IMAGE_TEMP, "--width", "640", "--height", "480"], capture_output=True)
    
    img_display = cv2.imread(IMAGE_TEMP)
    if img_display is None:
        return "kosong", 0.0

    # 2. Persiapkan gambar untuk AI (224x224)
    img_ai = cv2.resize(img_display, (224, 224))
    img_array = np.asarray(img_ai)
    img_array = np.expand_dims(img_array, axis=0)
    
    if is_floating_model:
        img_array = (np.float32(img_array) / 127.5) - 1.0
    
    # 3. Proses Deteksi
    interpreter.set_tensor(input_details[0]['index'], img_array)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])
    
    best_match_index = np.argmax(output_data[0])
    
    # Ambil nilai akurasi (Confidence)
    if is_floating_model:
        confidence = float(output_data[0][best_match_index])
    else:
        confidence = float(output_data[0][best_match_index]) / 255.0

    nama_kelas = "kosong"
    if confidence >= 0.8:
        nama_kelas = labels[best_match_index].split(" ", 1)[1].lower()
        last_detected = nama_kelas.upper()
        confidence_txt = f"{int(confidence * 100)}%"
    else:
        confidence_txt = f"{int(confidence * 100)}%"
        if confidence < 0.5:
            last_detected = "MENCARI..."

    # 4. Gambar Tampilan GUI (Overlay Grafis)
    cv2.putText(img_display, f"STATUS: {status_mesin}", (15, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
    cv2.putText(img_display, f"OBJEK: {last_detected} ({confidence_txt})", (15, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    
    # Kotak Penghitung Transparan
    cv2.rectangle(img_display, (10, 360), (280, 465), (50, 50, 50), -1)
    cv2.rectangle(img_display, (10, 360), (280, 465), (200, 200, 200), 2)
    cv2.putText(img_display, "--- TOTAL WADAH ---", (25, 385), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    cv2.putText(img_display, f"1. BATERAI   : {total_baterai}", (25, 410), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (100, 255, 100), 1)
    cv2.putText(img_display, f"2. ATK       : {total_atk}", (25, 430), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 150, 100), 1)
    cv2.putText(img_display, f"3. KEMASAN   : {total_kemasan}", (25, 450), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 100, 255), 1)

    cv2.imshow("SMART WASTE VISUAL MONITOR", img_display)
    cv2.waitKey(1)
    
    return nama_kelas, confidence

# ==========================================
# 7. LOOP UTAMA SISTEM (STATE MACHINE)
# ==========================================
try:
    print("[INFO] Mengkalibrasi posisi Servo...")
    reset_servos()
    print("[INFO] Mengaktifkan Conveyor...")
    conveyor_nyala()
    
    while True:
        status_mesin = "MENCARI SAMPAH..."
        objek, akurasi = process_and_display()
        
        # --- BARIS DEBUGGING ---
        if akurasi >= 0.5:
            print(f"DEBUG AI -> Objek: '{objek}', Akurasi: {akurasi}")
            
        # ==================================================
        # LOGIKA PEMILAHAN: BATERAI
        # ==================================================
        if "baterai" in objek and akurasi >= 0.8:
            status_mesin = "BATERAI TERDETEKSI!"
            process_and_display()
            
            conveyor_mati() 
            set_servo(pwm_servo1, 155) 
            
            for i in range(5, 0, -1):
                status_mesin = f"MEMILAH BATERAI... (Tunggu {i}s)"
                process_and_display()
                time.sleep(1) 
            
            total_baterai += 1
            update_firebase("Baterai", total_baterai, total_atk, total_kemasan) # KIRIM KE CLOUD
            
            status_mesin = "RESET PALANG PINTU..."
            process_and_display()
            set_servo(pwm_servo1, 90)
            conveyor_nyala() 
            
        # ==================================================
        # LOGIKA PEMILAHAN: ATK
        # ==================================================
        elif "atk" in objek and akurasi >= 0.8:
            status_mesin = "ATK TERDETEKSI!"
            process_and_display()
            
            conveyor_mati()
            set_servo(pwm_servo2, 35) 
            
            for i in range(5, 0, -1):
                status_mesin = f"MEMILAH ATK... (Tunggu {i}s)"
                process_and_display()
                time.sleep(1)
                
            total_atk += 1
            update_firebase("ATK", total_baterai, total_atk, total_kemasan) # KIRIM KE CLOUD
            
            status_mesin = "RESET PALANG PINTU..."
            process_and_display()
            set_servo(pwm_servo2, 90)
            conveyor_nyala()
            
        # ==================================================
        # LOGIKA KEMASAN KOTAK KECIL (JALAN TERUS)
        # ==================================================
        elif "kemasan" in objek and akurasi >= 0.8:
            print(">>> MESIN MENGEKSEKUSI KEMASAN KOTAK! (7 DETIK) <<<")
            
            conveyor_mati() # Opsional: biarkan menyala terus dengan menghapus baris ini
            total_kemasan += 1
            update_firebase("Kemasan Kotak", total_baterai, total_atk, total_kemasan) # KIRIM KE CLOUD
            
            # Timer 7 detik tanpa membuat kamera macet (freeze)
            waktu_mulai = time.time()
            while time.time() - waktu_mulai < 7:
                sisa_waktu = 7 - int(time.time() - waktu_mulai)
                status_mesin = f"KEMASAN JALAN... ({sisa_waktu}s)"
                process_and_display() # Tetap jalankan kamera agar video tidak hang
            conveyor_nyala()

except KeyboardInterrupt:
    print("\n[INFO] Sistem dihentikan oleh pengguna.")
finally:
    print("[INFO] Membersihkan pin GPIO dan mematikan alat...")
    conveyor_mati()
    pwm_servo1.stop()
    pwm_servo2.stop()
    GPIO.cleanup()
    cv2.destroyAllWindows()
    if os.path.exists(IMAGE_TEMP):
        os.remove(IMAGE_TEMP)
    print("=== SISTEM DIMATIKAN DENGAN AMAN ===")