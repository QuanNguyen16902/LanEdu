# thesorAI - Professional UI/UX Guidelines

Mục tiêu: Xây dựng giao diện LMS chuyên nghiệp, tập trung vào hiệu suất, tránh phong cách "AI-generated" (quá nhiều khoảng trắng, font quá to).

## 1. Typography & Text
- **Font-family:** Inter, Segoe UI, hoặc Sans-serif hệ thống.
- **Font-size:** - Body: `text-sm` (14px) hoặc `text-xs` (12px) cho bảng.
- **Font-weight:** Tuyệt đối KHÔNG dùng `font-bold` (700). 
  - Max weight: `font-semibold` (600) cho tiêu đề chính.
  - Min weight: `font-normal` (400) cho nội dung bảng.
  - Dùng `font-medium` (500) cho các đề mục/header.
- **Text-case:** KHÔNG dùng `uppercase` tự động. Giữ nguyên Sentence case.
- **Color:** Dùng dải màu **Slate** làm nền tảng.
  - **Quy tắc 3 màu:** Trong 1 màn hình chỉ dùng tối đa **3 màu** (không tính Topbar). Ví dụ: Slate (Xám xanh), White (Trắng), và 1 màu Accent duy nhất (Vàng/Xanh/Đen).

## 2. Spacing & Padding (Chống "Béo" giao diện)
- **Container Padding:** Dùng `p-4` hoặc `p-3` cho Card/Main area.
- **Gap:** Dùng `gap-2` hoặc `gap-3`. 
- **Table Styling (Enterprise Structured):** 
  - Header: Background `bg-slate-100` (`#F1F5F9`), Sticky, `font-medium`, 11px, Uppercase.
  - Filter Row: Secondary header row under the main header with `Search` placeholders.
  - Borders: Explicit vertical borders (`border-r border-slate-200`) to separate columns.
  - Rows: Height `h-10`, Content `font-normal` or `font-medium`, 12px. Hover `hover:bg-slate-50`.
  - Handle: Include a `GripVertical` icon in the first column for draggable/list items.
  - Container: Wrap in a rounded container (`border border-slate-200 rounded-lg overflow-hidden shadow-sm`).

## 3. Visual Elements & Colors
- **Borders:** Luôn dùng `border border-slate-200` (mảnh). 
- **Restrained Palette:** Tránh dùng quá nhiều màu (Xanh, Đỏ, Cam, Tím) trong cùng 1 màn hình.
  - Sử dụng các sắc độ của **Slate** (Xám xanh) làm chủ đạo.
  - Accent color: Dùng duy nhất **một màu điểm nhấn** (Ví dụ: Vàng #FACC15 hoặc Xanh Navy) cho các trạng thái Active hoặc Primary Button.
  - Badge: Dùng màu cực nhạt (Subtle), gần như tệp với màu nền để tránh gây rối mắt.
- **Shadows:** Hạn chế tối đa shadow. Nếu dùng, chỉ dùng `shadow-sm`.

## 4. UX Logic
- **Consistency:** Tất cả các trang phải có chung 1 kiểu Header, Toolbar và font size.
- **Focus:** Loại bỏ các thành phần trang trí thừa thãi. Tập trung vào dữ liệu và hành động chính.