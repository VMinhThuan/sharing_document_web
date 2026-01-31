# Hướng dẫn tích hợp AI Groq cho phân tích tài liệu

## Tổng quan

Hệ thống đã được tích hợp AI Groq để tự động phân tích tài liệu khi admin upload, bao gồm:
- Tóm tắt nội dung tài liệu
- Nhận diện các chủ đề chính
- Kiểm tra vi phạm chính sách cộng đồng
- Đề xuất danh mục phù hợp
- Xác định nội dung có mang tính giáo dục hay không

## Cài đặt

### 1. Cài đặt Groq SDK

```bash
cd backend
npm install groq-sdk
```

### 2. Cài đặt thư viện parse tài liệu (Tùy chọn nhưng khuyến nghị)

```bash
# Cho PDF
npm install pdf-parse

# Cho DOCX
npm install mammoth

# Cho Excel
npm install xlsx
```

### 3. Cấu hình Environment Variables

Thêm vào file `.env` của backend:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Lấy API key từ: https://console.groq.com/

## Cách hoạt động

### Backend Flow

1. **Upload Document**: Admin upload tài liệu qua API `/api/v1/documents`
2. **Extract Text**: Hệ thống extract text từ file (PDF, DOCX, Excel, etc.)
3. **AI Analysis**: Sử dụng Groq AI để phân tích:
   - Tóm tắt nội dung
   - Nhận diện topics
   - Kiểm tra policy violations
   - Đề xuất category
4. **Auto Actions**:
   - Tự động reject nếu phát hiện vi phạm chính sách
   - Tự động đề xuất category nếu chưa có
5. **Store Results**: Lưu kết quả phân tích vào database

### Frontend Flow

1. **Upload Page**: Admin upload tài liệu với form
2. **Show Analysis**: Hiển thị kết quả AI analysis ngay sau khi upload
3. **View Details**: Xem chi tiết AI analysis trong Documents Management

## Cấu trúc dữ liệu

### Document Model - AI Analysis Fields

```javascript
aiAnalysis: {
  aiSummary: String,           // Tóm tắt nội dung
  topics: [String],             // Danh sách topics
  policyViolation: {
    hasViolation: Boolean,      // Có vi phạm không
    violationType: String,      // Loại vi phạm
    reason: String              // Lý do vi phạm
  },
  isEducational: Boolean,      // Có phải nội dung giáo dục
  recommendedCategory: String,  // Category đề xuất
  analyzedAt: Date             // Thời gian phân tích
}
```

## API Endpoints

### Upload Document với AI Analysis

```
POST /api/v1/documents
Content-Type: multipart/form-data

Body:
- file: File
- title: String
- description: String (optional)
- category: String (optional)
- score: Number (optional)

Response:
{
  statusCode: 201,
  data: {
    ...document fields,
    aiAnalysis: {
      aiSummary: "...",
      topics: [...],
      policyViolation: {...},
      ...
    }
  }
}
```

## Policy Violations được kiểm tra

- Hate speech, discrimination, hoặc nội dung xúc phạm
- Hoạt động bất hợp pháp hoặc hướng dẫn phạm pháp
- Vi phạm bản quyền hoặc đạo văn
- Nội dung không phù hợp hoặc người lớn
- Thông tin sai lệch hoặc giả mạo
- Spam hoặc nội dung quảng cáo không liên quan đến giáo dục

## Xử lý lỗi

- Nếu Groq API fail: Document vẫn được tạo nhưng không có AI analysis
- Nếu text extraction fail: Sử dụng description làm input cho AI
- Nếu không có parsing libraries: Sử dụng description thay vì extract từ file

## Tối ưu hóa

1. **Caching**: Có thể implement caching cho các document tương tự
2. **Async Processing**: Có thể chuyển AI analysis sang background job
3. **Chunking**: Với file lớn, có thể chunk text trước khi gửi đến Groq
4. **Rate Limiting**: Groq có rate limits, cần implement retry logic

## Troubleshooting

### Lỗi: "GROQ_API_KEY is not configured"
- Kiểm tra file `.env` có `GROQ_API_KEY`
- Restart server sau khi thêm env variable

### Lỗi: "Failed to extract text"
- Cài đặt các parsing libraries (pdf-parse, mammoth, xlsx)
- Kiểm tra file URL có accessible không

### AI Analysis không hiển thị
- Kiểm tra console logs trong backend
- Đảm bảo Groq API key hợp lệ
- Kiểm tra document có `aiAnalysis` field trong response

## Notes

- Groq model sử dụng: `llama-3.1-70b-versatile` (có thể đổi sang `mixtral-8x7b-32768` cho nhanh hơn)
- Max text length: 10,000 characters (có thể điều chỉnh trong `ai.service.js`)
- Response format: JSON object
- Temperature: 0.3 (để có kết quả ổn định)
