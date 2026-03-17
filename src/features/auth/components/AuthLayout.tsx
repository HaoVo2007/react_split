import type { ReactNode } from 'react'

type AuthLayoutProps = {
  title: string
  description?: string
  brandName?: string
  tabNav?: ReactNode
  footer?: ReactNode
  children: ReactNode
}

const heroImageUrl =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80'

const AuthLayout = ({ title, description, brandName = 'TravelSplit', tabNav, footer, children }: AuthLayoutProps) => (
  <div className="relative min-h-screen bg-slate-50">
    {/* Background decorative elements */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_40%)]" />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(14,165,233,0.12),transparent_50%)]" />

    <div className="relative mx-auto flex min-h-screen w-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-6xl">
        {/* Main container with equal height constraint */}
        <div className="flex min-h-[600px] w-full flex-col items-stretch lg:flex-row lg:items-stretch">
          {/* Form Section */}
          <div className="relative flex flex-col rounded-l-[34px] border border-slate-200 bg-white/95 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.15)] backdrop-blur-sm sm:p-10 lg:flex-1 lg:rounded-r-none">
            {/* Decorative icons in form */}

            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex items-center gap-2">
                <span className="text-[0.65rem] uppercase tracking-[0.4em] text-slate-400">{brandName}</span>
              </div>
              <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
              {description && (
                <p className="max-w-[360px] text-sm text-slate-500">{description}</p>
              )}
            </div>

            {tabNav && (
              <div className="mt-4 flex items-center justify-center border-b border-slate-200 pb-5 text-sm">
                {tabNav}
              </div>
            )}

            <div className="mt-5 flex-1 space-y-6">{children}</div>

            {footer && (
              <div className="mt-8 border-t border-slate-100 pt-5 text-center text-xs text-slate-500">{footer}</div>
            )}
          </div>

          {/* Image Section */}
          <div className="relative mt-0 flex flex-1 overflow-hidden rounded-r-[34px] bg-slate-900 text-white lg:mt-0 lg:rounded-l-none">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/20 to-slate-900/80" />

            <div className="relative z-10 flex h-full flex-col justify-end p-8">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-300">Sẵn sàng khám phá</p>
              <h2 className="mt-4 text-2xl font-semibold leading-tight">
                Mọi chuyến đi đều công bằng và dễ dàng
              </h2>
              <p className="mt-3 text-sm text-slate-300">
                Chia sẻ chi phí, theo dõi ai nợ gì, và tập trung vào những cuộc phiêu lưu phía trước.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default AuthLayout