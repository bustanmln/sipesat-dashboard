# Raspberry Pi Integrasi SIPESAT

Tempatkan file kode Python (`.py`) Raspberry Pi Anda di dalam folder ini. 

### Panduan Integrasi Firebase Realtime Database dengan Python:

Untuk mengirim data sensor, status pintu pemilah, atau mengontrol kamera dari Raspberry Pi ke Firebase, Anda dapat menggunakan library resmi Firebase Python SDK (`firebase-admin`).

#### 1. Instalasi Library di Raspberry Pi:
```bash
pip install firebase-admin opencv-python
```

#### 2. Contoh Kode Python untuk Sinkronisasi ke Firebase:
```python
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import time

# 1. Inisialisasi Firebase (Gunakan file credential JSON dari Firebase Console)
# Unduh dari Firebase Console: Project Settings -> Service Accounts -> Generate New Private Key
cred = credentials.Certificate("path/to/serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://sipesat-b51a5-default-rtdb.asia-southeast1.firebasedatabase.app'
})

# 2. Referensi Node Database
ref_bin = db.reference('binCapacities')
ref_camera = db.reference('cameraStatus')

# 3. Kirim data sensor/kapasitas secara real-time
def update_capacities(battery_count, atk_count, box_count, bottle_count):
    ref_bin.set({
        'battery': { 'currentCount': battery_count },
        'atk': { 'currentCount': atk_count },
        'box': { 'currentCount': box_count },
        'bottle': { 'currentCount': bottle_count }
    })
    print("Data kapasitas tempat sampah terkirim!")

# Contoh Loop Utama
try:
    while True:
        # Simulasi membaca sensor jarak/ultrasonic
        update_capacities(15, 22, 8, 45)
        time.sleep(5)
except KeyboardInterrupt:
    print("Program dihentikan.")
```
