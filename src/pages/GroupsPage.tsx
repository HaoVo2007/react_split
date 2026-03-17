import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useGroups } from '../features/groups/hooks'
import { Users, Calendar, Plus, DollarSign, CreditCard, X, Upload } from 'lucide-react'
import type { Group } from '../features/groups/types'

const GroupsPage = () => {
  const { groupsData, isLoading, fetchGroups, createGroup } = useGroups()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => {
    setIsModalOpen(false)
    setFormData({ name: '', description: '' })
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setIsCreating(true)
    try {
      const submitData = new FormData()
      submitData.append('name', formData.name.trim())
      submitData.append('description', formData.description.trim())
      if (selectedImage) {
        submitData.append('image', selectedImage)
      }

      await createGroup(submitData)
      closeModal()
    } catch (error) {
      // Error is handled by the hook (toast notification)
    } finally {
      setIsCreating(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getAvatarUrl = (member: any) => {
    return member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || member.email)}&background=random`
  }

  const renderMemberAvatars = (group: Group) => {
    const maxVisible = 3
    const visibleMembers = group.members.slice(0, maxVisible)
    const remainingCount = group.members.length - maxVisible

    return (
      <div className="flex -space-x-2">
        {visibleMembers.map((member, index) => (
          <img
            key={member.id}
            src={getAvatarUrl(member)}
            alt={member.name || member.email}
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            style={{ zIndex: visibleMembers.length - index }}
          />
        ))}
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center">
            <span className="text-xs font-medium text-slate-600">+{remainingCount}</span>
          </div>
        )}
      </div>
    )
  }

  const formatCurrency = (amount: number): string => {
    // Multiply by 1000 to convert to VND
    // Example: 500 -> 500,000 VND, 1000 -> 1,000,000 VND
    const vndAmount = Math.round(amount * 1000)

    // Format with dots as thousand separators
    const formatted = vndAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

    return `${formatted} VND`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Nhóm của bạn</h1>
          <p className="text-slate-600">Quản lý các nhóm chi phí du lịch của bạn</p>
        </div>

        {/* Stats Overview */}
        {groupsData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng số nhóm</p>
                  <p className="text-2xl font-bold text-slate-900">{groupsData.total_groups}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng đã trả</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(groupsData.total_paid)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng nợ</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(groupsData.total_owed)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Groups List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">Nhóm của bạn</h2>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              Tạo nhóm
            </button>
          </div>

          {!groupsData || groupsData.groups.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-slate-200">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Chưa có nhóm nào</h3>
              <p className="text-slate-600 mb-6">Tạo nhóm du lịch đầu tiên của bạn để bắt đầu chia sẻ chi phí</p>
              <button
                onClick={openModal}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
                Tạo nhóm đầu tiên
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupsData.groups.map((group) => (
                <Link
                  key={group.id}
                  to={`/groups/${group.id}`}
                  className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-200 group"
                >
                  {/* Group Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-xl overflow-hidden">
                    {group.image ? (
                      <img
                        src={group.image}
                        alt={group.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="w-12 h-12 text-white/80" />
                      </div>
                    )}
                  </div>

                  {/* Group Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {group.name}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(group.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{group.total_members} thành viên</span>
                      </div>
                    </div>

                    {/* Members Avatars */}
                    <div className="flex items-center justify-between">
                      {renderMemberAvatars(group)}
                      <span className="text-sm text-slate-500">Xem chi tiết →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Tạo nhóm mới</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Group Image */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden mb-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Xem trước nhóm"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="group-image"
                />
                <label
                  htmlFor="group-image"
                  className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  {selectedImage ? 'Thay đổi ảnh' : 'Thêm ảnh nhóm'}
                </label>
              </div>

              {/* Group Name */}
              <div>
                <label htmlFor="group-name" className="block text-sm font-medium text-slate-700 mb-2">
                  Tên nhóm *
                </label>
                <input
                  id="group-name"
                  type="text"
                  placeholder="Nhập tên nhóm"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              {/* Group Description */}
              <div>
                <label htmlFor="group-description" className="block text-sm font-medium text-slate-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  id="group-description"
                  placeholder="Mô tả nhóm của bạn (tùy chọn)"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !formData.name.trim()}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
                >
                  {isCreating ? 'Đang tạo...' : 'Tạo nhóm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupsPage
