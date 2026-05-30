# 🤖 SIPESAT - Raspberry Pi Smart Waste System

Folder ini berisi kode Python yang berjalan di **Raspberry Pi 4B** untuk sistem pemilahan sampah cerdas berbasis AI Vision.

## 🏗️ Arsitektur Sistem

```
┌──────────────────────────────────────────────────────────────────┐
│                     RASPBERRY PI 4B                              │
│                                                                  │
│  ┌──────────────┐   ┌────────────┐   ┌──────────────────────┐   │
│  │  Pi Camera   │──▶│  TFLite AI │──▶│  GPIO Motor/Servo    │   │
│  │  (rpicam)    │   │  (detect)  │   │  (conveyor+palang)   │   │
│  └──────┬───────┘   └─────┬──────┘   └──────────────────────┘   │
│         │                 │                                      │
│  ┌──────▼─────────────────▼──────┐                               │
│  │   MJPEG HTTP Stream Server    │─── Port 8080                  │
│  │   (threading HTTP server)     │                               │
│  └──────────────┬────────────────┘                               │
│                 │                                                 │
│  ┌──────────────▼────────────────┐                               │
│  │   SSH Tunnel (localhost.run)  │─── HTTPS Public URL           │
│  │   Auto-push URL ke Firebase  │                               │
│  └──────────────┬────────────────┘                               │
└─────────────────┼────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────┐     ┌────────────────────────┐
│   Firebase Realtime Database    │◀───▶│  Website SIPESAT       │
│   - counter (baterai/atk/kemasan)│    │  (React + Vite)        │
│   - camera_url (auto-update)    │     │  - GitHub Pages        │
│   - status_terakhir             │     │  - Auto-load stream    │
└─────────────────────────────────┘     └────────────────────────┘
```

## 📋 Prasyarat

Pastikan library berikut sudah terinstal di Raspberry Pi:

```bash
# Library Python
pip install firebase-admin opencv-python-headless numpy tflite-runtime

# SSH client (biasanya sudah ada di Raspbian)
sudo apt install openssh-client
```

> **Catatan:** Gunakan `opencv-python-headless` bukan `opencv-python` karena kita tidak membutuhkan GUI window (hemat ~50MB RAM).

## 🚀 Cara Menjalankan

### Cara Cepat (Langsung)
```bash
cd /home/cd3/smart_waste
python3 main.py
```

### Cara Praktis (Pakai Script)
```bash
cd /home/cd3/smart_waste
chmod +x start.sh
./start.sh
```

### Auto-Start Saat Raspberry Pi Menyala (Opsional)
```bash
crontab -e
# Tambahkan baris ini di paling bawah:
@reboot /home/cd3/smart_waste/start.sh >> /home/cd3/smart_waste/sipesat.log 2>&1
```

## 🌐 Cara Streaming ke Website

### Otomatis (Sudah Dikonfigurasi)

Ketika `ENABLE_TUNNEL = True` di `main.py`, sistem akan **otomatis**:
1. Membuat SSH tunnel via `localhost.run`
2. Mendapatkan URL HTTPS publik (contoh: `https://abc123.lhr.life`)
3. Mengirim URL stream (`https://abc123.lhr.life/stream.mjpg`) ke **Firebase**
4. Website SIPESAT **otomatis** menampilkan stream dari URL tersebut

**Tidak perlu konfigurasi manual apapun!** ✅

### Manual (Jika Tunnel Gagal)

Jika tunnel gagal, Anda bisa menjalankan tunnel secara terpisah:
```bash
# Terminal 1: Jalankan main.py
python3 main.py

# Terminal 2: Jalankan tunnel manual
ssh -R 80:localhost:8080 nokey@localhost.run
```

Salin URL yang muncul, lalu masukkan di website via tombol **Configure IP**.

## ⚙️ Konfigurasi

Buka `main.py` dan edit bagian konfigurasi di baris awal:

```python
# Set True agar otomatis tunnel ke internet
ENABLE_TUNNEL = True

# Kualitas JPEG stream (1-100). Default 70 = hemat bandwidth
JPEG_QUALITY = 70

# Port server stream lokal
STREAM_PORT = 8080
```

## 💾 Estimasi Penggunaan RAM

| Komponen | RAM |
|---|---|
| Python + Libraries | ~50 MB |
| TFLite Model + Interpreter | ~30-80 MB |
| OpenCV (headless, tanpa GUI) | ~20 MB |
| MJPEG HTTP Server | ~5 MB |
| SSH Tunnel | ~3 MB |
| Firebase SDK | ~15 MB |
| **Total** | **~123-173 MB** |

> **Raspi 4B memiliki 4GB RAM** — penggunaan ini sangat aman (~4% dari total RAM).

## 🔧 Troubleshooting

### Stream tidak muncul di website?
1. Pastikan Raspi terhubung ke internet
2. Cek terminal Raspi, apakah ada pesan `🌐 STREAM PUBLIK AKTIF!`
3. Coba buka URL tunnel di browser langsung
4. Klik tombol **Coba Hubungkan Ulang** di website

### Tunnel gagal terbuat?
```bash
# Cek koneksi SSH ke localhost.run
ssh -v nokey@localhost.run

# Jika SSH belum ada:
sudo apt install openssh-client
```

### RAM terlalu tinggi?
- Pastikan menggunakan `opencv-python-headless` (bukan `opencv-python`)
- Turunkan `JPEG_QUALITY` ke 50
- Pastikan `cv2.imshow()` sudah dihapus (sudah dihapus di versi terbaru)

## 📁 Struktur File

```
raspi/
├── main.py           # Program utama (AI + Stream + Tunnel + Firebase)
├── start.sh          # Script launcher untuk Raspi
├── README.md         # Dokumentasi ini
```

File yang perlu ada di Raspberry Pi (`/home/cd3/smart_waste/`):
```
/home/cd3/smart_waste/
├── main.py
├── start.sh
├── model.tflite              # Model AI TensorFlow Lite
├── labels.txt                # Label klasifikasi
└── serviceAccountKey.json    # Credential Firebase
```
