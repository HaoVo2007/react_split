# 🏔️ SplitTrip — Hướng dẫn khởi tạo dự án & AI Rules

> Travel expense splitting app · React + TypeScript + Vite + shadcn/ui

---

## 📦 1. Khởi tạo dự án

```bash
# 1. Tạo project Vite + React + TypeScript
npm create vite@latest splittrip-fe -- --template react-ts
cd splittrip-fe

# 2. Cài Tailwind CSS v3
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

# 3. Cài shadcn/ui (init sẽ hỏi một vài config — chọn default)
npm install -D @types/node
npx shadcn@latest init

# Khi init shadcn chọn:
# ✔ Style: Default
# ✔ Base color: Slate
# ✔ CSS variables: Yes

# 4. Cài các shadcn components cần dùng ngay
npx shadcn@latest add button input label card avatar badge
npx shadcn@latest add dialog sheet tabs separator skeleton
npx shadcn@latest add dropdown-menu toast form

# 5. Cài thêm thư viện cần thiết
npm install axios react-router-dom zustand
npm install react-hook-form @hookform/resolvers zod
npm install lucide-react
npm install date-fns
npm install socket.io-client

# 6. Cài font
# Thêm vào index.html:
# <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
```

---

## 🗂️ 2. Cấu trúc thư mục chuẩn

```
splittrip-fe/
├── public/
├── src/
│   ├── assets/                  # ảnh, svg icons
│   ├── components/
│   │   ├── ui/                  # shadcn components (KHÔNG sửa)
│   │   ├── layout/
│   │   │   ├── AppShell.tsx     # layout wrapper toàn app
│   │   │   ├── Sidebar.tsx      # sidebar điều hướng
│   │   │   └── Header.tsx       # top bar của từng page
│   │   ├── groups/
│   │   │   ├── GroupCard.tsx
│   │   │   ├── GroupList.tsx
│   │   │   ├── CreateGroupModal.tsx
│   │   │   └── MemberTag.tsx
│   │   ├── expenses/
│   │   │   ├── ExpenseCard.tsx
│   │   │   ├── ExpenseForm.tsx
│   │   │   ├── BalanceSummary.tsx
│   │   │   └── DebtItem.tsx
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── ChatInput.tsx
│   │   └── shared/
│   │       ├── UserAvatar.tsx
│   │       ├── AmountBadge.tsx
│   │       ├── EmptyState.tsx
│   │       └── LoadingSpinner.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useGroups.ts
│   │   ├── useExpenses.ts
│   │   └── useChat.ts
│   ├── lib/
│   │   ├── design-tokens.ts     # ⚠️ source of truth cho màu sắc, spacing
│   │   ├── api.ts               # axios instance + tất cả API calls
│   │   ├── socket.ts            # socket.io setup
│   │   ├── utils.ts             # cn(), formatMoney(), formatDate()
│   │   └── validations.ts       # zod schemas
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── GroupDetailPage.tsx
│   │   └── ChatPage.tsx
│   ├── store/
│   │   ├── authStore.ts         # zustand: user, token
│   │   └── groupStore.ts        # zustand: groups, active group
│   ├── types/
│   │   └── index.ts             # tất cả TypeScript interfaces
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .cursor/
│   └── rules/
│       └── ui-rules.mdc         # ⚠️ AI rules — đọc phần 4
├── .env.example
├── tailwind.config.js
└── tsconfig.json
```

---

## 🎨 3. Design Tokens — `src/lib/design-tokens.ts`

> ⚠️ Đây là file "luật" về màu sắc. AI và developer đều phải dùng từ file này, không hardcode.

```ts
// src/lib/design-tokens.ts

export const COLORS = {
  // Brand
  primary:        "#4F7CFF",   // xanh chính — CTA, active state
  primaryHover:   "#3D6AEE",
  primaryLight:   "#EEF2FF",   // background nhẹ khi hover/selected

  // Semantic
  success:        "#22C55E",   // đã trả / số dương
  successLight:   "#F0FDF4",
  danger:         "#EF4444",   // còn nợ / số âm
  dangerLight:    "#FEF2F2",
  warning:        "#F59E0B",
  warningLight:   "#FFFBEB",

  // Neutral
  background:     "#F8FAFF",   // page background
  surface:        "#FFFFFF",   // card, modal background
  border:         "#E2E8F0",
  borderHover:    "#CBD5E1",

  // Text
  textPrimary:    "#0F172A",
  textSecondary:  "#475569",
  textMuted:      "#94A3B8",
  textInverse:    "#FFFFFF",
} as const;

export const TYPOGRAPHY = {
  fontDisplay: "'Plus Jakarta Sans', sans-serif",  // heading, số tiền
  fontBody:    "'DM Sans', sans-serif",             // paragraph, label
} as const;

export const RADIUS = {
  sm:   "rounded-lg",      // button, input
  md:   "rounded-xl",      // dropdown, tooltip
  lg:   "rounded-2xl",     // card, modal
  full: "rounded-full",    // avatar, badge, chip
} as const;

export const SHADOW = {
  card:   "shadow-sm",
  modal:  "shadow-xl",
  hover:  "shadow-md",
} as const;
```

