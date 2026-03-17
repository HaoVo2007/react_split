import { Menu } from 'lucide-react'

interface HeaderProps {
  onMenuToggle: () => void
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  return (
    <header className="sticky top-0 h-16 bg-white shadow-sm border-b border-slate-200 flex items-center px-4 lg:px-6 z-40">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden mr-3 p-2 hover:bg-slate-100 rounded-lg transition-colors"
        aria-label="Mở menu"
      >
        <Menu className="w-6 h-6 text-slate-600" />
      </button>

      <div className="max-w-md w-full">
        <input
          type="text"
          placeholder="Tìm kiếm nhóm..."
          className="w-full px-4 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </header>
  )
}

export default Header
