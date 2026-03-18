import { useState, useRef } from 'react'
import type { FormEvent } from 'react'
import { useAuthStore } from '../store/authStore'
import { useAuthActions } from '../features/auth/hooks'
import { useLoadingStore } from '../store/loadingStore'
import { Button } from '../components/ui/Button'
import { TextInput } from '../components/ui/TextInput'
import { Camera, User, X, Check, ImageIcon } from 'lucide-react'
import { FE_DOMAIN } from '../config/env'
import toast from 'react-hot-toast'
import { cn } from '../utils/cn'

// Available preset images - tất cả ảnh trong thư mục public/images
const PRESET_IMAGES = [
  { id: 'image1', name: 'Avatar 1', path: '/images/image1.jpg' },
  { id: 'image2', name: 'Avatar 2', path: '/images/image2.jpg' },
  { id: 'image3', name: 'Avatar 3', path: '/images/image3.jpg' },
  { id: 'image4', name: 'Avatar 4', path: '/images/image4.jpg' },
  { id: 'image5', name: 'Avatar 5', path: '/images/image5.jpg' },
  { id: 'image6', name: 'Avatar 6', path: '/images/image6.jpg' },
  { id: 'image7', name: 'Avatar 7', path: '/images/image7.jpg' },
  { id: 'image8', name: 'Avatar 8', path: '/images/image8.jpg' },
  { id: 'image9', name: 'Avatar 9', path: '/images/image9.jpg' },
  { id: 'image10', name: 'Avatar 10', path: '/images/image10.jpg' },
]

type ImageType = 'upload' | 'preset' | null

const ProfilePage = () => {
  const { currentUser } = useAuthStore()
  const { updateProfile, isUpdatingProfile } = useAuthActions()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Global loading state
  const isAnyLoading = useLoadingStore((state) => state.isAnyLoading)

  const [formData, setFormData] = useState({
    name: currentUser?.profile?.name || '',
    phone: currentUser?.profile?.phone || '',
    address: currentUser?.profile?.address || '',
  })
  
  // Image selection state
  const [imageType, setImageType] = useState<ImageType>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    currentUser?.profile?.image || null
  )
  
  // UI state
  const [showPresetSelector, setShowPresetSelector] = useState(false)

  // Handle file upload selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isAnyLoading) return
    const file = event.target.files?.[0]
    if (file) {
      setImageType('upload')
      setSelectedImage(file)
      setSelectedPresetId(null)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle preset image selection
  const handlePresetSelect = (presetId: string) => {
    if (isAnyLoading) return
    const preset = PRESET_IMAGES.find(img => img.id === presetId)
    if (preset) {
      setImageType('preset')
      setSelectedPresetId(presetId)
      setSelectedImage(null)
      setImagePreview(`${FE_DOMAIN}${preset.path}`)
      setShowPresetSelector(false)
    }
  }

  // Clear image selection
  const handleClearImage = () => {
    if (isAnyLoading) return
    setImageType(null)
    setSelectedImage(null)
    setSelectedPresetId(null)
    setImagePreview(currentUser?.profile?.image || null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // Prevent submission if any API is already loading
    if (isAnyLoading) return

    try {
      const submitData = new FormData()

      // Add text fields
      submitData.append('name', formData.name)
      submitData.append('phone', formData.phone)
      submitData.append('address', formData.address)

      // Add image data based on selection type
      if (imageType === 'upload' && selectedImage) {
        // File upload
        submitData.append('image_type', 'upload')
        submitData.append('image', selectedImage)
      } else if (imageType === 'preset' && selectedPresetId) {
        // Preset image - send the full URL
        const preset = PRESET_IMAGES.find(img => img.id === selectedPresetId)
        if (preset) {
          submitData.append('image_type', 'preset')
          submitData.append('image_url', `${FE_DOMAIN}${preset.path}`)
        }
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

      // Reset image selection state
      setImageType(null)
      setSelectedImage(null)
      setSelectedPresetId(null)
      setShowPresetSelector(false)
      
      toast.success('Cập nhật hồ sơ thành công!')
    } catch (error) {
      // Error is handled in the hook with toast
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

              {/* Change Image Button */}
              <button
                type="button"
                onClick={() => !isAnyLoading && fileInputRef.current?.click()}
                disabled={isAnyLoading}
                className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              </button>

              {/* Clear Image Button (if new image selected) */}
              {(selectedImage || selectedPresetId) && (
                <button
                  type="button"
                  onClick={handleClearImage}
                  disabled={isAnyLoading}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={isAnyLoading}
                className="hidden"
              />
            </div>

            <h2 className="text-white text-lg sm:text-xl font-semibold mt-4">
              {currentUser?.profile?.name || currentUser?.email || 'Người dùng'}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {currentUser?.email}
            </p>

            {/* Image Selection Options */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => !isAnyLoading && setShowPresetSelector(!showPresetSelector)}
                disabled={isAnyLoading}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                  showPresetSelector || selectedPresetId
                    ? "bg-white text-blue-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                )}
              >
                <ImageIcon className="w-4 h-4" />
                {selectedPresetId ? 'Đã chọn ảnh có sẵn' : 'Chọn ảnh có sẵn'}
              </button>
            </div>

            {/* Image Type Indicator */}
            {imageType && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs text-white">
                {imageType === 'upload' ? (
                  <>
                    <Camera className="w-3 h-3" />
                    <span>Ảnh tải lên mới</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3 h-3" />
                    <span>Ảnh có sẵn</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Preset Image Selector */}
          {showPresetSelector && (
            <div className="px-4 sm:px-8 py-4 bg-slate-50 border-b border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-3">Chọn ảnh đại diện có sẵn:</p>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => !isAnyLoading && handlePresetSelect(preset.id)}
                    disabled={isAnyLoading}
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                      selectedPresetId === preset.id
                        ? "border-blue-500 ring-2 ring-blue-500/20"
                        : "border-slate-200 hover:border-blue-300"
                    )}
                  >
                    <img
                      src={`${FE_DOMAIN}${preset.path}`}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedPresetId === preset.id && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

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
                disabled={isAnyLoading}
                required
              />

              <TextInput
                label="Số điện thoại"
                name="phone"
                type="tel"
                placeholder="Nhập số điện thoại của bạn"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={isAnyLoading}
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
                  disabled={isAnyLoading}
                  rows={4}
                  className="rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isUpdatingProfile || isAnyLoading} 
                  className="w-full"
                >
                  {isUpdatingProfile ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
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
