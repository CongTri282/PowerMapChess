# 🗺️ Bản đồ Quyền lực Tài chính (Financial Power Map)

Một trò chơi mô phỏng tương tác về hệ sinh thái tài chính Việt Nam, nơi người chơi vào vai các chủ thể khác nhau (doanh nghiệp, ngân hàng/quỹ đầu tư, chính phủ) và thực hiện các quyết định kinh tế-tài chính, theo dõi ảnh hưởng đến quyền lực và lợi ích quốc gia.

## 🎯 Mô tả dự án

Trò chơi này được phát triển nhằm mục đích giáo dục, giúp người chơi hiểu rõ hơn về:
- Sự tương tác giữa các chủ thể trong hệ sinh thái tài chính
- Ảnh hưởng của vốn nước ngoài đến chủ quyền kinh tế
- Vai trò của nhà nước trong việc điều tiết và bảo vệ lợi ích quốc gia
- Tác động của các quyết định tài chính đến nền kinh tế

Dự án dựa trên lý thuyết của Lenin về sự kết hợp và đấu tranh của tư bản công nghiệp – thương nghiệp – ngân hàng trong nền kinh tế toàn cầu hóa.

## ✨ Tính năng chính

### 🎮 Gameplay
- **Hỗ trợ 10-30 người chơi** trong cùng một phiên game
- **3 loại vai trò**:
  - 🏦 **Ngân hàng/Quỹ đầu tư**: Đầu tư vốn, mua cổ phần, phát triển fintech, thao túng thị trường
  - 🏢 **Doanh nghiệp**: Hợp tác vốn, mở rộng quy mô, bán cổ phần, chống thâu tóm
  - 🏛️ **Chính phủ**: Ban hành luật, kiểm soát vốn ngoại, bảo vệ ngành trọng yếu, áp thuế
- **Vốn trong nước vs. nước ngoài**: Mỗi player có nguồn vốn riêng ảnh hưởng đến chủ quyền kinh tế

### 📊 Bản đồ Quyền lực Động
- Hiển thị vị trí và quyền lực của từng chủ thể
- Theo dõi dòng vốn giữa các players theo thời gian thực
- Thanh quyền lực động cho mỗi player

### 🤖 Phân tích AI
- Phân tích hệ quả của mỗi hành động
- Dự báo thay đổi quyền lực
- Đánh giá tác động đến lợi ích quốc gia
- Đưa ra khuyến nghị chính sách

### 📈 Chỉ số Quốc gia
- **Kiểm soát nội địa**: Mức độ kiểm soát của vốn trong nước
- **Chủ quyền kinh tế**: Độc lập kinh tế của quốc gia
- **Phụ thuộc ngoại**: Mức độ phụ thuộc vào vốn nước ngoài
- **Mức độ độc quyền**: Tập trung quyền lực thị trường
- **Tăng trưởng GDP**: Tốc độ phát triển kinh tế
- **Ổn định tài chính**: Mức độ ổn định của hệ thống

### 🎲 Sự kiện từ Thực tiễn Việt Nam
- Fintech bùng nổ
- Quỹ ngoại thâu tóm doanh nghiệp
- Luật ngân hàng mới
- Sụt giảm thị trường chứng khoán
- Ngân hàng số được cấp phép
- Căng thẳng thương mại
- Quy định về crypto
- Sáp nhập ngân hàng
- Tấn công an ninh mạng
- Phát triển tài chính xanh

## 🚀 Cài đặt và Chạy

### Yêu cầu
- Node.js 18+
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone https://github.com/CongTri282/PowerMapChess.git
cd PowerMapChess
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Chạy development server
```bash
npm run dev
```

Trò chơi sẽ chạy tại `http://localhost:5173`

### Build cho production
```bash
npm run build
```

## 🎯 Cách chơi

1. **Khởi động game**: Chọn số lượng người chơi (10-30)
2. **Chọn player**: Click vào một player trên bản đồ để chọn
3. **Thực hiện hành động**: Chọn hành động phù hợp với vai trò của player
4. **Xem phân tích**: AI sẽ phân tích hệ quả của mỗi hành động
5. **Theo dõi metrics**: Quan sát các chỉ số quốc gia thay đổi
6. **Xử lý sự kiện**: Đưa ra quyết định khi có sự kiện xảy ra
7. **Kết thúc**: Sau 20 lượt, xem kết quả và bài học rút ra

