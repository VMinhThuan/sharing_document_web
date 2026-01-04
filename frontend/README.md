# AI Learning Document Sharing System

Hệ thống chia sẻ tài liệu học tập được hỗ trợ bởi AI.

## 📁 Cấu trúc dự án

Tất cả source code và file cấu hình đã được đặt trong thư mục `frontend/`:

```
sharing_document_web/
├── frontend/              ← Tất cả source code và config ở đây
│   ├── src/
│   │   ├── components/   # Các component tái sử dụng
│   │   ├── pages/        # Các trang
│   │   ├── App.jsx       # Component chính
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Styles
│   ├── index.html        # HTML template
│   ├── package.json      # Dependencies
│   ├── vite.config.js    # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── postcss.config.js # PostCSS configuration
└── node_modules/         # Dependencies (sẽ được tạo sau khi npm install)
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

### Bước 3: Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

Xem file `frontend/HUONG_DAN.md` để biết hướng dẫn chi tiết.

## 📝 Các lệnh có sẵn

Chạy từ **bên trong thư mục frontend**:

- `npm run dev` - Chạy development server
- `npm run build` - Build ứng dụng cho production
- `npm run preview` - Preview file build

## 🛠️ Công nghệ sử dụng

- **React 18** - UI framework
- **React Router v6** - Routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **JavaScript (JSX)** - Ngôn ngữ lập trình

## 📄 Các trang chính

- `/` - Dashboard
- `/topics` - Danh sách topics
- `/topics/create` - Tạo topic mới
- `/topics/:id` - Chi tiết topic
- `/documents/:id` - Chi tiết document
- `/upload` - Upload document
- `/friends` - Friends & Connections
- `/library` - My Library
