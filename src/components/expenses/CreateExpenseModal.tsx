import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, Upload, Loader, Hotel, UtensilsCrossed, Plane, Zap, ShoppingBag, MoreHorizontal } from "lucide-react"
import { createExpenseSchema, type CreateExpenseInput } from "@/lib/validations"
import { MemberOption } from "@/components/shared/MemberOption"
import type { GroupMember, Expense } from "@/types"

interface CreateExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  groupMembers: GroupMember[]
  onSubmit: (data: any) => Promise<void>
  isSubmitting: boolean
  expense?: Expense | null
  isEdit?: boolean
}

const EXPENSE_CATEGORIES = [
  { value: "hotel", label: "Khách sạn", icon: Hotel },
  { value: "food", label: "Ăn uống", icon: UtensilsCrossed },
  { value: "transport", label: "Vận chuyển", icon: Plane },
  { value: "activity", label: "Hoạt động", icon: Zap },
  { value: "shopping", label: "Mua sắm", icon: ShoppingBag },
  { value: "other", label: "Khác", icon: MoreHorizontal },
]

const formatMoneyDisplay = (value: number) => {
  if (!value) return ""
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value)
}

const calculateTotalCustomSplit = (customSplitMap: Map<string, number>) => {
  let total = 0
  customSplitMap.forEach((amount) => {
    total += amount
  })
  return total
}