## 🏗️ Cấu trúc dự án

```
src/
├── components/          # React components
│   ├── PowerMap.tsx    # Bản đồ chính hiển thị players và capital flows
│   ├── ActionPanel.tsx # Panel chọn và thực hiện hành động
│   ├── Dashboard.tsx   # Dashboard hiển thị metrics quốc gia
│   ├── AnalysisPanel.tsx # Panel phân tích AI
│   └── EventCard.tsx   # Card hiển thị sự kiện
├── context/            # State management
│   └── GameContext.tsx # Game reducer và logic
├── types/              # TypeScript type definitions
│   └── index.ts       # Tất cả interfaces và types
├── utils/              # Utility functions
│   ├── events.ts      # Quản lý sự kiện game
│   └── playerUtils.ts # Utilities cho players
├── App.tsx            # Main app component
├── App.css            # Main styles
└── main.tsx           # Entry point
```

## 🎓 Giá trị giáo dục

Trò chơi này giúp người chơi:
- Hiểu về **cơ chế hoạt động** của hệ sinh thái tài chính
- Nhận thức được **tầm quan trọng** của chủ quyền kinh tế
- Phân tích **hệ quả** của các quyết định tài chính
- Đánh giá **vai trò** của nhà nước trong nền kinh tế
- Học cách **cân bằng** giữa phát triển và bảo vệ lợi ích quốc gia

## 🛠️ Công nghệ sử dụng

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Socket.IO** - Real-time multiplayer
- **Express** - WebSocket server
- **HTML5 Canvas** - Vẽ capital flows
- **CSS3** - Styling và animations

## 🚀 Deploy

### Deploy Frontend (Vercel)
1. Push code lên GitHub
2. Kết nối repo với Vercel
3. Thêm environment variable trong Vercel:
   ```
   VITE_SERVER_URL=https://your-server-url.com
   ```
4. Deploy!

### Deploy Backend (Railway/Render/Fly.io)

**Option 1: Railway** (Khuyến nghị)
1. Tạo file `Procfile`:
   ```
   web: npm run server
   ```
2. Đăng ký tài khoản Railway.app
3. Tạo New Project → Deploy from GitHub
4. Chọn repo và branch
5. Railway sẽ tự động detect và deploy
6. Copy domain WebSocket server (vd: `https://your-app.up.railway.app`)
7. Cập nhật `VITE_SERVER_URL` trong Vercel

**Option 2: Render.com**
1. Tạo file `render.yaml`:
   ```yaml
   services:
     - type: web
       name: powermapchess-server
       env: node
       buildCommand: npm install
       startCommand: npm run server
   ```
2. Đăng ký Render.com
3. New Web Service → Connect repo
4. Deploy!

**Option 3: Fly.io**
1. Install Fly CLI: `npm install -g flyctl`
2. Login: `fly auth login`
3. Launch: `fly launch`
4. Deploy: `fly deploy`

### Setup Local Development
```bash
# Clone repo
git clone https://github.com/CongTri282/PowerMapChess.git
cd PowerMapChess

# Install dependencies
npm install

# Tạo file .env từ .env.example
cp .env.example .env

# Chạy cả frontend và backend
npm run dev:all

# Hoặc chạy riêng:
npm run dev      # Frontend (port 5173)
npm run server   # Backend (port 3001)
```

## 📝 Tác giả

Dự án được phát triển cho môn MLN211 - Học kỳ Fall 2025

## 📄 License

MIT License

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Hãy tạo issue hoặc pull request.

## 📞 Liên hệ

- Repository: [https://github.com/CongTri282/PowerMapChess](https://github.com/CongTri282/PowerMapChess)

---

**Lưu ý**: Đây là một trò chơi mô phỏng với mục đích giáo dục. Các số liệu và tình huống trong game được đơn giản hóa để phục vụ mục đích học tập.
