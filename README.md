# Nhớ — Góc ôn tập môn học

Ứng dụng web tiếng Việt, chạy với Node.js 20 trở lên. Không cần `npm install`.

```bash
npm run dev
```

Mở http://localhost:5173. Đổi cổng qua biến môi trường `PORT` nếu cần.

```bash
npm test
npm run build
npm run preview
```

Bản build nằm trong `dist/`, có thể triển khai lên dịch vụ lưu trữ website tĩnh. `preview` phục vụ bản build tại http://localhost:5173; dừng server dev trước khi dùng cùng cổng.

- 4 môn mẫu: Toán học, Vật lý, Tiếng Anh, Lịch sử; tổng cộng 24 thẻ.
- Tìm môn học không cần gõ dấu, lọc theo nhóm, lưu môn yêu thích.
- Lật thẻ, đánh dấu đã nhớ, thêm môn và thẻ riêng.
- Trắc nghiệm tối đa 10 câu ngẫu nhiên, chấm điểm và giải thích từng câu. Cần ít nhất 4 đáp án khác nhau để tạo bài.
- Ghi chú riêng cho từng môn, tự lưu tiến độ và kết quả trên trình duyệt.
- Đồng hồ tập trung 25 phút với tạm dừng, tiếp tục và đặt lại.
- Giao diện thích ứng điện thoại, hỗ trợ bàn phím và giảm chuyển động.

Dữ liệu được lưu bằng localStorage trên trình duyệt đang dùng, không đồng bộ giữa các thiết bị. Xóa dữ liệu trình duyệt sẽ xóa tiến độ. Nếu dữ liệu cũ bị hỏng hoặc không thể đọc, ứng dụng giữ nguyên dữ liệu đó và cảnh báo rằng thay đổi mới chỉ có trong phiên hiện tại. Đồng hồ tập trung đặt lại khi tải lại trang. Giới hạn: 100 môn học, 1.000 thẻ mỗi môn, giữ 100 kết quả gần nhất.

Google Fonts được tải nếu có mạng; khi không tải được, ứng dụng dùng phông chữ hệ thống. Nội dung mẫu chỉ dùng để minh họa ôn tập, có thể bổ sung thẻ theo chương trình học của bạn.

Đã kiểm thử trực tiếp trên Chrome với Playwright: tìm kiếm, lọc, lưu môn, lật thẻ, ghi chú, điểm trắc nghiệm, thêm nội dung riêng, đồng hồ và dữ liệu lưu bị hỏng. Kiểm tra bố cục ở chiều rộng 360–1440 px. Axe không phát hiện vi phạm WCAG A/AA trong các màn thư viện desktop/mobile và hộp thẻ ghi nhớ đã kiểm tra; hình minh họa trang trí được loại trừ. Công cụ và ảnh kiểm thử nằm trong `.browser-check/`, tách khỏi ứng dụng. Có thể dùng `/run-skill-generator` để lưu quy trình chạy Chrome/Playwright trên máy này thành skill dự án.
