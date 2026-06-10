# 🎨 SplitTrip - Profile Update Page

## ✅ Hoàn tất ProfilePage

### 📁 Files Created/Updated

✅ **ProfilePage.tsx** - Giao diện cập nhật hồ sơ người dùng
✅ **useProfileUpdate.ts** - Hook xử lý API cập nhật
✅ **validations.ts** - Thêm `updateProfileSchema`
✅ **App.tsx** - Thêm route `/profile`

### 📐 Layout & Components

#### **Header**
```
┌─────────────────────────────────────────┐
│ ✂️ SplitTrip              [Avatar Menu] │
└─────────────────────────────────────────┘
```

#### **Main Content**
```
← Quay lại

📌 Hồ sơ cá nhân
Cập nhật thông tin tài khoản của bạn

┌─────────────────────────────────────────┐
│             [Avatar]                    │
│  Võ Anh Hào (Large)                    │
│  [Đổi ảnh đại diện]                   │
├─────────────────────────────────────────┤
│ Tên * [input]                          │
│ Email [readonly]                       │
│ Số điện thoại [input]                  │
│ Địa chỉ [textarea]                    │
├─────────────────────────────────────────┤
│ [Hủy]  [Lưu thay đổi]                 │
└─────────────────────────────────────────┘

┌──────────────────┬──────────────────┐
│ Role: user       │ ID: 6a26d2...   │
└──────────────────┴──────────────────┘
```

### 🔗 API Integration

#### **Endpoint**
```
POST /api/v1/users/auth/update-profile
Content-Type: multipart/form-data

Request:
- name: string (required)
- phone: string (optional)
- address: string (optional)
- image_type: "upload" | "preset"
- image: File (optional)

Response:
{
  "success": true,
  "message": "update profile successfully",
  "data": {
    "profile": {
      "name": "Võ Anh Hào",
      "image": "https://...",
      "phone": "0982104860",
      "address": "BM, Củ Chi"
    }
  }
}
```

### 🎯 Features

#### **Form Fields**
- ✅ Tên (required, 1-100 chars)
- ✅ Email (read-only)
- ✅ Số điện thoại (optional)
- ✅ Địa chỉ (optional, max 500 chars)

#### **Avatar Upload**
- ✅ Click "Đổi ảnh đại diện" → Select file
- ✅ Preview: Show image or fallback letter
- ✅ Remove option: Revert to current avatar
- ✅ File types: JPG, PNG, GIF (Max 5MB)

#### **Form Validation**
- ✅ Real-time validation
- ✅ Error messages below fields
- ✅ Submit button disabled during loading

#### **State Management**
- ✅ Pre-fill from localStorage (userProfile)
- ✅ Update localStorage after successful update
- ✅ Update UI immediately
- ✅ Success toast message (3 seconds)
- ✅ Error handling

#### **User Flow**
```
1. Click avatar in AppHeader → Navigate to /profile
2. Or click "Hồ sơ cá nhân" in menu → Navigate to /profile
3. Or click "Hồ sơ" in BottomNavigation (mobile) → Navigate to /profile

4. Form loads with current profile data:
   - Name from userProfile or user.profile
   - Email (read-only)
   - Phone from user.profile
   - Address from user.profile

5. Edit fields + upload image (optional)
6. Click "Lưu thay đổi"
7. API call with form-data
8. Success:
   - Update localStorage
   - Update UI state
   - Show success toast
   - Update AppHeader display name/avatar

9. Error: Show error message
```

### 📱 Responsive Design

- **Mobile**: Full width, back button at top
- **Desktop**: Max width 2xl, centered
- **Avatar**: 24x24 in header, 96x96 in form

### 🎨 Styling (ui-rules.mdc)

- ✅ Primary color: `#4F7CFF`
- ✅ Success: Emerald-600
- ✅ Error: Red-500
- ✅ Card: White, rounded-2xl, shadow-sm
- ✅ Inputs: border-slate-200, focus ring
- ✅ Typography: Plus Jakarta Sans (headers), DM Sans (body)

### 🔄 LocalStorage Updates

```typescript
// After successful update
localStorage.setItem("userProfile", JSON.stringify({
  name: response.profile.name,
  image: response.profile.image
}))

// AppHeader will re-render and show updated profile
```

### 🧩 Component Integration

- **AppHeader**: Click avatar → /profile
- **BottomNavigation**: Click "Hồ sơ" → /profile
- **ProfilePage**: Updates profile in real-time
- **useProfileUpdate**: Handles API + localStorage

### ✅ Validation Rules

```typescript
updateProfileSchema = {
  name: min 1, max 100
  phone: optional
  address: max 500
}
```

### 🚀 Navigation

- `/profile` - Protected route
- Back button → Previous page
- Cancel button → Previous page
- Success → Stay on page, show toast

---

**Status**: ✅ Complete & Ready
**Dev Server**: http://localhost:5175/
**Route**: `/profile`
