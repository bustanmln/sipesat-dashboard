#!/bin/bash
# ============================================
# SIPESAT Smart Waste - Startup Script
# ============================================
# Script ini menjalankan main.py dengan auto-tunnel.
#
# CARA PAKAI:
#   chmod +x start.sh
#   ./start.sh
#
# CARA AUTO-START SAAT BOOT (opsional):
#   Tambahkan di crontab: crontab -e
#   @reboot /home/cd3/smart_waste/start.sh >> /home/cd3/smart_waste/sipesat.log 2>&1
# ============================================

# Path folder project
PROJECT_DIR="/home/cd3/smart_waste"

# Masuk ke folder project
cd "$PROJECT_DIR" || { echo "[ERROR] Folder $PROJECT_DIR tidak ditemukan!"; exit 1; }

echo ""
echo "============================================"
echo "  SIPESAT Smart Waste System"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"
echo ""

# Cek apakah sudah ada instance yang berjalan
if pgrep -f "python3 main.py" > /dev/null; then
    echo "[WARNING] main.py sudah berjalan! Menghentikan proses lama..."
    pkill -f "python3 main.py"
    sleep 2
fi

# Cek koneksi internet (dibutuhkan untuk tunnel & Firebase)
echo "[INFO] Mengecek koneksi internet..."
if ping -c 1 google.com &> /dev/null; then
    echo "[INFO] ✅ Internet terhubung!"
else
    echo "[WARNING] ⚠️  Tidak ada koneksi internet!"
    echo "[WARNING] Tunnel tidak akan berfungsi, stream hanya lokal."
    echo "[WARNING] Firebase sync mungkin gagal."
fi

# Jalankan main.py
echo "[INFO] Memulai SIPESAT Smart Waste System..."
echo ""
python3 main.py
