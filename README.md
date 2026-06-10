# 🏔️ SplitTrip — Travel expense splitting app
> React + TypeScript + Vite + shadcn/ui + Tailwind CSS

## 🚀 Khởi chạy

```bash
# Cài dependencies
npm install

# Chạy dev server
npm run dev

# Build production
npm run build
```

## 📁 Cấu trúc project

```
src/
├── assets/              # ảnh, SVG icons
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # AppShell, Sidebar, Header
│   ├── groups/          # Group-related components
│   ├── expenses/        # Expense-related components
│   ├── chat/            # Chat components
│   └── shared/          # Shared components (Avatar, Badge, etc.)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities, API, validators
├── pages/               # Page components
├── store/               # Zustand store
├── types/               # TypeScript interfaces
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🎨 Design System

- **Colors**: Defined in `src/lib/design-tokens.ts`
- **Typography**: Plus Jakarta Sans (headings), DM Sans (body)
- **Spacing**: Tailwind CSS default (4px base)
- **Components**: All from shadcn/ui + Tailwind CSS

## 📝 AI Rules

Check `.cursor/rules/ui-rules.mdc` for strict UI/UX guidelines.

Key rules:
- No hardcoded colors
- Always use Tailwind CSS
- Use shadcn/ui components first
- Icons from lucide-react only
- Loading & empty states required
- TypeScript strict mode

## 🔗 Environment

Copy `.env.example` to `.env` and configure:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:8080
```

---

Made with ❤️ using Cursor AI
