import { useParams, Link } from 'react-router-dom'
import { useGroups } from '../features/groups/hooks'
import {
  useExpenses,
  useGroupMembers,
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
  useAddGroupMember,
  useGroupBalance,
} from '../features/expenses/hooks'
import {
  Plus,
  Search,
  ArrowLeft,
  Utensils,
  LayoutDashboard,
  Users,
  TrendingUp,
  Clock,
  X,
  Upload,
  ChevronDown,
  Check,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Receipt,
  ArrowRightLeft,
  Wallet,
  CreditCard,
  PiggyBank,
  Lightbulb,
  Sparkles,
} from 'lucide-react'
import { useState, useMemo, type FormEvent } from 'react'
import type { GroupMemberWithProfile } from '../features/groups/types'
import type { Expense } from '../features/expenses/types'
import { confirmDelete } from '../utils/confirm'
import ExpenseDetailModal from '../components/modals/ExpenseDetailModal'
import toast from 'react-hot-toast'
import { categoryOptions, getCategoryIcon, getCategoryColor, getCategoryLabel } from '../features/expenses/categoryMapping'
import type { GroupBalance } from '../features/expenses/types'

// Overview Tab Component
interface OverviewTabProps {
  groupBalance: GroupBalance | undefined
  isLoading: boolean
  expenses: Expense[]
  formatCurrency: (amount: number) => string
}

