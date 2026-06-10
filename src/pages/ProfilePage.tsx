import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { AppHeader } from "@/components/layout/AppHeader"
import { BottomNavigation } from "@/components/layout/BottomNavigation"
import { useAuth } from "@/hooks/useAuth"
import { useProfileUpdate } from "@/hooks/useProfileUpdate"
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations"
import { Loader, Check } from "lucide-react"

export function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { updateProfile, isLoading, error, clearError } = useProfileUpdate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [userProfile, setUserProfile] = useState<{
    name: string | null
    image: string | null
  } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("userProfile")
    if (stored) {
      setUserProfile(JSON.parse(stored))
      setPreview(JSON.parse(stored).image || "")
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: userProfile?.name || user?.profile?.name || "",
      phone: "",
      address: "",
    },
    mode: "onBlur",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setPreview(userProfile?.image || "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (false) {
    handleRemoveFile()
  }

  const onSubmit = async (data: UpdateProfileInput) => {
    setSubmitError("")
    setSubmitSuccess(false)
    clearError()

    try {
      const response = await updateProfile({
        name: data.name,
        phone: data.phone,
        address: data.address,
        image: selectedFile || undefined,
      })

      // Update local state
      const responseData = (response as any).data || response
      setUserProfile({
        name: responseData.profile?.name || null,
        image: responseData.profile?.image || null,
      })

      setPreview(responseData.profile?.image || "")
      setSelectedFile(null)
      setSubmitSuccess(true)

      // Dispatch event to notify AppHeader
      window.dispatchEvent(new Event("profileUpdated"))

      setTimeout(() => {
        setSubmitSuccess(false)
      }, 3000)
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Cập nhật hồ sơ thất bại")
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] pb-24 md:pb-8">
      {/* Header */}
      <AppHeader />

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-600" />
              <p className="text-emerald-700 text-sm font-medium">Cập nhật hồ sơ thành công!</p>
            </div>
          )}

          {/* Error Message */}
          {(submitError || error) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{submitError || error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center pb-6 border-b border-slate-200">
              <div className="mb-4">
                {preview ? (
                  <img
                    src={preview}
                    alt="Avatar Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#EEF2FF]"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#EEF2FF] flex items-center justify-center font-bold text-3xl text-[#4F7CFF] font-display border-4 border-[#EEF2FF]">
                    {user?.email.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors"
              >
                Đổi ảnh đại diện
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-slate-500 mt-2">JPG, PNG, GIF (Max 5MB)</p>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tên <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="Võ Anh Hào"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] focus:border-transparent transition-all"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Số điện thoại
              </label>
              <input
                {...register("phone")}
                type="tel"
                placeholder="0982104860"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] focus:border-transparent transition-all"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1.5">{errors.phone.message}</p>
              )}
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Địa chỉ
              </label>
              <textarea
                {...register("address")}
                placeholder="BM, Củ Chi"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] focus:border-transparent transition-all resize-none"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1.5">{errors.address.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#4F7CFF] hover:bg-[#3D6AEE] text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
