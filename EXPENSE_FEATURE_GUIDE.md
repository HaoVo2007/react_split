# 📊 Tính Năng Quản Lý Chi Phí Nhóm

## Giới Thiệu

Tính năng này cho phép bạn xem danh sách chi phí của một nhóm và thêm chi phí mới cho nhóm đó.

## Các Trang Mới

### 1. **GroupPage** (`src/pages/GroupPage.tsx`)
- **Route**: `/groups/:groupId`
- **Mô tả**: Hiển thị chi tiết nhóm và danh sách chi phí
- **Tính năng**:
  - Hiển thị thông tin nhóm (tên, ảnh, mô tả, số lượng thành viên)
  - Danh sách chi phí với loading state và empty state
  - Nút "Thêm chi phí mới" để mở modal tạo chi phí
  - Quay lại danh sách nhóm
  - Load danh sách thành viên trong group

## Các Component Mới

### 1. **CreateExpenseModal** (`src/components/expenses/CreateExpenseModal.tsx`)
Modal form để tạo chi phí mới với các trường:
- **name**: Tên chi phí (bắt buộc)
- **amount**: Số tiền (bắt buộc)
- **category**: Danh mục chi phí (bắt buộc)
  - Khách sạn (hotel)
  - Ăn uống (food)
  - Vận chuyển (transport)
  - Hoạt động (activity)
  - Mua sắm (shopping)
  - Khác (other)
- **date**: Ngày chi phí (bắt buộc)
- **paid_by**: Người thanh toán (bắt buộc)
- **participants**: Người chia sẻ chi phí (bắt buộc, phải bao gồm paid_by)
- **image**: Ảnh chi phí (tùy chọn)

**Lưu ý quan trọng**: 
- Người thanh toán PHẢI có trong danh sách người chia sẻ
- Nếu không, form sẽ hiển thị thông báo lỗi

### 2. **ExpenseCard** (`src/components/expenses/ExpenseCard.tsx`)
Component hiển thị thông tin chi phí:
- Ảnh chi phí (nếu có)
- Tên chi phí
- Số tiền
- Danh mục (với badge màu khác nhau)
- Người thanh toán
- Ngày tạo

### 3. **Skeleton** (`src/components/shared/Skeleton.tsx`)
Component loading state skeleton

## Hook Mới/Cập Nhật

### **useExpenses** (`src/hooks/useExpenses.ts`) - UPDATED
Hook để quản lý chi phí

**Methods**:
- `fetchExpenses(groupId)`: Lấy danh sách chi phí của nhóm
- `createExpense(data)`: Tạo chi phí mới

**API Endpoints**:
- `GET /expenses/group/:group_id` - Lấy danh sách chi phí
- `POST /expenses` - Tạo chi phí mới (form-data)

### **useGroupMembers** (`src/hooks/useGroupMembers.ts`) - NEW
Hook để quản lý danh sách thành viên trong group

**Methods**:
- `fetchGroupMembers(groupId)`: Lấy danh sách thành viên của nhóm

**API Endpoint**:
- `GET /groups/:group_id/members` - Lấy danh sách thành viên

## Type & Validation Mới

### Types (`src/types/index.ts`)
```typescript
interface Expense {
  id: string
  name: string
  amount: number
  category: string
  image?: string
  image_public_id?: string
  paid_by: GroupMember[]
  participants?: string[]
  created_at: string
  updated_at: string
}

interface CreateExpenseRequest {
  name: string
  amount: number
  category: string
  group_id: string
  paid_by: string
  participants: string[]
  date: string
  image?: File
}
```

### Validation Schema (`src/lib/validations.ts`)
```typescript
export const createExpenseSchema = z.object({
  name: z.string().min(1, "...").max(100, "..."),
  amount: z.number().min(0, "..."),
  category: z.string().min(1, "..."),
  paid_by: z.string().min(1, "..."),
  date: z.string().min(1, "..."),
  participants: z.array(z.string()).min(1, "..."),
})
```

## Luồng Sử Dụng

1. **Người dùng vào trang danh sách nhóm** (`/groups`)
2. **Click vào một nhóm** → Chuyển sang GroupPage (`/groups/:groupId`)
3. **GroupPage tải**:
   - Fetch thông tin nhóm từ API
   - Fetch danh sách chi phí từ API
   - Fetch danh sách thành viên từ API
4. **Nhấn "Thêm chi phí mới"** → Mở CreateExpenseModal
5. **Điền form và submit**:
   - Form validate dữ liệu
   - Gọi API `/expenses` với form-data
   - Nếu thành công: đóng modal, cập nhật danh sách chi phí
   - Nếu lỗi: hiển thị thông báo lỗi

## API Integration