const OverviewTab = ({ groupBalance, isLoading, expenses, formatCurrency }: OverviewTabProps) => {
  // Ensure expenses is always an array
  const safeExpenses = expenses || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!groupBalance) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <p className="text-slate-500">Không thể tải dữ liệu tổng quan</p>
      </div>
    )
  }

  // Calculate spending by category
  const spendingByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>()
    safeExpenses.forEach((expense) => {
      const current = categoryMap.get(expense.category) || 0
      categoryMap.set(expense.category, current + expense.amount)
    })
    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }, [safeExpenses])

  const totalSpending = spendingByCategory.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Paid Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Đã trả</p>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{formatCurrency(groupBalance.total_paid)}</p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {safeExpenses.length} giao dịch
          </p>
        </div>

        {/* Total Owed Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Nợ</p>
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{formatCurrency(groupBalance.total_owed)}</p>
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <ArrowRightLeft className="w-3 h-3" />
            {groupBalance.members.filter(m => m.status === 'debtor').length} người nợ
          </p>
        </div>

        {/* Net Position Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-4 sm:p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-blue-100 uppercase tracking-wider font-medium">Số dư</p>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <PiggyBank className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold">
            {groupBalance.total_paid - groupBalance.total_owed >= 0 ? '+' : ''}
            {formatCurrency(Math.abs(groupBalance.total_paid - groupBalance.total_owed))}
          </p>
          <p className="text-xs text-blue-100 mt-1">
            {groupBalance.total_paid >= groupBalance.total_owed ? 'Bạn đang được nợ' : 'Bạn đang nợ'}
          </p>
        </div>
      </div>

      {/* Settlement Optimization - Only show if there are settlements */}
      {groupBalance.settlements && groupBalance.settlements.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Tối ưu thanh toán</h3>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded-full">SMART LOGIC</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Lightbulb className="w-3 h-3" />
              <span>Giảm từ {groupBalance.members.filter(m => m.balance !== 0).length} xuống {groupBalance.settlements?.length || 0} giao dịch</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-4">Chúng tôi đã tính toán số giao dịch tối thiểu để xóa sổ tất cả công nợ.</p>

          <div className="space-y-3">
            {groupBalance.settlements?.map((settlement, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
              >
                {/* From User */}
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <img
                    src={settlement.from_user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(settlement.from_user.name)}&background=random`}
                    alt={settlement.from_user.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{settlement.from_user.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase">Nợ</p>
                  </div>
                </div>

                {/* Amount with Arrow */}
                <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 flex-shrink-0">
                  <div className="hidden sm:block w-12 h-px bg-slate-300" />
                  <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(settlement.amount)}</span>
                    <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="hidden sm:block w-12 h-px bg-slate-300" />
                </div>

                {/* To User */}
                <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:justify-end min-w-0">
                  <div className="text-right min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{settlement.to_user.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase">Nhận</p>
                  </div>
                  <img
                    src={settlement.to_user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(settlement.to_user.name)}&background=random`}
                    alt={settlement.to_user.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-200 flex-shrink-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State - No Expenses Yet */}
      {groupBalance.total_expenses === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có chi phí nào</h3>
          <p className="text-slate-600 mb-6">Chuyến đi của bạn chưa có chi phí nào được thêm. Hãy thêm chi phí đầu tiên để bắt đầu theo dõi.</p>
        </div>
      )}

      {/* Spending by Category & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Spending by Category */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Chi tiêu theo danh mục
          </h3>
          {spendingByCategory.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">Chưa có dữ liệu chi tiêu</p>
          ) : (
            <div className="space-y-3">
              {spendingByCategory.map(({ category, amount }) => {
                const percentage = totalSpending > 0 ? (amount / totalSpending) * 100 : 0
                const Icon = getCategoryIcon(category)
                const colorClass = getCategoryColor(category)
                return (
                  <div key={category} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{getCategoryLabel(category)}</span>
                        <span className="text-sm font-semibold text-slate-900">{formatCurrency(amount)}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Hoạt động gần đây
          </h3>
          <div className="space-y-4">
            {safeExpenses.slice(0, 5).map((expense, index) => {
              const Icon = getCategoryIcon(expense.category)
              const colorClass = getCategoryColor(expense.category)
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">{expense.paid_by[0]?.name || 'Ai đó'}</span> đã thêm{' '}
                      <span className="font-medium text-slate-900">&quot;{expense.name}&quot;</span>
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400">{new Date(expense.created_at).toLocaleDateString('vi-VN')}</span>
                      <span className="text-xs text-slate-300">•</span>
                      <span className="text-xs font-medium text-slate-600">{formatCurrency(expense.amount)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
            {safeExpenses.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">Chưa có hoạt động nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const GroupDetailPage = () => {
  const { groupId } = useParams<{ groupId: string }>()
  const { groupsData } = useGroups()

  // React Query hooks for data fetching
  const { data: expenses = [], isLoading: isExpensesLoading } = useExpenses(groupId || '')
  const { data: members = [], isLoading: isMembersLoading } = useGroupMembers(groupId || '')

  // React Query mutations
  const createExpenseMutation = useCreateExpense()
  const updateExpenseMutation = useUpdateExpense()
  const deleteExpenseMutation = useDeleteExpense()
  const addMemberMutation = useAddGroupMember(groupId || '')

  // UI State
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses'>('overview')

  // Group Balance data
  const { data: groupBalance, isLoading: isBalanceLoading } = useGroupBalance(groupId || '')

  // Balance Detail Modal state
  const [isBalanceDetailModalOpen, setIsBalanceDetailModalOpen] = useState(false)

  // Add Expense Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addFormData, setAddFormData] = useState({
    name: '',
    amount: '',
    category: 'Food',
    paid_by: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [addSelectedParticipants, setAddSelectedParticipants] = useState<string[]>([])
  const [addSelectedImage, setAddSelectedImage] = useState<File | null>(null)
  const [addImagePreview, setAddImagePreview] = useState<string | null>(null)

  // Edit Expense Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    amount: '',
    category: 'Food',
    paid_by: '',
    date: '',
  })
  const [editSelectedParticipants, setEditSelectedParticipants] = useState<string[]>([])
  const [editSelectedImage, setEditSelectedImage] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)

  // View Expense Modal state
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  // Add Member state
  const [inviteEmail, setInviteEmail] = useState('')

  // Derived state
  const currentGroup = useMemo(() => {
    if (!groupsData) return null
    return groupsData.groups.find((g) => g.id === groupId)
  }, [groupsData, groupId])

  const totalSpend = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])

  const filteredExpenses = useMemo(() => {
    if (!searchQuery.trim()) return expenses
    return expenses.filter(
      (expense) =>
        expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [expenses, searchQuery])

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage)
  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredExpenses.slice(start, start + itemsPerPage)
  }, [filteredExpenses, currentPage])

  // Loading state
  const isLoading = isExpensesLoading || isMembersLoading

  // Format helpers
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount: number): string => {
    const vndAmount = Math.round(amount * 1000)
    const formatted = vndAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `${formatted} VND`
  }

  const getMemberAvatar = (member: GroupMemberWithProfile | null | undefined) => {
    if (!member) return `https://ui-avatars.com/api/?name=?&background=random`
    const profileName = member.profile?.name || member.email
    return (
      member.profile?.image ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=random`
    )
  }

  const getMemberName = (member: GroupMemberWithProfile | null | undefined) => {
    if (!member) return 'Không xác định'
    return member.profile?.name || member.email
  }

  // Modal handlers
  const openAddModal = () => {
    setIsAddModalOpen(true)
    if (members && members.length > 0 && !addFormData.paid_by) {
      setAddFormData((prev) => ({ ...prev, paid_by: members[0].id }))
    }
    if (members && members.length > 0 && addSelectedParticipants.length === 0) {
      setAddSelectedParticipants(members.map((m) => m.id))
    }
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setAddFormData({
      name: '',
      amount: '',
      category: 'Food',
      paid_by: members?.[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
    })
    setAddSelectedParticipants(members?.map((m) => m.id) || [])
    setAddSelectedImage(null)
    setAddImagePreview(null)
  }

  const handleAddInputChange = (field: string, value: string) => {
    setAddFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAddSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAddImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleAddParticipant = (memberId: string) => {
    setAddSelectedParticipants((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    )
  }

  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!addFormData.name.trim() || !addFormData.amount || !addFormData.paid_by || addSelectedParticipants.length === 0) {
      return
    }

    const submitData = new FormData()
    submitData.append('name', addFormData.name.trim())
    submitData.append('amount', addFormData.amount)
    submitData.append('category', addFormData.category)
    submitData.append('group_id', groupId || '')
    submitData.append('paid_by', addFormData.paid_by)
    submitData.append('date', addFormData.date)

    addSelectedParticipants.forEach((participantId) => {
      submitData.append('participants', participantId)
    })

    if (addSelectedImage) {
      submitData.append('image', addSelectedImage)
    }

    try {
      await createExpenseMutation.mutateAsync(submitData)
      toast.success('Đã thêm chi phí thành công!')
      closeAddModal()
    } catch {
      // Error handled by mutation
    }
  }

  // Edit Modal handlers
  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense)
    setEditFormData({
      name: expense.name,
      amount: expense.amount.toString(),
      category: expense.category,
      paid_by: expense.paid_by[0]?.id || '',
      date: expense.created_at.split(' ')[0],
    })
    setEditSelectedParticipants(expense.participants?.map((p) => p.id) || [])
    setEditImagePreview(expense.image || null)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingExpense(null)
    setEditFormData({
      name: '',
      amount: '',
      category: 'Food',
      paid_by: '',
      date: '',
    })
    setEditSelectedParticipants([])
    setEditSelectedImage(null)
    setEditImagePreview(null)
  }

  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEditSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleEditParticipant = (memberId: string) => {
    setEditSelectedParticipants((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    )
  }

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editingExpense || !editFormData.name.trim() || !editFormData.amount || !editFormData.paid_by || editSelectedParticipants.length === 0) {
      return
    }

    const submitData = new FormData()
    submitData.append('name', editFormData.name.trim())
    submitData.append('amount', editFormData.amount)
    submitData.append('category', editFormData.category)
    submitData.append('group_id', groupId || '')
    submitData.append('paid_by', editFormData.paid_by)
    submitData.append('date', editFormData.date)

    editSelectedParticipants.forEach((participantId) => {
      submitData.append('participants', participantId)
    })

    if (editSelectedImage) {
      submitData.append('image', editSelectedImage)
    }

    try {
      await updateExpenseMutation.mutateAsync({
        expenseId: editingExpense.id,
        formData: submitData,
      })
      toast.success('Đã cập nhật chi phí thành công!')
      closeEditModal()
    } catch {
      // Error handled by mutation
    }
  }

  // View Modal handlers
  const openViewModal = (expense: Expense) => {
    setViewingExpense(expense)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setViewingExpense(null)
  }

  // Delete handler
  const handleDeleteExpense = async (expenseId: string) => {
    const result = await confirmDelete()

    if (result.isConfirmed) {
      try {
        await deleteExpenseMutation.mutateAsync(expenseId)
        toast.success('Đã xóa chi phí thành công!')
      } catch {
        // Error handled by mutation
      }
    }
  }

  // Add Member handler
  const handleAddMember = async () => {
    if (!inviteEmail.trim()) return

    try {
      await addMemberMutation.mutateAsync(inviteEmail.trim())
      toast.success('Đã thêm thành viên thành công!')
      setInviteEmail('')
    } catch {
      // Error handled by mutation
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-slate-50 overflow-auto">
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        {/* Back Link */}
        <Link to="/groups" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Quay lại Nhóm</span>
        </Link>

        {/* Header Card - White background with shadow */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
          {/* Mobile Layout: Name + Total on same row */}
          <div className="sm:hidden">
            {/* Row 1: Name and Total Spend */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <h1 className="text-lg font-bold text-slate-900 truncate flex-1">{currentGroup?.name || 'Chi tiết nhóm'}</h1>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Tổng</p>
                <p className="text-base font-bold text-slate-900">{formatCurrency(totalSpend)}</p>
              </div>
            </div>
            {/* Row 2: Badge + Stats */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-medium rounded-full">Chuyến đi đang hoạt động</span>
              <span className="text-[10px] text-slate-400">•</span>
              <span className="text-[10px] text-slate-500">{members?.length || 0} thành viên</span>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Left Side - Group Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Chuyến đi đang hoạt động</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">ID: #{groupId?.slice(-8).toUpperCase() || 'KHÔNG XÁC ĐỊNH'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{currentGroup?.name || 'Chi tiết nhóm'}</h1>
              <div className="mt-2 flex items-center gap-2 text-slate-500">
                {currentGroup?.description ? (
                  <p className="text-sm">{currentGroup.description}</p>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{members?.length || 0} thành viên</span>
                    <span className="text-slate-300">•</span>
                    <Receipt className="w-4 h-4" />
                    <span className="text-sm">{expenses.length} chi phí</span>
                  </>
                )}
              </div>
            </div>

            {/* Right Side - Total Spend Only */}
            <div className="flex items-center pt-2 sm:pt-0">
              <div className="text-right">
                <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium">Tổng chi tiêu</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{formatCurrency(totalSpend)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-200 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-1 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm sm:text-base">Tổng quan</span>
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center gap-2 px-1 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === 'expenses'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span className="text-sm sm:text-base">Chi phí</span>
          </button>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab
            groupBalance={groupBalance}
            isLoading={isBalanceLoading}
            expenses={expenses}
            formatCurrency={formatCurrency}
          />
        )}

        {/* Expenses Tab Content */}
        {activeTab === 'expenses' && (
          <>
            {/* Search and Add Expense */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm chi phí..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors text-sm whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Thêm chi phí
          </button>
        </div>

        {/* Expenses List - Mobile Card Layout / Desktop Table */}
        {expenses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Chưa có chi phí nào</h3>
            <p className="text-slate-600 mb-6 text-sm sm:text-base">Thêm chi phí đầu tiên để bắt đầu theo dõi</p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Thêm chi phí
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            {/* Desktop Table Header - Hidden on Mobile */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
              <div className="col-span-3">TÊN</div>
              <div className="col-span-2">NGƯỜI TRẢ</div>
              <div className="col-span-2">DANH MỤC</div>
              <div className="col-span-2">NGÀY</div>
              <div className="col-span-2 text-right">SỐ TIỀN</div>
              <div className="col-span-1 text-center">THAO TÁC</div>
            </div>

            {/* Mobile Card Layout / Desktop Table Body */}
            <div className="divide-y divide-slate-100">
              {paginatedExpenses.map((expense) => {
                const CategoryIcon = getCategoryIcon(expense.category)
                const payer = expense.paid_by[0]

                return (
                  <div key={expense.id}>
                    {/* Mobile Card View */}
                    <div className="sm:hidden p-4 space-y-3">
                      {/* Header: Icon + Name + Amount */}
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryColor(expense.category)}`}>
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-900 text-sm truncate">{expense.name}</h3>
                          <p className="text-xs text-slate-500">{getCategoryLabel(expense.category)}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-slate-900 text-sm">{formatCurrency(expense.amount)}</p>
                        </div>
                      </div>

                      {/* Payer Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {payer ? (
                            <>
                              <img
                                src={payer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(payer.name || payer.email)}&background=random`}
                                alt={payer.name || payer.email}
                                className="w-6 h-6 rounded-full border border-slate-200"
                              />
                              <span className="text-xs text-slate-600">{payer.name || payer.email}</span>
                            </>
                          ) : (
                            <span className="text-xs text-slate-400">Không xác định</span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">{formatDate(expense.created_at)}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => openViewModal(expense)}
                          className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(expense)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Desktop Table Row - Hidden on Mobile */}
                    <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-50 transition-colors items-center">
                      {/* Title */}
                      <div className="col-span-3 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(expense.category)}`}>
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-slate-900 truncate">{expense.name}</span>
                      </div>

                      {/* Paid By */}
                      <div className="col-span-2 flex items-center gap-2">
                        {payer ? (
                          <>
                            <img
                              src={payer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(payer.name || payer.email)}&background=random`}
                              alt={payer.name || payer.email}
                              className="w-8 h-8 rounded-full border border-slate-200"
                            />
                            <span className="text-sm text-slate-700 truncate">{payer.name || payer.email}</span>
                          </>
                        ) : (
                          <span className="text-sm text-slate-400">Không xác định</span>
                        )}
                      </div>

                      {/* Category */}
                      <div className="col-span-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                          {getCategoryLabel(expense.category)}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="col-span-2 text-sm text-slate-600">{formatDate(expense.created_at)}</div>

                      {/* Amount */}
                      <div className="col-span-2 text-right">
                        <span className="font-semibold text-slate-900">{formatCurrency(expense.amount)}</span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex items-center justify-center gap-1">
                        <button
                          onClick={() => openViewModal(expense)}
                          className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(expense)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination - Mobile Optimized */}
            {filteredExpenses.length > itemsPerPage && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50">
                <span className="text-sm text-slate-500">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{' '}
                  {Math.min(currentPage * itemsPerPage, filteredExpenses.length)} / {filteredExpenses.length} chi phí
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Trước</span>
                  </button>
                  
                  {/* Mobile: Show current page / total */}
                  <span className="sm:hidden text-sm text-slate-600 px-2">
                    {currentPage} / {totalPages}
                  </span>
                  
                  {/* Desktop: Show page numbers */}
                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-600 hover:bg-white border border-slate-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">Sau</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Cards - Mobile Stack */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Your Balance Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Số dư của bạn</h3>
              <TrendingUp className={`w-5 h-5 ${groupBalance && (groupBalance.total_paid - groupBalance.total_owed) >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <p className={`text-2xl sm:text-3xl font-bold mb-1 ${groupBalance && (groupBalance.total_paid - groupBalance.total_owed) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {groupBalance
                ? `${(groupBalance.total_paid - groupBalance.total_owed) >= 0 ? '+' : '-'}${formatCurrency(Math.abs(groupBalance.total_paid - groupBalance.total_owed))}`
                : '0 VND'}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 mb-4">
              {groupBalance && groupBalance.members
                ? groupBalance.members.filter(m => m.status === 'creditor').length > 0
                  ? `Bạn được nợ bởi ${groupBalance.members.filter(m => m.status === 'creditor').length} người`
                  : groupBalance.members.filter(m => m.status === 'debtor').length > 0
                    ? `Bạn đang nợ ${groupBalance.members.filter(m => m.status === 'debtor').length} người`
                    : 'Tất cả đã được thanh toán'
                : 'Đang tải...'}
            </p>
            <button
              onClick={() => setIsBalanceDetailModalOpen(true)}
              className="w-full py-2.5 text-blue-600 font-medium bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-sm"
            >
              Xem chi tiết
            </button>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Hoạt động gần đây</h3>
              <Clock className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-3">
              {expenses.slice(0, 3).map((expense, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate">
                      <span className="font-medium">{expense.paid_by[0]?.name || 'Ai đó'}</span> đã thêm &quot;
                      {expense.name}&quot;
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(expense.created_at)}</p>
                  </div>
                </div>
              ))}
              {expenses.length === 0 && <p className="text-sm text-slate-400">Chưa có hoạt động nào</p>}
            </div>
          </div>

          {/* Add Member Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-4 sm:p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="font-semibold text-base sm:text-lg">Thêm thành viên</h3>
            </div>
            <p className="text-blue-100 text-xs sm:text-sm mb-4">Mời người khác tham gia nhóm bằng email.</p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Nhập email người dùng"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
              />
              <button
                onClick={handleAddMember}
                disabled={addMemberMutation.isPending || !inviteEmail.trim()}
                className="w-full px-4 py-2.5 bg-white text-blue-600 text-sm font-medium rounded-xl hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {addMemberMutation.isPending ? 'Đang thêm...' : 'Thêm thành viên'}
              </button>
            </div>
          </div>
        </div>
        </>
        )}
      </div>

      {/* Add Expense Modal - Mobile Responsive */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Thêm chi phí</h2>
              <button onClick={closeAddModal} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="add-expense-name" className="block text-sm font-medium text-slate-700 mb-2">
                  Tên chi phí *
                </label>
                <input
                  id="add-expense-name"
                  type="text"
                  placeholder="Ví dụ: Ăn tối tại nhà hàng"
                  value={addFormData.name}
                  onChange={(e) => handleAddInputChange('name', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="add-expense-amount" className="block text-sm font-medium text-slate-700 mb-2">
                    Số tiền *
                  </label>
                  <input
                    id="add-expense-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={addFormData.amount}
                    onChange={(e) => handleAddInputChange('amount', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="add-expense-category" className="block text-sm font-medium text-slate-700 mb-2">
                    Danh mục *
                  </label>
                  <div className="relative">
                    <select
                      id="add-expense-category"
                      value={addFormData.category}
                      onChange={(e) => handleAddInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white text-sm"
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="add-expense-date" className="block text-sm font-medium text-slate-700 mb-2">
                  Ngày *
                </label>
                <input
                  id="add-expense-date"
                  type="date"
                  value={addFormData.date}
                  onChange={(e) => handleAddInputChange('date', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label htmlFor="add-expense-paid-by" className="block text-sm font-medium text-slate-700 mb-2">
                  Người trả *
                </label>
                <div className="relative">
                  <select
                    id="add-expense-paid-by"
                    value={addFormData.paid_by}
                    onChange={(e) => handleAddInputChange('paid_by', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white text-sm"
                  >
                    <option value="">Chọn người trả</option>
                    {members?.map((member) => (
                      <option key={member.id} value={member.id}>
                        {getMemberName(member)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Người tham gia *</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-3">
                  {members?.map((member) => (
                    <label
                      key={member.id}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={addSelectedParticipants.includes(member.id)}
                          onChange={() => toggleAddParticipant(member.id)}
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors" />
                        <Check className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                      </div>
                      <img
                        src={getMemberAvatar(member)}
                        alt={getMemberName(member)}
                        className="w-8 h-8 rounded-full border border-slate-200"
                      />
                      <span className="flex-1 text-sm text-slate-700">{getMemberName(member)}</span>
                    </label>
                  ))}
                  {(!members || members.length === 0) && (
                    <p className="text-sm text-slate-400 text-center py-2">Chưa có thành viên nào</p>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Đã chọn {addSelectedParticipants.length} / {members?.length || 0}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Hình ảnh hóa đơn (Tùy chọn)</label>
                <div className="flex items-center gap-4">
                  {addImagePreview && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                      <img src={addImagePreview} alt="Receipt preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAddImageSelect}
                      className="hidden"
                      id="add-expense-image"
                    />
                    <label
                      htmlFor="add-expense-image"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      {addSelectedImage ? 'Đổi ảnh' : 'Tải ảnh lên'}
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors text-sm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={
                    createExpenseMutation.isPending ||
                    !addFormData.name.trim() ||
                    !addFormData.amount ||
                    !addFormData.paid_by ||
                    addSelectedParticipants.length === 0
                  }
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors text-sm"
                >
                  {createExpenseMutation.isPending ? 'Đang thêm...' : 'Thêm chi phí'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Expense Modal - Mobile Responsive */}
      {isEditModalOpen && editingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Sửa chi phí</h2>
              <button onClick={closeEditModal} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="edit-expense-name" className="block text-sm font-medium text-slate-700 mb-2">
                  Tên chi phí *
                </label>
                <input
                  id="edit-expense-name"
                  type="text"
                  placeholder="Ví dụ: Ăn tối tại nhà hàng"
                  value={editFormData.name}
                  onChange={(e) => handleEditInputChange('name', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="edit-expense-amount" className="block text-sm font-medium text-slate-700 mb-2">
                    Số tiền *
                  </label>
                  <input
                    id="edit-expense-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={editFormData.amount}
                    onChange={(e) => handleEditInputChange('amount', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="edit-expense-category" className="block text-sm font-medium text-slate-700 mb-2">
                    Danh mục *
                  </label>
                  <div className="relative">
                    <select
                      id="edit-expense-category"
                      value={editFormData.category}
                      onChange={(e) => handleEditInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white text-sm"
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="edit-expense-date" className="block text-sm font-medium text-slate-700 mb-2">
                  Ngày *
                </label>
                <input
                  id="edit-expense-date"
                  type="date"
                  value={editFormData.date}
                  onChange={(e) => handleEditInputChange('date', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label htmlFor="edit-expense-paid-by" className="block text-sm font-medium text-slate-700 mb-2">
                  Người trả *
                </label>
                <div className="relative">
                  <select
                    id="edit-expense-paid-by"
                    value={editFormData.paid_by}
                    onChange={(e) => handleEditInputChange('paid_by', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white text-sm"
                  >
                    <option value="">Chọn người trả</option>
                    {members?.map((member) => (
                      <option key={member.id} value={member.id}>
                        {getMemberName(member)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Người tham gia *</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-3">
                  {members?.map((member) => (
                    <label
                      key={member.id}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={editSelectedParticipants.includes(member.id)}
                          onChange={() => toggleEditParticipant(member.id)}
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors" />
                        <Check className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                      </div>
                      <img
                        src={getMemberAvatar(member)}
                        alt={getMemberName(member)}
                        className="w-8 h-8 rounded-full border border-slate-200"
                      />
                      <span className="flex-1 text-sm text-slate-700">{getMemberName(member)}</span>
                    </label>
                  ))}
                  {(!members || members.length === 0) && (
                    <p className="text-sm text-slate-400 text-center py-2">Chưa có thành viên nào</p>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Đã chọn {editSelectedParticipants.length} / {members?.length || 0}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Hình ảnh hóa đơn (Tùy chọn)</label>
                <div className="flex items-center gap-4">
                  {editImagePreview && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                      <img src={editImagePreview} alt="Receipt preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageSelect}
                      className="hidden"
                      id="edit-expense-image"
                    />
                    <label
                      htmlFor="edit-expense-image"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      {editSelectedImage ? 'Đổi ảnh' : editImagePreview ? 'Đổi ảnh' : 'Tải ảnh lên'}
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors text-sm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={
                    updateExpenseMutation.isPending ||
                    !editFormData.name.trim() ||
                    !editFormData.amount ||
                    !editFormData.paid_by ||
                    editSelectedParticipants.length === 0
                  }
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors text-sm"
                >
                  {updateExpenseMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Expense Detail Modal */}
      <ExpenseDetailModal
        expenseId={viewingExpense?.id || ''}
        expenseName={viewingExpense?.name || ''}
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
      />

      {/* Balance Detail Modal */}
      {isBalanceDetailModalOpen && groupBalance && (
        <div className="fixed inset-0 bg-black p-3 bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Chi tiết số dư</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Thông tin thanh toán chi tiết của nhóm</p>
              </div>
              <button
                onClick={() => setIsBalanceDetailModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Summary Section */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Tổng chi tiêu</p>
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(groupBalance.total_expenses)}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Đã trả</p>
                  <p className="text-sm font-bold text-green-600">{formatCurrency(groupBalance.total_paid)}</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Còn nợ</p>
                  <p className="text-sm font-bold text-red-600">{formatCurrency(groupBalance.total_owed)}</p>
                </div>
              </div>

              {/* Members Balance List */}
              <div>
                <h3 className="font-semibold text-slate-900 text-sm mb-3">Thành viên trong nhóm</h3>
                <div className="space-y-2">
                  {groupBalance.members.map((member) => (
                    <div
                      key={member.user_id}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        member.status === 'creditor'
                          ? 'bg-green-50'
                          : member.status === 'debtor'
                            ? 'bg-red-50'
                            : 'bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                          alt={member.name}
                          className="w-10 h-10 rounded-full border border-slate-200"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{member.name}</p>
                          <p className="text-xs text-slate-500">
                            {member.status === 'creditor'
                              ? 'Cần nhận lại'
                              : member.status === 'debtor'
                                ? 'Cần trả'
                                : 'Đã xong'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${
                          member.balance > 0 ? 'text-green-600' : member.balance < 0 ? 'text-red-600' : 'text-slate-600'
                        }`}>
                          {member.balance > 0 ? '+' : ''}{formatCurrency(member.balance)}
                        </p>
                        <p className="text-xs text-slate-400">
                          Đã trả: {formatCurrency(member.total_paid)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settlements Section */}
              {groupBalance.settlements && groupBalance.settlements.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-3">Cần thanh toán</h3>
                  <div className="space-y-2">
                    {groupBalance.settlements.map((settlement, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <img
                            src={settlement.from_user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(settlement.from_user.name)}&background=random`}
                            alt={settlement.from_user.name}
                            className="w-8 h-8 rounded-full border border-slate-200"
                          />
                          <span className="text-sm font-medium text-slate-900">{settlement.from_user.name}</span>
                        </div>
                        <div className="flex items-center gap-2 px-2">
                          <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-bold text-slate-900">{formatCurrency(settlement.amount)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">{settlement.to_user.name}</span>
                          <img
                            src={settlement.to_user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(settlement.to_user.name)}&background=random`}
                            alt={settlement.to_user.name}
                            className="w-8 h-8 rounded-full border border-slate-200"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {(!groupBalance.settlements || groupBalance.settlements.length === 0) && (
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">Tất cả mọi người đã thanh toán xong!</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 sm:p-6 border-t border-slate-200">
              <button
                onClick={() => setIsBalanceDetailModalOpen(false)}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-sm transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupDetailPage
