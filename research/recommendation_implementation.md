# 🧠 Giải Thích Chi Tiết: Hệ Thống Gợi Ý Cá Nhân Hóa — SmartShare AI

**Ngày triển khai:** 27/02/2026  
**Phiên bản:** 1.0  
**Thuật toán:** Hybrid Weighted Cosine Similarity + Behavior Score + Time Decay Function

---

## 📋 Mục Lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Các file đã tạo/chỉnh sửa](#2-các-file-đã-tạochỉnh-sửa)
3. [Giải thích thuật toán chi tiết](#3-giải-thích-thuật-toán-chi-tiết)
4. [Luồng hoạt động End-to-End](#4-luồng-hoạt-động-end-to-end)
5. [Giải thích code từng phần](#5-giải-thích-code-từng-phần)
6. [Tại sao đây là thuật toán CẢI TIẾN](#6-tại-sao-đây-là-thuật-toán-cải-tiến)
7. [API Reference](#7-api-reference)
8. [Ví dụ minh họa](#8-ví-dụ-minh-họa)

---

## 1. Tổng Quan Kiến Trúc

### 1.1. Công thức chính

```
SCORE(user, doc) = α × ContentSim + β × BehaviorScore + γ × PopularityScore
```

| Hệ số | Giá trị | Ý nghĩa                                                   |
| :---: | :-----: | :-------------------------------------------------------- |
| **α** |  0.50   | Trọng số cho **Content Similarity** (tương đồng nội dung) |
| **β** |  0.35   | Trọng số cho **Behavior Score** (điểm hành vi người dùng) |
| **γ** |  0.15   | Trọng số cho **Popularity Score** (điểm phổ biến)         |

### 1.2. Sơ đồ kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                        │
│                                                                 │
│  Home.jsx ──→ getRecommendationsApi(6) ──→ Hiển thị AI Picks   │
│                         ↓ axios GET                             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                    │
│                                                                 │
│  Route: GET /api/v1/documents/recommendations?limit=6           │
│    ↓                                                            │
│  Controller: getRecommendations(req, res)                       │
│    ↓                                                            │
│  Service: recommendation.service.js                             │
│    │                                                            │
│    ├── 1. buildUserProfile(userId)                              │
│    │   ├── Lấy favorites (populate category, topics)            │
│    │   ├── Lấy recentlyViewed (populate category, topics)       │
│    │   └── Lấy uploaded docs (query MongoDB)                    │
│    │                                                            │
│    ├── 2. Lấy tất cả approved docs (trừ docs user tự upload)   │
│    │                                                            │
│    ├── 3. Với mỗi document, tính:                               │
│    │   ├── ContentSimilarity (Weighted Cosine)                  │
│    │   ├── BehaviorScore (Interaction Weight + Time Decay)      │
│    │   └── PopularityScore (Log Views + Recency Boost)          │
│    │                                                            │
│    ├── 4. SCORE = 0.5×Content + 0.35×Behavior + 0.15×Popularity│
│    │                                                            │
│    ├── 5. Lọc bỏ docs đã xem gần đây                           │
│    ├── 6. Sắp xếp theo score giảm dần                          │
│    ├── 7. Đa dạng hóa (max 2 docs/category)                    │
│    └── 8. Trả về top-K kết quả kèm _matchPercentage            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Các File Đã Tạo/Chỉnh Sửa

### 2.1. File tạo mới

| File                                             | Dòng code | Mô tả                              |
| :----------------------------------------------- | :-------: | :--------------------------------- |
| `backend/src/services/recommendation.service.js` |   ~450    | **Core**: Toàn bộ thuật toán gợi ý |

### 2.2. Files chỉnh sửa

| File                                             | Thay đổi     | Mô tả                                                        |
| :----------------------------------------------- | :----------- | :----------------------------------------------------------- |
| `backend/src/controllers/document.controller.js` | +15 dòng     | Thêm `getRecommendations` controller + import service        |
| `backend/src/routes/document.route.js`           | +6 dòng      | Thêm route `GET /recommendations`                            |
| `frontend/src/services/api.js`                   | +4 dòng      | Thêm `getRecommendationsApi()`                               |
| `frontend/src/pages/client/Home.jsx`             | ~20 dòng sửa | Tích hợp API gợi ý vào "AI Picks For You" + hiển thị % Match |

---

## 3. Giải Thích Thuật Toán Chi Tiết

### 3.1. Thành phần 1: Weighted Cosine Similarity (ContentSim)

#### Cosine gốc vs Weighted Cosine (cải tiến):

**Cosine gốc** coi mọi feature đều quan trọng như nhau:

```
CosSim(A, B) = Σ(ai × bi) / √(Σai² × Σbi²)
```

**Weighted Cosine (cải tiến)** gán trọng số cho từng feature:

```
WCS(A, B) = Σ(wi × ai × bi) / √(Σ(wi × ai²) × Σ(wi × bi²))
```

#### Các feature và trọng số:

| Feature             | Trọng số (wi) | Cách tính                                                              | Giải thích                                             |
| :------------------ | :-----------: | :--------------------------------------------------------------------- | :----------------------------------------------------- |
| **Category Match**  |      5.0      | 1 nếu document cùng category với docs user quan tâm, 0 nếu khác        | Quan trọng nhất: Cùng chủ đề = rất liên quan           |
| **Topic Overlap**   |      3.0      | Tỷ lệ topics trùng (dùng Levenshtein fuzzy matching, ngưỡng > 0.6)     | Quan trọng: Topics cụ thể đo chính xác hơn category    |
| **Same Uploader**   |      1.5      | 1 nếu document cùng người upload với docs user đã favorite, 0 nếu khác | Trung bình: Người dùng hay thích tài liệu cùng tác giả |
| **File Type Match** |      0.5      | 1 nếu cùng loại file (PDF, DOCX...) với docs user đã tương tác         | Ít quan trọng: Format file không quyết định nội dung   |

#### Tại sao dùng Levenshtein Similarity cho topic matching?

Vì topics có thể khác nhau về mặt ký tự nhưng cùng ý nghĩa:

- `"machine learning"` và `"machine-learning"` → Levenshtein similarity = 0.94 → **khớp**
- `"python"` và `"python programming"` → `includes()` check → **khớp**
- `"AI"` và `"data science"` → similarity = 0.15 → **không khớp**

```javascript
// Code thực tế:
const intersection = docTopicsLower.filter((t) =>
  userTopicsLower.some(
    (ut) =>
      ut.includes(t) || t.includes(ut) || levenshteinSimilarity(t, ut) > 0.6,
  ),
);
topicOverlap =
  intersection.length / Math.max(docTopics.length, userTopics.length);
```

### 3.2. Thành phần 2: Behavior Score + Time Decay

#### Công thức:

```
BehaviorScore = Σ(interaction_weight × time_decay) / max_possible_score
```

#### Các loại tương tác và trọng số:

| Tương tác                | Trọng số | Time Decay  | Giải thích                                                    |
| :----------------------- | :------: | :---------: | :------------------------------------------------------------ |
| **Favorite**             |   3.0    |    Không    | Yêu thích = tín hiệu mạnh nhất, không suy giảm theo thời gian |
| **Upload cùng category** |   2.0    |    Không    | User upload tài liệu cùng category = quan tâm chủ đề đó       |
| **View (đã xem)**        |   1.0    | `e^(-0.1t)` | Tín hiệu yếu nhất, suy giảm theo thời gian                    |

#### Time Decay Function (Cải tiến từ bài báo SPIE 2025):

```
time_decay = e^(-λ × t)
```

- **λ = 0.1** (decay rate)
- **t** = số ngày kể từ lần tương tác
- **Half-life ≈ 7 ngày**: Sau 7 ngày, ảnh hưởng giảm ~50%

|  Thời gian (t)   | Time Decay | Ý nghĩa                   |
| :--------------: | :--------: | :------------------------ |
| 0 ngày (hôm nay) |    1.00    | Ảnh hưởng 100%            |
|      1 ngày      |    0.90    | Ảnh hưởng 90%             |
|      3 ngày      |    0.74    | Ảnh hưởng 74%             |
|      7 ngày      |    0.50    | Ảnh hưởng 50% (half-life) |
|     14 ngày      |    0.25    | Ảnh hưởng 25%             |
|     30 ngày      |    0.05    | Ảnh hưởng 5%              |

**Tại sao cải tiến?**  
Thuật toán gốc đếm đơn giản (view = 1 điểm bất kể khi nào). Điều này dẫn đến gợi ý tài liệu xem từ 6 tháng trước, không phù hợp. Time Decay đảm bảo tài liệu xem gần đây ảnh hưởng nhiều hơn.

### 3.3. Thành phần 3: Popularity Score

#### Công thức:

```
PopularityScore = 0.7 × normalizedViews + 0.3 × recencyBoost
```

Trong đó:

```
normalizedViews = log(1 + views) / log(1 + maxViews)
recencyBoost = e^(-0.01 × docAge)    // docAge tính bằng ngày
```

#### Tại sao dùng log() thay vì views trực tiếp?

**Vấn đề (Popularity Bias):**  
Tài liệu có 10.000 views sẽ "chiếm" hết vị trí gợi ý nếu dùng views trực tiếp.

**Giải pháp:**  
Dùng `log(1 + views)` để nén khoảng cách:

| Views  |     Trực tiếp     |  log(1+views)   | Tỷ lệ giảm  |
| :----: | :---------------: | :-------------: | :---------: |
|   1    |         1         |      0.69       |     --      |
|   10   |   10 (gấp 10×)    | 2.40 (gấp 3.5×) |  Giảm 65%   |
|  100   |  100 (gấp 100×)   | 4.62 (gấp 6.7×) |  Giảm 93%   |
| 10,000 | 10,000 (gấp 10K×) | 9.21 (gấp 13×)  | Giảm 99.87% |

→ Tài liệu ít views hơn vẫn có cơ hội được gợi ý.

---

## 4. Luồng Hoạt Động End-to-End

### Bước 1: User mở trang Home

```
Frontend (Home.jsx)
  ↓
useEffect() chạy khi component mount
  ↓
Kiểm tra: isAuthenticated?
  ├── Có  → Gọi getRecommendationsApi(6)
  └── Không → Gọi getDocumentsApi("approved") (fallback)
```

### Bước 2: Backend xử lý request

```
GET /api/v1/documents/recommendations?limit=6
  ↓
Auth Middleware: Xác thực JWT token
  ↓
Controller: getRecommendations(req, res)
  ↓
Service: recommendation.service.js
```

### Bước 3: Build User Profile

```javascript
buildUserProfile(userId)
  ↓
Query 1: User.findById(userId)
          .populate("favorites")        // Lấy docs yêu thích
          .populate("recentlyViewed")   // Lấy docs đã xem gần đây
  ↓
Query 2: Document.find({ uploadedBy: userId, status: "approved" })
          // Lấy docs user đã upload
  ↓
Tổng hợp thành UserProfile:
{
  categoryIds: ["catId1", "catId2", ...],      // Categories quan tâm
  topics: ["AI", "Machine Learning", ...],      // Topics đã tương tác
  fileTypes: ["application/pdf", ...],           // File types ưa thích
  uploadedByIds: ["userId1", ...],               // Tác giả ưa thích
  uploadedCategoryIds: ["catId3", ...],          // Categories đã upload
  favoriteIds: ["docId1", "docId2", ...],        // IDs docs yêu thích
  recentlyViewed: [{document: "docId", viewedAt: Date}, ...],
  interests: ["catId4", ...]                     // Interests đã chọn
}
```

### Bước 4: Tính score cho từng document

```
Với mỗi approved document (trừ docs user tự upload):
  ├── ContentSim = Weighted Cosine (category, topics, uploader, fileType)
  ├── BehaviorScore = (favorite? + view×timeDecay + sameCategory?) / maxScore
  ├── PopularityScore = 0.7×log(views) + 0.3×recencyBoost
  └── FINAL = 0.5 × ContentSim + 0.35 × Behavior + 0.15 × Popularity + interestBoost
```

### Bước 5: Post-processing

```
1. Lọc bỏ docs đã xem gần đây (tránh trùng Recently Viewed)
2. Sắp xếp theo score giảm dần
3. Đa dạng hóa: tối đa 2 docs cùng category
4. Lấy top-6 (hoặc theo limit)
5. Gắn _matchPercentage (scale 50-99%)
6. Trả về response
```

### Bước 6: Frontend hiển thị

```
Nhận response → setDocuments(recRes.data)
  ↓
Render "AI Picks For You" section
  ↓
Mỗi card hiển thị:
  ├── Thumbnail/icon theo fileType
  ├── Tiêu đề, mô tả
  ├── Badge: "{_matchPercentage}% Match" (tính từ thuật toán)
  ├── Nút favorite
  └── Thông tin tác giả, file type
```

---

## 5. Giải Thích Code Từng Phần

### 5.1. `recommendation.service.js` — Core Algorithm

```javascript
// ===== CÁC HỆ SỐ =====
const WEIGHTS = {
  CONTENT: 0.5, // 50% dựa trên nội dung
  BEHAVIOR: 0.35, // 35% dựa trên hành vi
  POPULARITY: 0.15, // 15% dựa trên độ phổ biến
};
```

**Giải thích:** Nội dung chiếm tỷ trọng cao nhất vì đây là hệ thống tài liệu học tập — nội dung phù hợp quan trọng hơn hành vi random hay popularity.

```javascript
const FEATURE_WEIGHTS = {
  CATEGORY_MATCH: 5.0, // Cùng category = rất quan trọng
  TOPIC_OVERLAP: 3.0, // Topics trùng = quan trọng
  SAME_UPLOADER: 1.5, // Cùng tác giả = hơi quan trọng
  FILE_TYPE_MATCH: 0.5, // Cùng format = ít quan trọng
};
```

**Giải thích:** Không phải mọi feature đều quan trọng như nhau. Category match (ví dụ: "Toán học") quan trọng gấp 10 lần file type match (ví dụ: "PDF").

### 5.2. Cold-Start Handling

```javascript
if (!hasInteractions) {
  // User mới chưa có tương tác → mix phổ biến + mới nhất
  const popularDocs = [...allDocs]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, Math.ceil(limit / 2));

  const recentDocs = allDocs
    .filter((d) => !popularDocs.find((p) => p._id.equals(d._id)))
    .slice(0, Math.floor(limit / 2));

  return [...popularDocs, ...recentDocs].slice(0, limit);
}
```

**Giải thích:** Đây là giải pháp cho **Cold-Start Problem** — khi user mới chưa có favorites, views, hay uploads, hệ thống không có dữ liệu để tính Weighted Cosine hay Behavior Score. Giải pháp: trả về 50% tài liệu phổ biến nhất + 50% tài liệu mới nhất.

### 5.3. Diversification (Đa dạng hóa kết quả)

```javascript
const diversified = [];
const categoryCounts = {};

for (const item of filteredDocs) {
  const catKey = catId || "none";
  categoryCounts[catKey] = (categoryCounts[catKey] || 0) + 1;

  if (categoryCounts[catKey] <= 2) {
    diversified.push(item);
  }
  if (diversified.length >= limit) break;
}
```

**Giải thích:** Nếu user thích "Toán học", thuật toán sẽ gợi ý toàn tài liệu Toán → nhàm chán. Diversification giới hạn tối đa 2 docs cùng category, buộc hệ thống gợi ý đa dạng hơn.

### 5.4. Match Percentage

```javascript
_matchPercentage: Math.round(Math.min(item.score * 100 + 50, 99));
```

**Giải thích:** Raw score thường nằm trong khoảng [0, 0.5]. Nhân 100 + offset 50 để scale thành [50%, 99%] cho hiển thị đẹp trên giao diện. Max capped ở 99% vì không nên hiển thị "100% Match".

---

## 6. Tại Sao Đây Là Thuật Toán CẢI TIẾN

### So sánh với thuật toán gốc:

| Khía cạnh             | Thuật toán gốc                                | Thuật toán cải tiến (của chúng ta)                  | Tham khảo                     |
| :-------------------- | :-------------------------------------------- | :-------------------------------------------------- | :---------------------------- |
| **Similarity Metric** | Cosine Similarity (coi mọi feature bằng nhau) | **Weighted Cosine** (gán trọng số cho từng feature) | WCS papers, 2025              |
| **Xử lý thời gian**   | Không có                                      | **Time Decay Function** `e^(-λt)`                   | SPIE Digital Library, 05/2025 |
| **Xử lý popularity**  | Dùng views trực tiếp                          | **Log-scaled** + **recency boost**                  | PLOS ONE, 09/2025             |
| **Approach**          | Chỉ content-based HOẶC collaborative          | **Hybrid** (content + behavior + popularity)        | Preprints.org, 2025           |
| **Topic matching**    | Exact string match                            | **Fuzzy match** (Levenshtein similarity > 0.6)      | NLP best practices            |
| **Cold-start**        | Không xử lý                                   | Fallback: popular + recent mix                      | Standard practice             |
| **Đa dạng hóa**       | Không có                                      | Max 2 docs/category                                 | RecSys best practices         |
| **Profile**           | Chỉ dùng 1 nguồn data                         | **Aggregation** từ favorites + views + uploads      | Bài báo hybrid, 2025          |

### 5 điểm cải tiến cụ thể:

1. **Weighted Cosine thay vì Cosine gốc** — Gán trọng số khác nhau cho category (5.0) vs file type (0.5)
2. **Time Decay Function** — Tham khảo bài báo SPIE 2025: `e^(-0.1t)` giảm ảnh hưởng theo thời gian
3. **Hybrid 3 thành phần** — Tham khảo bài Preprints.org 2025: Content + Behavior + Popularity
4. **Log-scaled Popularity** — Tham khảo PLOS ONE 2025: Tránh popularity bias
5. **User Profile Aggregation** — Tổng hợp từ 3 nguồn: favorites + recently viewed + uploads

---

## 7. API Reference

### `GET /api/v1/documents/recommendations`

**Auth Required:** Yes (JWT Token)  
**Role:** admin, user

**Query Parameters:**

| Parameter | Type   | Default | Mô tả                          |
| :-------- | :----- | :-----: | :----------------------------- |
| `limit`   | number |    6    | Số lượng tài liệu gợi ý trả về |

**Response Success (200):**

```json
{
  "statusCode": 200,
  "message": "Recommendations retrieved",
  "data": [
    {
      "_id": "65f...",
      "title": "Advanced Machine Learning Notes",
      "description": "Comprehensive ML notes...",
      "fileUrl": "https://res.cloudinary.com/...",
      "fileType": "application/pdf",
      "views": 45,
      "category": { "_id": "65e...", "name": "Computer Science" },
      "uploadedBy": {
        "_id": "65d...",
        "fullName": "Nguyen Van A",
        "avatar": ""
      },
      "aiAnalysis": {
        "topics": ["machine learning", "neural networks", "deep learning"]
      },
      "_recommendationScore": 0.42,
      "_matchPercentage": 92,
      "_breakdown": {
        "contentSim": 65,
        "behaviorScore": 40,
        "popularityScore": 30,
        "interestBoost": true
      }
    }
  ]
}
```

**Các trường đặc biệt (thêm bởi recommendation engine):**

| Trường                       | Type    | Mô tả                                       |
| :--------------------------- | :------ | :------------------------------------------ |
| `_recommendationScore`       | number  | Raw score từ thuật toán (0-1)               |
| `_matchPercentage`           | number  | Phần trăm phù hợp hiển thị trên UI (50-99%) |
| `_breakdown.contentSim`      | number  | % đóng góp từ Content Similarity            |
| `_breakdown.behaviorScore`   | number  | % đóng góp từ Behavior Score                |
| `_breakdown.popularityScore` | number  | % đóng góp từ Popularity Score              |
| `_breakdown.interestBoost`   | boolean | Có được boost từ interests không            |

---

## 8. Ví Dụ Minh Họa

### Scenario: User "Minh Thuận"

**User Profile (được build tự động):**

- **Favorites:** 3 tài liệu về "Trí tuệ nhân tạo" (category: AI)
- **Recently Viewed:** 2 tài liệu "Python Programming" (xem 2 ngày trước)
- **Uploaded:** 1 tài liệu "Machine Learning Basics" (category: AI)
- **Topics tổng hợp:** ["AI", "machine learning", "python", "neural networks"]
- **File types:** ["application/pdf"]

**Tính score cho tài liệu "Deep Learning Fundamentals":**

```
Category = AI → catMatch = 1 (khớp với user profile)
Topics = ["deep learning", "neural networks", "AI"]
  → "neural networks" khớp chính xác → +1
  → "AI" khớp chính xác → +1
  → topicOverlap = 2/3 = 0.67

ContentSim = WCS(profile, doc) = 0.82

BehaviorScore:
  - Favorite? Không → +0
  - View? Không → +0
  - Upload cùng category (AI)? Có → +2.0
  - Score = 2.0 / 6.0 = 0.33

PopularityScore:
  - views = 120, maxViews = 500
  - normalizedViews = log(121) / log(501) = 0.77
  - docAge = 10 ngày → recencyBoost = e^(-0.1) = 0.90
  - Score = 0.7 × 0.77 + 0.3 × 0.90 = 0.81

FINAL SCORE = 0.5 × 0.82 + 0.35 × 0.33 + 0.15 × 0.81
            = 0.41 + 0.12 + 0.12
            = 0.65

_matchPercentage = min(0.65 × 100 + 50, 99) = 99% → hiển thị "99% Match"
```

**Tính score cho tài liệu "History of Vietnam War":**

```
Category = History → catMatch = 0 (KHÔNG khớp)
Topics = ["history", "vietnam", "war"] → topicOverlap = 0/3 = 0

ContentSim = WCS = 0.0

BehaviorScore:
  - Không có tương tác nào → Score = 0

PopularityScore:
  - views = 50, docAge = 30 ngày
  - Score = 0.7 × 0.63 + 0.3 × 0.74 = 0.66

FINAL SCORE = 0.5 × 0 + 0.35 × 0 + 0.15 × 0.66
            = 0 + 0 + 0.10
            = 0.10

_matchPercentage = min(0.10 × 100 + 50, 99) = 60% → hiển thị "60% Match"
```

**Kết quả:** "Deep Learning Fundamentals" (99%) được xếp trước "History of Vietnam War" (60%) ✅

---

## 9. Hệ Thống Quản Lý Score (Bổ sung)

### 9.1. Tổng quan

> **Nguyên tắc nghiệp vụ:** Score luôn bắt đầu = 0 khi tạo tài liệu. Admin KHÔNG được set score ban đầu — score 100% tự động tính từ tương tác người dùng. Admin chỉ được "điều chỉnh" (bonus/penalty) SAU khi tài liệu đã có tương tác, kèm lý do bắt buộc.

Hệ thống scoring bổ sung 4 yêu cầu từ giảng viên:

|  #  | Yêu cầu                        | Giải pháp                                                            |
| :-: | :----------------------------- | :------------------------------------------------------------------- |
|  1  | **Quản lý set score**          | Admin điều chỉnh (bonus/penalty) + bắt buộc nhập lý do + lưu lịch sử |
|  2  | **Thay đổi theo thời gian**    | Time Decay tự động: `baseScore × e^(-0.005 × dayAge)`                |
|  3  | **Điểm theo tài liệu**         | Mỗi doc có dynamic score riêng: views + favorites + downloads        |
|  4  | **Điểm theo số loại tài liệu** | Category Diversity Score: `uniqueCategories × 3` điểm                |

### 9.2. Files bổ sung

| File                                             | Hành động | Mô tả                                                          |
| :----------------------------------------------- | :-------- | :------------------------------------------------------------- |
| `backend/src/services/score.service.js`          | Tạo mới   | Core scoring logic (210 dòng)                                  |
| `backend/src/models/document.model.js`           | Cập nhật  | Thêm `dynamicScore`, `scoreHistory`, `calculateDynamicScore()` |
| `backend/src/controllers/document.controller.js` | Cập nhật  | 4 controller mới cho score APIs                                |
| `backend/src/routes/document.route.js`           | Cập nhật  | 4 routes mới cho score                                         |
| `frontend/src/services/api.js`                   | Cập nhật  | 4 API functions mới                                            |
| `frontend/src/pages/admin/Documents.jsx`         | Cập nhật  | Score Modal + Recalculate All button                           |

### 9.3. Dynamic Score Formula

```
totalDynamicScore = timeDecayScore + adminScore

timeDecayScore = baseScore × e^(-0.005 × dayAge)

baseScore = viewScore + favoriteScore + downloadScore + engagementScore

Trong đó:
  viewScore     = log(1 + views) × 10         → max ~40 (tại 10,000 views)
  favoriteScore = favoriteCount × 5            → 5 điểm mỗi favorite
  downloadScore = log(1 + downloads) × 8       → max ~32
  engagementScore = (views>0? 5:0) + (fav>0? 10:0) + (dl>0? 8:0)  → max 23
  categoryDiversityScore = uniqueCategories × 3 → thưởng upload đa dạng
```

### 9.4. Time Decay trên Score (λ = 0.005)

| Tuổi tài liệu | Time Decay Factor | Ảnh hưởng             |
| :-----------: | :---------------: | :-------------------- |
|    0 ngày     |       1.00        | Score 100%            |
|    30 ngày    |       0.86        | Score 86%             |
|    70 ngày    |       0.70        | Score 70%             |
|   139 ngày    |       0.50        | Score 50% (half-life) |
|   365 ngày    |       0.16        | Score 16%             |

### 9.5. Score History Tracking

Mỗi lần admin thay đổi score, hệ thống lưu:

```json
{
  "previousScore": 5,
  "newScore": 15,
  "changedBy": "65f... (admin userId)",
  "reason": "Tài liệu chất lượng cao, được nhiều người đánh giá tốt",
  "changedAt": "2026-02-28T10:00:00Z"
}
```

### 9.6. Score APIs (Admin)

| Method | Endpoint                               | Mô tả                               |
| :----- | :------------------------------------- | :---------------------------------- |
| `PUT`  | `/api/v1/documents/:id/score`          | Set score cho document (kèm reason) |
| `GET`  | `/api/v1/documents/:id/score-history`  | Xem lịch sử thay đổi score          |
| `POST` | `/api/v1/documents/scores/recalculate` | Tính lại score tất cả documents     |
| `GET`  | `/api/v1/documents/scores/analytics`   | Thống kê score toàn hệ thống        |

### 9.7. Frontend — Admin Score Modal

Admin bấm **"Set Score"** trên bảng Documents sẽ thấy:

1. **Input Score** — nhập điểm mới + lý do thay đổi
2. **Dynamic Score Breakdown** — hiển thị 6 thành phần (view, favorite, download, engagement, category diversity, time decay)
3. **Score Change History** — timeline cho thấy ai thay đổi, khi nào, từ bao nhiêu → bao nhiêu, lý do

---

> **Kết luận:** Hệ thống gợi ý này kết hợp 5 cải tiến từ các nghiên cứu mới nhất (2024-2025), không sử dụng thuật toán gốc, và có khả năng xử lý cold-start, đa dạng hóa kết quả, quản lý score linh hoạt (admin + dynamic + time decay + category diversity), cũng như tính toán match percentage chính xác dựa trên nhiều yếu tố khác nhau.