---

## 🤖 4. Cursor AI Rules — `.cursor/rules/ui-rules.mdc`

> Tạo folder `.cursor/rules/` ở root project, tạo file `ui-rules.mdc`.  
> Cursor sẽ tự động đọc file này mỗi khi AI generate code.

````markdown
---
description: UI/UX rules cho SplitTrip frontend — bắt buộc áp dụng cho mọi component
globs: ["src/**/*.tsx", "src/**/*.ts"]
alwaysApply: true
---

# 🎨 SPLITTRIP — UI RULES (BẮT BUỘC)

## Stack & Libraries

- Framework: React 18 + TypeScript (strict mode)
- Styling: Tailwind CSS v3 — KHÔNG dùng inline style
- UI Components: shadcn/ui — ưu tiên dùng trước khi tự build
- Icons: lucide-react DUY NHẤT — không import icon từ thư viện khác
- Forms: react-hook-form + zod validation
- HTTP: axios instance từ `@/lib/api.ts`
- State: zustand cho global state

---

## 🎨 Màu sắc — KHÔNG bao giờ hardcode

Luôn dùng CSS variable hoặc Tailwind class. Mapping như sau:

| Mục đích               | Tailwind class            | Hex tham chiếu |
|------------------------|---------------------------|----------------|
| Nút chính / CTA        | `bg-[#4F7CFF]`            | #4F7CFF        |
| Nút hover              | `hover:bg-[#3D6AEE]`      | #3D6AEE        |
| Background nhẹ primary | `bg-[#EEF2FF]`            | #EEF2FF        |
| Số tiền dương (owed)   | `text-emerald-600`        | #22C55E        |
| Số tiền âm (owe)       | `text-red-500`            | #EF4444        |
| Card background        | `bg-white`                |                |
| Page background        | `bg-[#F8FAFF]`            | #F8FAFF        |
| Border                 | `border-slate-200`        | #E2E8F0        |
| Text chính             | `text-slate-900`          | #0F172A        |
| Text phụ               | `text-slate-500`          | #475569        |
| Text mờ                | `text-slate-400`          | #94A3B8        |

---

## 🧩 Component Patterns — Copy chính xác

### Card chuẩn
```tsx
<div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
```

### Button primary
```tsx
<Button className="bg-[#4F7CFF] hover:bg-[#3D6AEE] text-white rounded-lg font-medium">
```

### Button secondary / ghost
```tsx
<Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg">
```

### Input field
```tsx
<Input className="rounded-lg border-slate-200 focus-visible:ring-[#4F7CFF]" />
```

### Badge số tiền — dương (người khác nợ mình)
```tsx
<span className="text-emerald-600 font-semibold text-sm bg-emerald-50 px-2 py-0.5 rounded-full">
  +{formatMoney(amount)}
</span>
```

### Badge số tiền — âm (mình nợ người khác)
```tsx
<span className="text-red-500 font-semibold text-sm bg-red-50 px-2 py-0.5 rounded-full">
  -{formatMoney(amount)}
</span>
```

### Avatar với fallback
```tsx
<Avatar className="h-9 w-9">
  <AvatarImage src={user.avatar} />
  <AvatarFallback className="bg-[#EEF2FF] text-[#4F7CFF] font-semibold text-sm">
    {getInitials(user.name)}
  </AvatarFallback>
</Avatar>
```

### Empty state
```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
    <IconName className="w-7 h-7 text-slate-400" />
  </div>
  <p className="text-slate-900 font-semibold mb-1">Chưa có dữ liệu</p>
  <p className="text-slate-500 text-sm">Mô tả ngắn hành động tiếp theo</p>
</div>
```

### Loading skeleton
```tsx
<div className="space-y-3">
  {Array.from({ length: 3 }).map((_, i) => (
    <Skeleton key={i} className="h-20 rounded-2xl" />
  ))}
</div>
```

