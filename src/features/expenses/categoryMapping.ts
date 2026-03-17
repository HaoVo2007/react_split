import {
  Utensils,
  Coffee,
  Beer,
  Car,
  Bus,
  Train,
  Plane,
  Home,
  Hotel,
  Ticket,
  Music,
  Gamepad2,
  Film,
  Zap,
  ShoppingBag,
  Gift,
  HeartPulse,
  Briefcase,
  Wifi,
  Smartphone,
  Wrench,
  Scissors,
  Baby,
  PawPrint,
  Receipt,
  type LucideIcon,
} from 'lucide-react'

export interface CategoryConfig {
  icon: LucideIcon
  color: string
  label: string
}

export const categoryMapping: Record<string, CategoryConfig> = {
  // Food & Drinks
  food: { icon: Utensils, color: 'bg-orange-100 text-orange-600', label: 'Đồ ăn' },
  drink: { icon: Coffee, color: 'bg-amber-100 text-amber-600', label: 'Đồ uống' },
  alcohol: { icon: Beer, color: 'bg-yellow-100 text-yellow-700', label: 'Rượu bia' },

  // Transport
  transport: { icon: Car, color: 'bg-blue-100 text-blue-600', label: 'Di chuyển' },
  taxi: { icon: Car, color: 'bg-blue-100 text-blue-600', label: 'Taxi' },
  bus: { icon: Bus, color: 'bg-blue-100 text-blue-600', label: 'Xe buýt' },
  train: { icon: Train, color: 'bg-blue-100 text-blue-600', label: 'Tàu hỏa' },
  flight: { icon: Plane, color: 'bg-sky-100 text-sky-600', label: 'Máy bay' },
  fuel: { icon: Zap, color: 'bg-yellow-100 text-yellow-600', label: 'Nhiên liệu' },

  // Accommodation
  lodging: { icon: Home, color: 'bg-purple-100 text-purple-600', label: 'Lưu trú' },
  hotel: { icon: Hotel, color: 'bg-purple-100 text-purple-600', label: 'Khách sạn' },

  // Entertainment
  entertainment: { icon: Ticket, color: 'bg-pink-100 text-pink-600', label: 'Giải trí' },
  music: { icon: Music, color: 'bg-pink-100 text-pink-600', label: 'Âm nhạc' },
  game: { icon: Gamepad2, color: 'bg-pink-100 text-pink-600', label: 'Trò chơi' },
  movie: { icon: Film, color: 'bg-pink-100 text-pink-600', label: 'Phim ảnh' },

  // Shopping
  shopping: { icon: ShoppingBag, color: 'bg-green-100 text-green-600', label: 'Mua sắm' },
  gift: { icon: Gift, color: 'bg-green-100 text-green-600', label: 'Quà tặng' },
  clothes: { icon: ShoppingBag, color: 'bg-green-100 text-green-600', label: 'Quần áo' },

  // Health & Personal
  health: { icon: HeartPulse, color: 'bg-red-100 text-red-600', label: 'Y tế' },
  medical: { icon: HeartPulse, color: 'bg-red-100 text-red-600', label: 'Khám bệnh' },
  beauty: { icon: Scissors, color: 'bg-rose-100 text-rose-600', label: 'Làm đẹp' },

  // Business & Services
  business: { icon: Briefcase, color: 'bg-indigo-100 text-indigo-600', label: 'Công việc' },
  internet: { icon: Wifi, color: 'bg-indigo-100 text-indigo-600', label: 'Internet' },
  phone: { icon: Smartphone, color: 'bg-indigo-100 text-indigo-600', label: 'Điện thoại' },
  repair: { icon: Wrench, color: 'bg-gray-100 text-gray-600', label: 'Sửa chữa' },

  // Family & Pets
  family: { icon: Baby, color: 'bg-teal-100 text-teal-600', label: 'Gia đình' },
  pet: { icon: PawPrint, color: 'bg-teal-100 text-teal-600', label: 'Thú cưng' },

  // Others
  travel: { icon: Plane, color: 'bg-cyan-100 text-cyan-600', label: 'Du lịch' },
  other: { icon: Receipt, color: 'bg-slate-100 text-slate-600', label: 'Khác' },
  misc: { icon: Receipt, color: 'bg-slate-100 text-slate-600', label: 'Khác' },

  // Keep uppercase keys for backward compatibility
  Food: { icon: Utensils, color: 'bg-orange-100 text-orange-600', label: 'Đồ ăn' },
  Transport: { icon: Car, color: 'bg-blue-100 text-blue-600', label: 'Di chuyển' },
  Lodging: { icon: Home, color: 'bg-purple-100 text-purple-600', label: 'Lưu trú' },
  Entertainment: { icon: Ticket, color: 'bg-pink-100 text-pink-600', label: 'Giải trí' },
  Fuel: { icon: Zap, color: 'bg-yellow-100 text-yellow-600', label: 'Nhiên liệu' },
  Shopping: { icon: ShoppingBag, color: 'bg-green-100 text-green-600', label: 'Mua sắm' },
  Travel: { icon: Plane, color: 'bg-cyan-100 text-cyan-600', label: 'Du lịch' },
}

export const getCategoryConfig = (category: string): CategoryConfig => {
  // Try exact match first
  if (categoryMapping[category]) {
    return categoryMapping[category]
  }

  // Try lowercase match
  const lowerCategory = category.toLowerCase()
  if (categoryMapping[lowerCategory]) {
    return categoryMapping[lowerCategory]
  }

  // Try partial match
  for (const [key, config] of Object.entries(categoryMapping)) {
    if (lowerCategory.includes(key.toLowerCase())) {
      return config
    }
  }

  // Return default
  return { icon: Receipt, color: 'bg-slate-100 text-slate-600', label: category }
}

export const getCategoryIcon = (category: string) => {
  return getCategoryConfig(category).icon
}

export const getCategoryColor = (category: string) => {
  return getCategoryConfig(category).color
}

export const getCategoryLabel = (category: string) => {
  return getCategoryConfig(category).label
}

// Build category options for dropdown
export const categoryOptions = [
  { value: 'food', label: 'Đồ ăn' },
  { value: 'drink', label: 'Đồ uống' },
  { value: 'transport', label: 'Di chuyển' },
  { value: 'fuel', label: 'Nhiên liệu' },
  { value: 'hotel', label: 'Khách sạn' },
  { value: 'entertainment', label: 'Giải trí' },
  { value: 'shopping', label: 'Mua sắm' },
  { value: 'health', label: 'Y tế' },
  { value: 'gift', label: 'Quà tặng' },
  { value: 'business', label: 'Công việc' },
  { value: 'other', label: 'Khác' },
]
