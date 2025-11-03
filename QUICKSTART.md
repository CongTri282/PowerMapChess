# ⚡ Quick Start - Deploy trong 5 phút

## 1️⃣ Deploy Backend (2 phút)
1. Truy cập https://railway.app và đăng nhập GitHub
2. **New Project** → **Deploy from GitHub repo** → Chọn repo này
3. Đợi deploy xong, copy URL (ví dụ: `https://xxx.up.railway.app`)

## 2️⃣ Deploy Frontend (2 phút)  
1. Truy cập https://vercel.com và đăng nhập GitHub
2. **Add New Project** → Import repo này
3. Thêm Environment Variable:
   ```
   VITE_SERVER_URL=https://xxx.up.railway.app
   ```
   (thay bằng URL Railway từ bước 1)
4. Click **Deploy**

## 3️⃣ Test (1 phút)
1. Mở app Vercel trong 2 tab
2. Tab 1: Create Room
3. Tab 2: Join Room  
4. Chat thử → Nếu thấy tin nhắn = **Thành công!** 🎉

---

## 🐛 Lỗi?
- Không connect được → Check `VITE_SERVER_URL` trong Vercel settings
- Màn hình trắng → Mở Console (F12) xem lỗi gì
- Cần hướng dẫn chi tiết → Đọc `DEPLOY.md`

**That's it! Chỉ 5 phút!** ⚡
