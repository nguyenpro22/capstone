# Beautify Clinic Platform

Nền tảng quản lý và kết nối các phòng khám thẩm mỹ, tích hợp công nghệ AI để phân tích và tư vấn làm đẹp.

## Tổng quan

Dự án này là một nền tảng toàn diện cho ngành thẩm mỹ, kết nối khách hàng với các phòng khám thẩm mỹ chất lượng cao, đồng thời cung cấp công cụ quản lý hiệu quả cho các phòng khám.

## Tính năng chính

### 1. Hệ thống đăng ký và quản lý phòng khám

- **Quy trình đăng ký chi tiết**:
  - Thông tin cơ bản phòng khám
  - Thông tin liên hệ
  - Địa chỉ chi tiết (Thành phố/Quận/Phường)
  - Thông tin ngân hàng
  - Quản lý giấy phép và chứng chỉ
- **Xác minh và đảm bảo chất lượng**:
  - Kiểm tra giấy phép hoạt động
  - Xác minh chứng chỉ chuyên môn
  - Đánh giá tiêu chuẩn cơ sở vật chất

### 2. Công nghệ AI phân tích khuôn mặt

- **Tích hợp Google Cloud Vision API**:
  - Phân tích cảm xúc khuôn mặt
  - Đánh giá độ sáng và tình trạng da
  - Nhận diện đặc điểm khuôn mặt
- **Đề xuất dịch vụ thông minh**:
  - Gợi ý dịch vụ phù hợp với trạng thái cảm xúc
  - Đề xuất liệu trình chăm sóc da
  - Tư vấn kiểu tóc và trang điểm

### 3. Dịch vụ làm đẹp đa dạng

- **Chăm sóc da**:
  - Liệu trình chăm sóc da mặt
  - Peel da
  - Liệu pháp ánh sáng
- **Tạo kiểu tóc**:
  - Tư vấn kiểu tóc
  - Chăm sóc tóc chuyên sâu
- **Dịch vụ trang điểm**:
  - Trang điểm chuyên nghiệp
  - Trang điểm cô dâu
  - Tư vấn phong cách

### 4. Tương tác trực tuyến

- **Livestream làm đẹp**:
  - Chia sẻ mẹo làm đẹp
  - Tư vấn trực tiếp
  - Hỏi đáp với chuyên gia
- **Đánh giá và phản hồi**:
  - Hệ thống đánh giá dịch vụ
  - Chia sẻ trải nghiệm khách hàng
  - Quản lý phản hồi

### 5. Tiêu chuẩn và chính sách

- **Tiêu chuẩn phòng khám**:
  - Yêu cầu về trình độ chuyên môn
  - Tiêu chuẩn cơ sở vật chất
  - Quy định về vệ sinh và an toàn
- **Đảm bảo chất lượng**:
  - Giám sát liên tục
  - Đánh giá định kỳ
  - Xử lý khiếu nại

### 6. Hệ thống quản trị

- **Quản lý doanh thu**:
  - Theo dõi doanh thu theo thời gian
  - Phân tích hiệu suất kinh doanh
  - Báo cáo tài chính
- **Quản lý gói dịch vụ**:
  - Gói Đồng
  - Gói Bạc
  - Gói Vàng

## Yêu cầu hệ thống

### Cấu hình môi trường

1. Node.js (phiên bản LTS mới nhất)
2. NPM hoặc Yarn
3. Google Cloud Platform account với Vision API được kích hoạt

### Cài đặt

```bash
# Clone repository
git clone [repository-url]

# Cài đặt dependencies
npm install

# Cấu hình môi trường
cp .env.example .env
# Cập nhật các biến môi trường cần thiết

# Chạy ứng dụng
npm run dev
```

### Cấu hình Google Cloud Vision API

1. Tạo project trên Google Cloud Platform
2. Kích hoạt Vision API
3. Tạo service account và tải file credentials
4. Đặt file credentials vào `src/keys/service-account.json`

## Triển khai

### Môi trường production

- Khuyến nghị sử dụng Vercel Platform
- Hỗ trợ tự động triển khai (CI/CD)
- Tối ưu hiệu suất tự động

### Bảo mật

- Xác thực người dùng
- Mã hóa dữ liệu nhạy cảm
- Tuân thủ GDPR và các quy định về dữ liệu

## Hỗ trợ đa ngôn ngữ

- Tiếng Việt (mặc định)
- Hỗ trợ mở rộng thêm ngôn ngữ khác

## Đóng góp

Chúng tôi hoan nghênh mọi đóng góp cho dự án. Vui lòng:

1. Fork repository
2. Tạo branch mới
3. Commit các thay đổi
4. Tạo Pull Request
