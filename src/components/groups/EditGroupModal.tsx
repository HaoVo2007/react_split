import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, Upload, Loader } from "lucide-react"
import { useGroupActions } from "@/hooks/useGroupActions"
import { updateGroupSchema, type UpdateGroupInput } from "@/lib/validations"
import { Group } from "@/types"

interface EditGroupModalProps {
  isOpen: boolean
  group: Group | null
  onClose: () => void
  onSuccess: () => void
}

export function EditGroupModal({ isOpen, group, onClose, onSuccess }: EditGroupModalProps) {
  const { updateGroup, isLoading, error, clearError } = useGroupActions()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>(group?.image || "")
  const [submitError, setSubmitError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateGroupInput>({
    resolver: zodResolver(updateGroupSchema),
    defaultValues: {
      name: group?.name || "",
      description: group?.description || "",
    },
    mode: "onBlur",
  })

  // Update form when group changes
  useEffect(() => {
    if (group && isOpen) {
      reset({
        name: group.name || "",
        description: group.description || "",
      })
      setPreview(group.image || "")
      setSelectedFile(null)
    }
  }, [group, isOpen, reset])

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
    setPreview(group?.image || "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const onSubmit = async (data: UpdateGroupInput) => {
    if (!group) return

    setSubmitError("")
    clearError()

    try {
      await updateGroup(group.id, {
        name: data.name,
        description: data.description,
        image: selectedFile || undefined,
      })

      onClose()
      onSuccess()
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Chỉnh sửa nhóm thất bại")
    }
  }

  if (!isOpen || !group) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 font-display">Chỉnh sửa nhóm</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {(submitError || error) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{submitError || error}</p>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tên nhóm <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="VD: Phan Thiết Trip"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] focus:border-transparent transition-all"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mô tả (tùy chọn)
            </label>
            <textarea
              {...register("description")}
              placeholder="VD: Du lịch Phan Thiết tháng 6"
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] focus:border-transparent transition-all resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1.5">{errors.description.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hình ảnh nhóm (tùy chọn)
            </label>
            <div className="space-y-3">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-32 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-[#4F7CFF] hover:bg-[#EEF2FF] transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">
                    Tải lên hình ảnh
                  </span>
                  <span className="text-xs text-slate-500">JPG, PNG, GIF (Max 5MB)</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
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
  )
}
