import { useDashboardSummary } from '../features/dashboard/hooks'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import {
  Wallet,
  Users,
  ArrowRightLeft,
  Crown,
  Star,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Group,
  UserCircle,
} from 'lucide-react'
// Type is inferred from the hook
import { Card, CardHeader, CardBody, StatsCard } from '../components/ui'
import { LoadingSpinner, EmptyState } from '../components/ui'
import { cn } from '../utils/cn'
import { Link } from 'react-router-dom'

// Format currency helper
const formatCurrency = (amount: number): string => {
  const vndAmount = Math.round(amount * 1000)
  const formatted = vndAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${formatted} VND`
}


const DashboardPage = () => {
  const { data: dashboard, isLoading, error } = useDashboardSummary()

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" label="Đang tải dữ liệu..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <EmptyState
          icon={<Receipt className="w-8 h-8" />}
          title="Không thể tải dữ liệu"
          description={error.message}
        />
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <EmptyState
          icon={<Receipt className="w-8 h-8" />}
          title="Chưa có dữ liệu"
          description="Bắt đầu tạo nhóm và chi phí để xem thống kê"
        />
      </div>
    )
  }

  const { balance, overview, expenses, top_statistics } = dashboard
  const isPositiveBalance = balance.balance >= 0

  // Chart data for expenses breakdown
  const expensesData = [
    { name: 'Đã trả', value: expenses.total_paid, color: '#22c55e' },
    { name: 'Được chia', value: expenses.total_shared, color: '#3b82f6' },
  ]

  // Chart data for overview
  const overviewData = [
    { name: 'Nhóm', value: overview.total_groups, fill: '#3b82f6' },
    { name: 'Giao dịch', value: overview.total_transactions, fill: '#22c55e' },
    { name: 'Bạn bè', value: overview.total_friends, fill: '#f59e0b' },
  ]

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Tổng quan
          </h1>
          <p className="text-slate-500 mt-1">
            Theo dõi chi tiêu và cân bằng của bạn
          </p>
        </div>

        {/* Main Balance Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/3" />
            
            <CardBody className="relative p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Balance Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                      Số dư hiện tại
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={cn(
                      "text-4xl sm:text-5xl font-bold",
                      isPositiveBalance ? "text-green-600" : "text-red-600"
                    )}>
                      {isPositiveBalance ? '+' : '-'}{formatCurrency(Math.abs(balance.balance))}
                    </span>
                    <span className="text-sm text-slate-500">
                      {isPositiveBalance ? 'Bạn được nợ' : 'Bạn đang nợ'}
                    </span>
                  </div>
                </div>

                {/* Balance Breakdown */}
                <div className="flex gap-6 lg:gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Đã trả</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {formatCurrency(balance.you_paid)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Nợ</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {formatCurrency(balance.you_owed)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Tổng nhóm"
            value={overview.total_groups}
            icon={<Group className="w-6 h-6" />}
            variant="default"
          />
          <StatsCard
            title="Giao dịch"
            value={overview.total_transactions}
            icon={<Receipt className="w-6 h-6" />}
            variant="success"
          />
          <StatsCard
            title="Bạn bè"
            value={overview.total_friends}
            icon={<Users className="w-6 h-6" />}
            variant="warning"
          />
          <StatsCard
            title="Tổng chi tiêu"
            value={formatCurrency(expenses.total_paid)}
            icon={<CreditCard className="w-6 h-6" />}
            variant="default"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Expenses Breakdown Chart */}
          <Card>
            <CardHeader 
              title="Phân tích chi tiêu" 
              subtitle="Tỷ lệ giữa đã trả và được chia"
              icon={<PieChartIcon className="w-5 h-5" />}
            />
            <CardBody>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expensesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-lg">
                              <p className="text-sm font-medium text-slate-900">
                                {payload[0].name}
                              </p>
                              <p className="text-sm text-slate-600">
                                {formatCurrency(Number(payload[0].value))}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {expensesData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-600">{item.name}</span>
                    <span className="text-sm font-medium text-slate-900">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Activity Overview Chart */}
          <Card>
            <CardHeader 
              title="Hoạt động" 
              subtitle="Tổng quan nhóm, giao dịch và bạn bè"
              icon={<BarChartIcon className="w-5 h-5" />}
            />
            <CardBody>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overviewData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={80}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[0, 8, 8, 0]}
                      barSize={32}
                    >
                      {overviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Top Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Group */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/3" />
            <CardBody className="relative">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">
                      Nhóm nổi bật
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {top_statistics.top_group.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Tổng chi tiêu: <span className="font-medium text-slate-900">
                      {formatCurrency(top_statistics.top_group.total_spend)}
                    </span>
                  </p>
                  <Link
                    to={`/groups/${top_statistics.top_group.id}`}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-3 font-medium"
                  >
                    Xem chi tiết
                    <ArrowRightLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Top Friend */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -translate-y-1/2 translate-x-1/3" />
            <CardBody className="relative">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                  <UserCircle className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-medium text-purple-600 uppercase tracking-wider">
                      Bạn thân tích cực
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {top_statistics.top_friend.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    <span className="font-medium text-slate-900">
                      {top_statistics.top_friend.total_transactions}
                    </span> giao dịch chung
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Helper icon components
const PieChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
)

const BarChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

export default DashboardPage