export function CreateExpenseModal({
  isOpen,
  onClose,
  groupMembers,
  onSubmit,
  isSubmitting,
  expense,
  isEdit,
}: CreateExpenseModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set())
  const [paidByUserId, setPaidByUserId] = useState("")
  const [submitError, setSubmitError] = useState<string>("")
  const [showCategoryOptions, setShowCategoryOptions] = useState(false)
  const [showPaidByOptions, setShowPaidByOptions] = useState(false)
  const [isCustomSplit, setIsCustomSplit] = useState(false)
  const [customSplits, setCustomSplits] = useState<Map<string, number>>(new Map())

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateExpenseInput>({
    resolver: zodResolver(createExpenseSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      amount: 0,
      category: "",
      date: "",
    },
  })

  // Pre-fill form when editing
  useEffect(() => {
    if (isEdit && expense) {
      setValue("name", expense.name)
      setValue("amount", expense.amount)
      setValue("category", expense.category)
      setValue("date", expense.created_at.split(" ")[0])
      
      // paid_by giờ là array of objects, lấy id từ [0]
      setPaidByUserId(expense.paid_by[0]?.id || "")
      
      // participants giờ là array of objects, extract ids
      const participantIds = expense.participants?.map((p: any) => p.id) || []
      setSelectedParticipants(new Set(participantIds))
      
      // participant_splits là array of {user, amount}, extract user ids và amounts
      if (expense.participant_splits && expense.participant_splits.length > 0) {
        setIsCustomSplit(true)
        // Populate customSplits map từ participant_splits
        const splitsMap = new Map<string, number>()
        expense.participant_splits.forEach((split: any) => {
          splitsMap.set(split.user.id, split.amount)
        })
        setCustomSplits(splitsMap)
      } else {
        setIsCustomSplit(false)
        setCustomSplits(new Map())
      }
      
      if (expense.image) {
        setPreview(expense.image)
      }
    } else {
      reset()
      setSelectedFile(null)
      setPreview("")
      setSelectedParticipants(new Set())
      setSubmitError("")
      setPaidByUserId("")
      setIsCustomSplit(false)
      setCustomSplits(new Map())
    }
  }, [isOpen, expense, isEdit, setValue, reset])

  const name = watch("name")
  const amount = watch("amount")
  const category = watch("category")
  const date = watch("date")

  // Check if form is valid
  const isFormValid = !!(name && amount > 0 && category && date && selectedParticipants.size > 0 && paidByUserId)

  useEffect(() => {
  }, [name, amount, category, date, selectedParticipants.size, paidByUserId, isFormValid])

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
    setPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const toggleParticipant = (memberId: string) => {
    const newSet = new Set(selectedParticipants)
    if (newSet.has(memberId)) {
      newSet.delete(memberId)
    } else {
      newSet.add(memberId)
    }
    setSelectedParticipants(newSet)
  }

  const handleFormSubmit = async (data: CreateExpenseInput) => {
    const participantsArray = Array.from(selectedParticipants)
    
    // Validate participants
    if (participantsArray.length === 0) {
      setSubmitError("Phải chọn ít nhất 1 người chia sẻ chi phí")
      return
    }

    // Validate paid_by
    if (!paidByUserId) {
      setSubmitError("Phải chọn người thanh toán")
      return
    }

    // Validate paid_by is in participants
    if (!participantsArray.includes(paidByUserId)) {
      setSubmitError("Người thanh toán phải nằm trong danh sách người chia sẻ chi phí")
      return
    }

    // Prepare participant_splits
    const finalPayload: any = {
      ...data,
      participants: participantsArray,
      paid_by: [paidByUserId],
      image: selectedFile || undefined,
    }

    if (isCustomSplit) {
      const customSplitsArray = Array.from(customSplits).map(([userId, amount]) => ({
        user_id: userId,
        amount,
      }))
      
      // Chỉ gửi nếu có nhập số tiền cho ít nhất 1 người
      if (customSplitsArray.length > 0) {
        finalPayload.participant_splits = customSplitsArray
      }
    }

    try {
      await onSubmit(finalPayload)

      // Only reset form after successful submission
      reset()
      setSelectedFile(null)
      setPreview("")
      setSelectedParticipants(new Set())
      setPaidByUserId("")
      setIsCustomSplit(false)
      setCustomSplits(new Map())
      setSubmitError("")
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Tạo chi tiêu thất bại"
      setSubmitError(errorMsg)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-900 font-display">
            {isEdit ? "Chỉnh sửa chi phí" : "Thêm chi phí"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Submit Error */}
          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{submitError}</p>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tên chi phí <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="VD: Tiền khách sạn"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] focus:border-transparent transition-all"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>
            )}
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Số tiền <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register("amount", { valueAsNumber: true })}
                type="number"
                placeholder="VD: 1000"
                step="0.01"
                min="0"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] focus:border-transparent transition-all"
                disabled={isSubmitting}
              />
              {amount > 0 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 pointer-events-none">
                  {formatMoneyDisplay(amount)}
                </div>
              )}
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1.5">{errors.amount.message}</p>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCategoryOptions(!showCategoryOptions)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] focus:border-transparent transition-all text-left flex items-center justify-between bg-white hover:bg-slate-50"
              >
                <div className="flex items-center gap-2 flex-1">
                  {category ? (
                    <>
                      {(() => {
                        const cat = EXPENSE_CATEGORIES.find(c => c.value === category)
                        const IconComponent = cat?.icon
                        return (
                          <>
                            {IconComponent && <IconComponent className="w-4 h-4 text-slate-600 flex-shrink-0" />}
                            <span className="text-slate-900">{cat?.label}</span>
                          </>
                        )
                      })()}
                    </>
                  ) : (
                    <span className="text-slate-500">Chọn danh mục</span>
                  )}
                </div>
                <span className="text-slate-400 text-xs ml-2">▼</span>
              </button>

              {showCategoryOptions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {EXPENSE_CATEGORIES.map((cat) => {
                    const IconComponent = cat.icon
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          setValue("category", cat.value)
                          setShowCategoryOptions(false)
                        }}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 border-b border-slate-100 last:border-b-0 transition-colors"
                      >
                        <IconComponent className="w-4 h-4 text-slate-600 flex-shrink-0" />
                        <span className="text-slate-900">{cat.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1.5">{errors.category.message}</p>
            )}
          </div>

          {/* Date Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ngày <span className="text-red-500">*</span>
            </label>
            <input
              {...register("date")}
              type="date"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] focus:border-transparent transition-all"
              disabled={isSubmitting}
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1.5">{errors.date.message}</p>
            )}
          </div>

          {/* Paid By Member */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Người thanh toán <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPaidByOptions(!showPaidByOptions)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] focus:border-transparent transition-all text-left flex items-center justify-between bg-white hover:bg-slate-50"
              >
                <div className="flex-1">
                  {paidByUserId ? (
                    <MemberOption member={groupMembers.find((m) => m.id === paidByUserId) || groupMembers[0]} />
                  ) : (
                    <span className="text-slate-500">Chọn người thanh toán</span>
                  )}
                </div>
                <span className="text-slate-400 text-xs ml-2">▼</span>
              </button>

              {showPaidByOptions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {groupMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => {
                        setPaidByUserId(member.id)
                        setShowPaidByOptions(false)
                      }}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 border-b border-slate-100 last:border-b-0 transition-colors"
                    >
                      <MemberOption member={member} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!paidByUserId && (
              <p className="text-red-500 text-xs mt-1.5">Phải chọn người thanh toán</p>
            )}
          </div>

          {/* Participants Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Người chia sẻ chi phí <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-slate-50">
              {groupMembers.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">Không có thành viên</p>
              ) : (
                groupMembers.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedParticipants.has(member.id)}
                      onChange={() => toggleParticipant(member.id)}
                      disabled={isSubmitting}
                      className="w-4 h-4 rounded border-slate-300 text-[#4F7CFF] focus:ring-[#4F7CFF] cursor-pointer flex-shrink-0"
                    />
                    <MemberOption member={member} />
                  </label>
                ))
              )}
            </div>
            {selectedParticipants.size === 0 && (
              <p className="text-red-500 text-xs mt-1.5">Phải chọn ít nhất 1 người chia sẻ</p>
            )}
          </div>

          {/* Custom Split Option */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isCustomSplit}
                onChange={(e) => {
                  setIsCustomSplit(e.target.checked)
                  if (!e.target.checked) {
                    setCustomSplits(new Map())
                  }
                }}
                disabled={isSubmitting}
                className="w-4 h-4 rounded border-slate-300 text-[#4F7CFF] focus:ring-[#4F7CFF] cursor-pointer"
              />
              <span className="text-sm font-medium text-slate-900">Chia khoản chi tùy chỉnh</span>
            </label>

            {isCustomSplit && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Tổng chia: <span className={calculateTotalCustomSplit(customSplits) === amount ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
                    {formatMoneyDisplay(calculateTotalCustomSplit(customSplits))}
                  </span> / {formatMoneyDisplay(amount)}
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-white">
                  {selectedParticipants.size === 0 ? (
                    <p className="text-slate-500 text-xs text-center py-4">Chọn participants trước</p>
                  ) : (
                    Array.from(selectedParticipants).map((participantId) => {
                      const member = groupMembers.find((m) => m.id === participantId)
                      return (
                        <div key={participantId} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50">
                          <div className="flex-1 text-sm text-slate-900">
                            {member?.name || member?.email}
                          </div>
                          <input
                            type="number"
                            value={customSplits.get(participantId) || 0}
                            onChange={(e) => {
                              const newMap = new Map(customSplits)
                              const val = Number(e.target.value) || 0
                              if (val > 0) {
                                newMap.set(participantId, val)
                              } else {
                                newMap.delete(participantId)
                              }
                              setCustomSplits(newMap)
                            }}
                            placeholder="0"
                            step="1000"
                            min="0"
                            className="w-24 px-2 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] focus:border-transparent transition-all"
                            disabled={isSubmitting}
                          />
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hình ảnh (tùy chọn)
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
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                  className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-[#4F7CFF] hover:bg-[#EEF2FF] transition-colors flex flex-col items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Tải lên hình ảnh</span>
                  <span className="text-xs text-slate-500">JPG, PNG, GIF (Max 5MB)</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              title={
                isSubmitting ? "Đang lưu..." :
                !name ? "Nhập tên chi phí" :
                amount <= 0 ? "Nhập số tiền > 0" :
                !category ? "Chọn danh mục" :
                !date ? "Chọn ngày" :
                selectedParticipants.size === 0 ? "Chọn ít nhất 1 người chia sẻ" :
                !paidByUserId ? "Chọn người thanh toán" :
                ""
              }
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#4F7CFF] hover:bg-[#3D6AEE] text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Đang lưu...
                </>
              ) : isEdit ? (
                "Cập nhật chi phí"
              ) : (
                "Lưu chi phí"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
