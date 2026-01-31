# Cài đặt Packages cho AI Document Analysis

Để sử dụng tính năng AI phân tích tài liệu với Groq, bạn cần cài đặt các packages sau:

## 1. Groq SDK

```bash
cd backend
npm install groq-sdk
```

## 2. Document Parsing Libraries (Tùy chọn nhưng khuyến nghị)

### Để extract text từ PDF:
```bash
npm install pdf-parse
```

### Để extract text từ DOCX:
```bash
npm install mammoth
```

### Để extract text từ Excel:
```bash
npm install xlsx
```

## 3. Cấu hình Environment Variables

Thêm vào file `.env` của backend:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Bạn có thể lấy API key từ: https://console.groq.com/

## 4. Cập nhật documentParser.service.js

Sau khi cài đặt các packages, cập nhật file `backend/src/services/documentParser.service.js`:

### Cho PDF (với pdf-parse):
```javascript
const pdf = require("pdf-parse");

const extractTextFromPDF = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl);
    const buffer = await response.arrayBuffer();
    const data = await pdf(Buffer.from(buffer));
    return data.text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw error;
  }
};
```

### Cho DOCX (với mammoth):
```javascript
const mammoth = require("mammoth");

const extractTextFromDOCX = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl);
    const buffer = await response.arrayBuffer();
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("DOCX extraction error:", error);
    throw error;
  }
};
```

## Lưu ý

- Nếu không cài đặt các parsing libraries, hệ thống sẽ sử dụng description làm input cho AI analysis
- Groq API có rate limits, nên cân nhắc implement caching nếu có nhiều requests
- File size lớn có thể cần chunking để tránh vượt quá token limits
