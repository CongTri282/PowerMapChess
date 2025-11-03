# 🔧 Fix: Vercel không kết nối được Railway

## ❌ Lỗi thường gặp:

### 1. Environment Variable thiếu `https://`
```
❌ SAI:   powermapchess-production.up.railway.app
✅ ĐÚNG:  https://powermapchess-production.up.railway.app
```

### 2. Environment Variable có trailing slash
```
❌ SAI:   https://powermapchess-production.up.railway.app/
✅ ĐÚNG:  https://powermapchess-production.up.railway.app
```

## ✅ Cách fix:

### Bước 1: Sửa Environment Variable trong Vercel
1. Vào Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Click vào `VITE_SERVER_URL`
3. Sửa value thành:
   ```
   https://powermapchess-production.up.railway.app
   ```
4. Click **Save**

### Bước 2: Redeploy
1. Vào **Deployments** tab
2. Click 3 chấm (...) ở deployment mới nhất
3. Click **Redeploy**
4. Đợi 1-2 phút

### Bước 3: Test
1. Mở app Vercel trong browser mới (Ctrl+Shift+N)
2. Mở Console (F12)
3. Nếu không thấy lỗi CORS → **Thành công!**

## 🔍 Debug nếu vẫn lỗi:

### Check 1: Railway server có chạy không?
```bash
# Test trực tiếp Railway
curl https://powermapchess-production.up.railway.app/health

# Kết quả mong đợi:
# {"status":"ok","rooms":0,"players":0}
```

### Check 2: Console errors
Mở F12 trong Vercel app, xem lỗi gì:
- `Failed to connect` → Kiểm tra URL
- `CORS error` → Server chưa chạy hoặc CORS config sai
- `404 Not Found` → URL sai hoặc server chưa deploy

### Check 3: Network tab
1. F12 → **Network** tab
2. Reload page
3. Tìm request tới Railway domain
4. Xem status code:
   - `101 Switching Protocols` → ✅ Kết nối thành công
   - `404` → ❌ URL sai
   - `500` → ❌ Server error

## 🎯 Checklist cuối cùng:

- [ ] `VITE_SERVER_URL` có `https://` ở đầu
- [ ] Railway domain đúng: `powermapchess-production.up.railway.app`
- [ ] Đã **Redeploy** Vercel sau khi sửa env var
- [ ] Railway server đang chạy (check trong Railway Deployments)
- [ ] Test Railway health endpoint: `https://powermapchess-production.up.railway.app/health`

**Sau khi làm theo → App sẽ hoạt động!** 🎉