---

## 📐 Layout Rules

- Sidebar: `w-60 fixed left-0 top-0 h-screen bg-white border-r border-slate-100`
- Main content: `ml-60 min-h-screen bg-[#F8FAFF]`
- Page container: `max-w-4xl mx-auto px-6 py-8`
- Section gap: `space-y-6`
- Card grid (2 col): `grid grid-cols-1 md:grid-cols-2 gap-4`

---

## ✍️ Typography Rules

- Font heading (h1, h2, số tiền lớn): `font-['Plus_Jakarta_Sans'] font-bold`
- Font body/paragraph: `font-['DM_Sans']`
- Page title: `text-2xl font-bold text-slate-900`
- Section title: `text-base font-semibold text-slate-900`
- Label: `text-sm font-medium text-slate-700`
- Caption / muted: `text-xs text-slate-400`
- Số tiền lớn (balance): `text-3xl font-bold font-['Plus_Jakarta_Sans']`

---

## ⚡ Bắt buộc cho mọi component

1. **Loading state**: Mọi component fetch data đều có skeleton loading
2. **Empty state**: Mọi list đều có empty state với icon + message
3. **Error handling**: Wrap API call trong try/catch, hiển thị toast error
4. **TypeScript**: Không dùng `any`. Định nghĩa interface rõ ràng trong `src/types/index.ts`
5. **Responsive**: Mobile-first. Sidebar ẩn trên mobile, dùng Sheet
6. **Accessibility**: Button phải có `aria-label` nếu chỉ có icon

---

## 📁 Import alias

Luôn dùng alias `@/` thay vì relative path:
```ts
// ✅ Đúng
import { Button } from "@/components/ui/button"
import { COLORS } from "@/lib/design-tokens"

// ❌ Sai
import { Button } from "../../components/ui/button"
```

---

## 🚫 Tuyệt đối không làm

- Không hardcode màu hex trực tiếp trong JSX (trừ custom color từ design-tokens)
- Không dùng `style={{}}` inline trừ khi không thể dùng Tailwind
- Không import icon từ `react-icons`, `heroicons`, hay bất kỳ lib nào ngoài `lucide-react`
- Không tạo component mới nếu shadcn/ui đã có
- Không bỏ qua loading state và empty state
- Không dùng `useState` cho server data — dùng custom hook
- Không gọi API trực tiếp trong component — gọi qua `src/lib/api.ts`
````

---

## 🔧 5. Cấu hình file nền

### `tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        body:    ["DM Sans", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#4F7CFF",
          hover:   "#3D6AEE",
          light:   "#EEF2FF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### `src/lib/utils.ts`
```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(amount: number, currency = "VND"): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}
```

### `src/types/index.ts`
```ts
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Group {
  id: string
  name: string
  description?: string
  members: User[]
  createdAt: string
  totalExpense: number
}

export interface Expense {
  id: string
  groupId: string
  description: string
  amount: number
  paidBy: User
  splitWith: User[]
  createdAt: string
}

export interface Debt {
  from: User
  to: User
  amount: number
}

export interface Message {
  id: string
  groupId: string
  sender: User
  content: string
  createdAt: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}
```

### `.env.example`
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:8080
```

---

## ✅ 6. Checklist khởi tạo

```
□ npm create vite + react-ts
□ Cài Tailwind CSS v3
□ npx shadcn@latest init
□ Cài đủ shadcn components (xem bước 1)
□ Cài axios, zustand, react-router-dom, react-hook-form, zod, lucide-react, socket.io-client
□ Thêm Google Fonts vào index.html (Plus Jakarta Sans + DM Sans)
□ Tạo src/lib/design-tokens.ts
□ Tạo src/lib/utils.ts (cn, formatMoney, getInitials, formatDate)
□ Tạo src/types/index.ts
□ Cấu hình tailwind.config.js (fontFamily, colors)
□ Tạo .cursor/rules/ui-rules.mdc
□ Tạo .env từ .env.example
□ Tạo cấu trúc folder src/ đầy đủ
□ Test chạy npm run dev thành công
```

---

> 💡 **Tip khi dùng Cursor**: Lần đầu tạo mỗi loại component (card, form, modal...), hãy tự review kỹ và "chốt" nó làm **mẫu chuẩn**. Các lần sau prompt AI: *"Làm tương tự style của GroupCard.tsx"* — AI sẽ giữ được sự đồng nhất.
