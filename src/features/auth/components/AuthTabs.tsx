import { Link } from 'react-router-dom'

type AuthTab = {
  label: string
  to: string
  active?: boolean
}

type AuthTabsProps = {
  tabs: AuthTab[]
}

export const AuthTabs = ({ tabs }: AuthTabsProps) => (
  <nav className="flex items-center justify-center gap-8">
    {tabs.map((tab) => (
      <Link
        key={tab.label}
        to={tab.to}
        className={`relative px-1 pb-2 text-sm font-semibold transition ${
          tab.active
            ? 'text-slate-900'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        {tab.label}
        {tab.active && (
          <span className="absolute inset-x-0 -bottom-0.5 mx-auto h-1 w-10 rounded-full bg-brand-blue" />
        )}
      </Link>
    ))}
  </nav>
)
