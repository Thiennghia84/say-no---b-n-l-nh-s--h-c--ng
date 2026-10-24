# 🛡️ SAY NO – Bản Lĩnh Số Học Đường

Ứng dụng tương tác giả lập tình huống nhóm chat giúp học sinh THCS (11-15 tuổi) rèn luyện kỹ năng nhận diện và dũng cảm từ chối các nội dung độc hại trên không gian mạng xã hội (bẫy lừa đảo Phishing, clip bạo lực, gạ gẫm Grooming, tin giả Deepfake và bắt nạt Cyberbullying).

---

## 🚀 Hướng Dẫn Triển Khai Lên Vercel (Từ GitHub)

Dự án đã được cấu hình tối ưu để triển khai trực tiếp dạng Single Page Application (SPA) lên Vercel:

1. **Đẩy mã nguồn lên kho chứa GitHub cá nhân**:
   ```bash
   git add .
   git commit -m "Cập nhật ứng dụng SAY NO chuẩn Vercel và Gemini AI"
   git push origin main
   ```

2. **Kết nối và Import vào Vercel**:
   - Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng GitHub.
   - Nhấn **"Add New..."** → **"Project"** → Chọn repository `say-no---bản-lĩnh-số-học-đường`.
   - **Framework Preset**: Chọn **Vite**.
   - **Build Command**: `vite build` (hoặc `npm run build`).
   - **Output Directory**: `dist`.
   - Bấm **"Deploy"**.

3. **Cấu hình Routing SPA (`vercel.json`)**:
   - File `vercel.json` đã có sẵn tại thư mục gốc để đảm bảo khi người dùng tải lại trang không bị lỗi 404.

---

## 🔑 Hướng Dẫn Lấy Gemini API Key Miễn Phí (Google AI Studio)

Ứng dụng cho phép người dùng tự nhập API Key cá nhân để sử dụng không giới hạn:

1. Truy cập [Google AI Studio (API Keys)](https://aistudio.google.com/api-keys).
2. Đăng nhập bằng tài khoản Gmail của bạn.
3. Bấm **"Create API key"** (hoặc **"Get API key"**).
4. Sao chép chuỗi ký tự API Key (bắt đầu bằng `AIzaSy...`).
5. Mở ứng dụng SAY NO, bấm vào nút đỏ **"Lấy API key để sử dụng app"** trên thanh Header (hoặc biểu tượng Cài đặt) → Dán mã khóa vào và bấm **"Lưu Thay Đổi"**.

> 💡 **Mẹo chống hết hạn ngạch (Quota):** Nếu dùng nhiều và bị thông báo hết quota hôm nay, bạn chỉ cần dùng một Gmail khác để tạo key mới dán vào và tiếp tục sử dụng miễn phí!

---

## 🤖 Danh Sách Model AI & Cơ Chế Auto-Fallback

Ứng dụng tích hợp chuẩn 4 mô hình Gemini AI chính thức (Tháng 03/2026):

| Mô Hình | Định Danh (Model ID) | Đặc Điểm |
|---|---|---|
| **Gemini 2.5 Flash** (Mặc định) | `gemini-2.5-flash` | Tốc độ cao, cân bằng tối ưu giữa chi phí và chất lượng |
| **Gemini 3 Flash** (Khuyên dùng) | `gemini-3-flash-preview` | Frontier reasoning, thấu hiểu tâm lý học sinh THCS |
| **Gemini 2.5 Flash-Lite** | `gemini-2.5-flash-lite` | Siêu nhẹ, độ trễ thấp nhất cho các tác vụ chat |
| **Gemini 2.5 Pro** | `gemini-2.5-pro` | Phân tích chuyên sâu và đa tầng |

- **Cơ chế Tự động Fallback**: Khi model đang chọn gặp lỗi quá tải (429, 503), hệ thống tự động thử lại ngay với model kế tiếp trong danh sách dự phòng.
- **Chế độ Ngoại tuyến**: Khi chưa nhập key hoặc không có mạng, hệ thống tự động chuyển sang bộ đánh giá sư phạm cục bộ thông minh.

---

## 💻 Chạy Ứng Dụng Trên Máy Cục Bộ (Local)

1. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   # hoặc
   bun install
   ```

2. Khởi chạy môi trường phát triển:
   ```bash
   npm run dev
   # hoặc
   bun run dev
   ```

3. Mở trình duyệt tại: `http://localhost:3000`
