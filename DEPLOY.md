# 🚀 Hướng dẫn Deploy Full-Stack

## 📋 Tổng quan
Game này gồm 2 phần:
- **Frontend (Client)**: React app - Deploy trên Vercel
- **Backend (Server)**: Socket.IO server - Deploy trên Railway/Render

## 🎯 Bước 1: Deploy Backend (WebSocket Server)

### Option A: Railway (Khuyến nghị - Miễn phí)

1. **Chuẩn bị**
   - Push code lên GitHub
   - Đăng ký tài khoản tại [railway.app](https://railway.app)

2. **Deploy**
   ```bash
   # Đã có sẵn Procfile, không cần làm gì thêm
   ```
   
   - Truy cập Railway Dashboard
   - Click **"New Project"**
   - Chọn **"Deploy from GitHub repo"**
   - Authorize Railway truy cập GitHub
   - Chọn repo `PowerMapChess`
   - Railway sẽ tự động detect và deploy!

3. **Cấu hình**
   - Sau khi deploy xong, vào **Settings → Networking**
   - Copy **Public Domain** (vd: `powermapchess-server.up.railway.app`)
   - Lưu URL này để dùng ở bước 2

4. **Kiểm tra**
   ```bash
   # Test server đã chạy chưa
   curl https://your-app.up.railway.app/health
   
   # Kết quả mong đợi:
   # {"status":"ok","rooms":0,"players":0}
   ```

### Option B: Render.com (Miễn phí)

1. **Đăng ký** tại [render.com](https://render.com)

2. **Deploy**
   - Dashboard → **New Web Service**
   - Connect GitHub repo
   - Cấu hình:
     - **Name**: `powermapchess-server`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm run server`
     - **Plan**: Free
   - Click **Create Web Service**

3. **Copy URL** từ dashboard (vd: `https://powermapchess-server.onrender.com`)

### Option C: Fly.io (Phức tạp hơn, có free tier)

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch (từ thư mục project)
flyctl launch --name powermapchess-server

# Deploy
flyctl deploy
```

---

## 🌐 Bước 2: Deploy Frontend (Vercel)

1. **Chuẩn bị**
   - Đăng ký tài khoản tại [vercel.com](https://vercel.com)
   - Đảm bảo code đã push lên GitHub

2. **Import Project**
   - Vercel Dashboard → **Add New Project**
   - Import GitHub repo `PowerMapChess`
   - Framework: **Vite**

3. **Cấu hình Environment Variables**
   Trong **Environment Variables** section, thêm:
   ```
   VITE_SERVER_URL=https://your-railway-app.up.railway.app
   ```
   ⚠️ **QUAN TRỌNG**: Thay `your-railway-app.up.railway.app` bằng URL backend từ Bước 1

4. **Build Settings** (tự động detect)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Deploy!**
   - Click **Deploy**
   - Đợi 2-3 phút
   - Done! 🎉

---

## ✅ Bước 3: Kiểm tra

1. **Truy cập frontend**: `https://your-app.vercel.app`

2. **Test multiplayer**:
   - Mở 2 tab browser
   - Tab 1: Create Room → Start Game
   - Tab 2: Join Room → Join
   - Thử chat và perform action
   - Nếu thấy cập nhật real-time → **Thành công!** ✨

3. **Nếu lỗi**: Mở Console (F12) và check:
   ```
   # Lỗi thường gặp:
   - "Failed to connect to server" → Kiểm tra VITE_SERVER_URL
   - "CORS error" → Server cần enable CORS (đã có sẵn)
   - "404 Not Found" → Server chưa deploy xong
   ```

---

## 🔄 Update sau này

### Update Frontend
```bash
git add .
git commit -m "Update frontend"
git push
# Vercel tự động deploy!
```

### Update Backend
```bash
git add .
git commit -m "Update server"
git push
# Railway/Render tự động deploy!
```

---

## 💰 Chi phí

- **Vercel**: Miễn phí (100GB bandwidth/tháng)
- **Railway**: Miễn phí $5 credit/tháng (đủ cho hobby project)
- **Render**: Miễn phí (750h/tháng)
- **Fly.io**: Miễn phí tier có giới hạn

**Tổng cộng: MIỄN PHÍ** 🎉

---

## 🐛 Troubleshooting

### Frontend không connect được server
```bash
# Check environment variable
echo $VITE_SERVER_URL
# Hoặc xem trong Vercel Dashboard → Settings → Environment Variables

# Phải là https://, không phải http://
# Phải là domain Railway/Render, không phải localhost
```

### Server crash khi deploy
```bash
# Check logs
railway logs  # Railway
# Hoặc xem trên Render Dashboard

# Thường do thiếu dependencies
npm install
git push
```

### CORS error
Server đã config CORS sẵn. Nếu vẫn lỗi, check `server/index.ts`:
```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-app.vercel.app'  // Thêm domain Vercel của bạn
];
```

---

## 📞 Cần hỗ trợ?

- Check logs trong Railway/Render Dashboard
- Mở issue trên GitHub
- Kiểm tra README.md

**Chúc deploy thành công! 🚀✨**
