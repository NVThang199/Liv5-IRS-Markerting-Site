# Liv5 Solutions — Website

## Cấu trúc thư mục

```
liv5-site/
├── index.html          Trang chủ (Hero, Stats, CTA)
├── bai-toan.html        Bài toán thị trường
├── tong-quan.html        Tổng quan sản phẩm
├── tinh-nang.html        Tính năng
├── khach-hang.html       Khách hàng mục tiêu + So sánh
├── thuc-te.html          Thực tế triển khai + Đối tác
├── doi-ngu.html          Đội ngũ
├── lo-trinh.html         Lộ trình
├── css/
│   └── styles.css        Toàn bộ CSS, dùng chung cho mọi trang
├── js/
│   ├── lang.js            Logic đổi ngôn ngữ Tiếng Việt / English
│   ├── lang-picker.js     Popup chọn ngôn ngữ khi vào trang lần đầu
│   ├── include.js         Tự động chèn nav.html + footer.html vào mỗi trang
│   └── motion.js          Hiệu ứng: fade-in khi vào trang, scroll-reveal, chuyển trang mượt
├── partials/
│   ├── nav.html            Thanh điều hướng — sửa 1 lần, áp dụng cho mọi trang
│   └── footer.html         Footer — sửa 1 lần, áp dụng cho mọi trang
└── assets/                 Ảnh, logo, PDF (bạn cần tự thêm vào — xem bên dưới)
```

Mỗi trang HTML giờ chỉ chứa nội dung riêng của trang đó (vài KB), không lặp lại
CSS hay nav/footer nữa. Muốn sửa nav hoặc footer, chỉ cần sửa 1 file
(`partials/nav.html` hoặc `partials/footer.html`) — thay đổi áp dụng ngay cho
cả 8 trang.

## ⚠️ Bắt buộc phải chạy qua web server, không mở trực tiếp file

`nav.html` và `footer.html` được nạp vào mỗi trang bằng JavaScript
(`fetch()`), đây là cách duy nhất để "include" HTML mà không cần công cụ
build. Cơ chế này **chỉ hoạt động khi trang được phục vụ qua HTTP**
(`http://` hoặc `https://`) — nếu bạn mở file bằng cách double-click
(`file:///...`), trình duyệt sẽ chặn `fetch()` vì lý do bảo mật và nav/footer
sẽ không hiện ra.

### Xem thử trên máy (local)

Mở terminal tại thư mục này rồi chạy một trong các lệnh sau, sau đó truy cập
`http://localhost:8000`:

```bash
# Python (có sẵn trên hầu hết máy)
python3 -m http.server 8000

# Hoặc Node.js
npx serve .

# Hoặc VS Code: cài extension "Live Server" rồi bấm "Go Live"
```

### Deploy lên internet

Khi deploy lên bất kỳ dịch vụ hosting tĩnh nào (Netlify, Vercel, GitHub Pages,
Cloudflare Pages, hoặc VPS chạy Nginx/Apache...), cơ chế này hoạt động bình
thường vì các dịch vụ đó luôn phục vụ file qua HTTP/HTTPS.

## Thêm ảnh và tài liệu (thư mục `assets/`)

Thư mục `assets/` hiện đang **trống** — các trang đang tham chiếu tới những
file sau, bạn cần tự thêm vào đúng tên file:

- `hero-ui-screenshot.jpg` — ảnh minh họa giao diện (dùng ở trang chủ và Tổng quan)
- `cam16-screenshot.png` — ảnh minh họa màn hình 16 camera (trang Tính năng)
- `nycc-event-1.jpg`, `nycc-event-2.jpg` — ảnh sự kiện NYCC (trang Thực tế triển khai)
- `vbf-logo.png`, `minh-khang-logo.png`, `liv5studio-logo.png`, `fpt-university-logo.png` — logo đối tác
- `Liv5-IRS_Checkpoint4_REPORT.pdf` — báo cáo dự án (được link công khai, không có xác thực — cân nhắc trước khi để public)

## Đổi ngôn ngữ Tiếng Việt / English

**Mỗi khi vào bất kỳ trang nào**, popup chọn ngôn ngữ (cờ Việt Nam / cờ Anh)
sẽ hiện ra — trừ khi người dùng đã từng tick vào ô **"Không hiển thị lại"**
trong popup ở một lần trước đó (lựa chọn này được ghi nhớ qua
`localStorage`, key `liv5-lang-dont-show`). Nếu không tick, popup sẽ tiếp tục
hiện ở mọi trang, mọi lần truy cập.

Nút đổi ngôn ngữ nằm ở footer. Khi bấm, **toàn bộ nội dung trên trang** (nav,
nội dung chính, footer) sẽ đổi ngôn ngữ ngay lập tức, và lựa chọn được ghi nhớ
(qua `localStorage`) cho các lần truy cập sau và khi chuyển qua trang khác.

Muốn thêm bản dịch cho nội dung mới, thêm hai thuộc tính vào thẻ HTML:

```html
<p data-vi="Nội dung tiếng Việt" data-en="English content">Nội dung tiếng Việt</p>
```

Nếu đoạn text có chứa thẻ HTML lồng bên trong (ví dụ `<strong>`), dùng
`data-vi-html` / `data-en-html` thay vì `data-vi` / `data-en`.