### Request (POST `/expenses`)
```javascript
FormData:
- name: "Tiền khách sạn"
- amount: "1000"
- category: "hotel"
- group_id: "6a26ede90cdb1c7df932ea9d"
- paid_by: "6a26d2738a3740cee8b4bd4a"
- date: "2026-02-10"
- participants: ["6a26d2738a3740cee8b4bd4a", "6a26d3f3d1b2baf9cbac5561"] (array)
- image: File (tùy chọn)
```

### Response (GET `/expenses/group/:group_id`)
```json
{
  "success": true,
  "message": "expenses fetched successfully",
  "data": {
    "expenses": [
      {
        "id": "...",
        "name": "Tiền khách sạn",
        "amount": 1000,
        "category": "hotel",
        "image": "...",
        "image_public_id": "...",
        "paid_by": [{ ... }],
        "created_at": "2026-06-09 14:49:41",
        "updated_at": "2026-06-09 14:49:41"
      }
    ],
    "pagination": { ... }
  }
}
```

### Response (GET `/groups/:group_id/members`)
```json
{
  "success": true,
  "message": "group members fetched successfully",
  "data": [
    {
      "id": "6a26d3f3d1b2baf9cbac5561",
      "email": "tuan@gmail.com",
      "role": "user",
      "status": "active",
      "profile": null
    },
    {
      "id": "6a26d2738a3740cee8b4bd4a",
      "email": "hao@gmail.com",
      "role": "user",
      "status": "active",
      "profile": {
        "name": "HAO",
        "image": "...",
        "address": "...",
        "phone": "..."
      }
    }
  ]
}
```

## Styling & UI Rules

Tất cả components tuân thủ **UI Rules** trong `.cursor/rules/ui-rules.mdc`:
- ✅ Tailwind CSS v3 (không inline style)
- ✅ shadcn/ui components
- ✅ lucide-react icons
- ✅ Responsive design (mobile-first)
- ✅ Loading state & empty state
- ✅ Error handling

## Cách Test

### 1. Chạy dev server
```bash
npm run dev
```

### 2. Truy cập ứng dụng
- Đăng nhập: http://localhost:5173/login
- Vào danh sách nhóm: http://localhost:5173/groups
- Click vào một nhóm → GroupPage

### 3. Test tính năng
- Click "Thêm chi phí mới"
- Điền form (tất cả trường bắt buộc)
- **Lưu ý**: Chọn một người làm "Người thanh toán" và sau đó PHẢI check checkbox cho người đó trong phần "Người chia sẻ chi phí"
- Click "Lưu chi phí"
- Kiểm tra chi phí mới xuất hiện trong danh sách

## Lưu Ý Quan Trọng

1. **Participants phải bao gồm paid_by**: API yêu cầu người thanh toán PHẢI nằm trong danh sách người chia sẻ
2. **FormData cho file upload**: Khi có hình ảnh, cần dùng FormData và set header `Content-Type: multipart/form-data`
3. **Loading states**: Mọi component có trạng thái loading skeleton
4. **Empty states**: Khi không có chi phí, hiển thị empty state với action button
5. **Error handling**: Lỗi API được hiển thị và toast notification
6. **API Response Format**: API trả về `{ success, message, data: {...} }` cần unwrap đúng cách

## Cấu Trúc File

```
src/
├── pages/
│   └── GroupPage.tsx (UPDATED)
├── components/
│   ├── expenses/
│   │   ├── CreateExpenseModal.tsx (NEW)
│   │   ├── ExpenseCard.tsx (NEW)
│   │   └── BalanceSummary.tsx (existing)
│   └── shared/
│       ├── Skeleton.tsx (NEW)
│       └── EmptyState.tsx (UPDATED)
├── hooks/
│   ├── useExpenses.ts (UPDATED)
│   └── useGroupMembers.ts (NEW)
├── lib/
│   └── validations.ts (UPDATED)
├── types/
│   └── index.ts (UPDATED)
├── App.tsx (UPDATED - added route)
└── tsconfig.json (FIXED)
```

## Troubleshooting

### "Người thanh toán phải là một trong những người chia sẻ chi phí"
- Kiểm tra lại: bạn có chọn người thanh toán và tick vào checkbox của người đó không?

### "Phải chọn ít nhất 1 người chia sẻ"
- Tick ít nhất 1 checkbox trong phần "Người chia sẻ chi phí"

### Chi phí không xuất hiện sau submit
- Kiểm tra console để xem có lỗi API không
- Kiểm tra network tab để xem request/response

### Hình ảnh không upload được
- Kiểm tra kích thước file (max 5MB)
- Kiểm tra định dạng file (JPG, PNG, GIF)

### Danh sách chi phí không load
- Kiểm tra API `/expenses/group/:group_id` có trả về data không
- Đảm bảo response format: `{ success, message, data: { expenses: [...], pagination: {...} } }`
