import { useState, useRef } from 'react'
import type { FormEvent } from 'react'
import { useAuthStore } from '../store/authStore'
import { useAuthActions } from '../features/auth/hooks'
import { Button } from '../components/ui/Button'
import { TextInput } from '../components/ui/TextInput'
import { Camera, User } from 'lucide-react'

const ProfilePage = () => {
  const { currentUser } = useAuthStore()
  const { updateProfile } = useAuthActions()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: currentUser?.profile?.name || '',
    phone: currentUser?.profile?.phone || '',
    address: currentUser?.profile?.address || '',
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    currentUser?.profile?.image || null
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const submitData = new FormData()

      // Add text fields
      submitData.append('name', formData.name)
      submitData.append('phone', formData.phone)
      submitData.append('address', formData.address)

      // Add image if selected
      if (selectedImage) {
        submitData.append('image', selectedImage)
      }

      const result = await updateProfile(submitData)

      // Update form data and image preview with fresh data from API
      if (result.userData?.profile) {
        setFormData({
          name: result.userData.profile.name || '',
          phone: result.userData.profile.phone || '',
          address: result.userData.profile.address || '',
        })
        setImagePreview(result.userData.profile.image || null)
      }

      // Reset selected image state
      setSelectedImage(null)
    } catch (error) {
      // Error is handled in the hook with toast
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">Cài đặt hồ sơ</h1>
          <p className="text-sm sm:text-base text-slate-600">Cập nhật thông tin cá nhân và ảnh đại diện của bạn</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Image Section */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 sm:p-8 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Ảnh đại diện"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors duration-200"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            <h2 className="text-white text-lg sm:text-xl font-semibold mt-4">
              {currentUser?.profile?.name || currentUser?.email || 'Người dùng'}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {currentUser?.email}
            </p>
          </div>

          {/* Form Section */}
          <div className="p-4 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <TextInput
                label="Họ và tên"
                name="name"
                type="text"
                placeholder="Nhập họ và tên của bạn"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />

              <TextInput
                label="Số điện thoại"
                name="phone"
                type="tel"
                placeholder="Nhập số điện thoại của bạn"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />

              <div className="flex flex-col gap-1">
                <label htmlFor="address" className="text-sm font-medium text-slate-600">
                  Địa chỉ
                </label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="Nhập địa chỉ của bạn"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={4}
                  className="rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-blue-700">
              Thông tin hồ sơ của bạn giúp người dùng khác kết nối với bạn trong các nhóm và hoạt động.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
