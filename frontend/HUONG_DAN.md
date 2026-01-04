# Hướng dẫn chạy ứng dụng

## 📁 Cấu trúc thư mục

Tất cả source code và file cấu hình đã được đặt trong thư mục `frontend/`:

```
frontend/
├── src/
│   ├── components/   (Sidebar, TopSearchBar, TopicCard, DocumentCard)
│   ├── pages/        (Dashboard, TopicList, CreateTopic, ...)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚀 Cách chạy ứng dụng

### Bước 1: Di chuyển vào thư mục frontend

```bash
cd frontend
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

Lệnh này sẽ cài đặt tất cả các package cần thiết (React, React Router, Tailwind CSS, Vite, ...)

### Bước 3: Chạy ứng dụng ở chế độ development

```bash
npm run dev
```

Sau khi chạy lệnh, bạn sẽ thấy thông báo:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Mở trình duyệt và truy cập: **http://localhost:5173**

### Bước 4: Build cho production (tùy chọn)

Khi muốn build ứng dụng để deploy:

```bash
npm run build
```

File build sẽ được tạo trong thư mục `../dist/` (bên ngoài frontend)

Để preview file build:

```bash
npm run preview
```

## 📝 Các lệnh có sẵn

- `npm run dev` - Chạy development server
- `npm run build` - Build ứng dụng cho production
- `npm run preview` - Preview file build

## ⚠️ Lưu ý

1. Đảm bảo đã cài đặt **Node.js** (phiên bản 16 trở lên)
2. Tất cả source code và file cấu hình nằm trong thư mục `frontend/`
3. Phải chạy các lệnh npm từ **bên trong thư mục frontend**

## 🛠️ Troubleshooting

Nếu gặp lỗi khi chạy:

1. Xóa thư mục `node_modules` và file `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   ```

2. Cài đặt lại dependencies:
   ```bash
   npm install
   ```

3. Chạy lại:
   ```bash
   npm run dev
   ```
