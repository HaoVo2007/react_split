import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Lock, Eye, EyeOff, Loader, ArrowRight } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { loginSchema, type LoginInput } from "@/lib/validations"

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuth()
  const [submitError, setSubmitError] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  })

  const onSubmit = async (data: LoginInput) => {
    setSubmitError("")
    clearError()

    try {
      await login(data.email, data.password)
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", data.email)
      }
      navigate("/groups")
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Đăng nhập thất bại")
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    // Placeholder for social login implementation
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#4F7CFF] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">✂️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">SplitTrip</h2>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 font-display">Chào mừng trở lại</h1>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Quản lý chi tiêu nhóm chưa bao giờ dễ dàng hơn thế. Hãy đăng nhập để tiếp tục.
            </p>
          </div>

          {/* Error Message */}
          {(submitError || error) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{submitError || error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] focus:border-transparent text-slate-900 placeholder-slate-400 transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-[#4F7CFF] hover:text-[#3D6AEE] text-xs font-semibold transition-colors"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] focus:border-transparent text-slate-900 placeholder-slate-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#4F7CFF] cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-700 cursor-pointer">
                Ghi nhớ đăng nhập
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4F7CFF] hover:bg-[#3D6AEE] text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-500 font-medium">HOẶC TIẾP TỤC VỚI</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-medium text-slate-700">Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("apple")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 13.5c-.91 2.84.37 5.54 2.82 6.31.52-1.64-.04-2.46-1.07-3.33.37-.88.68-2.3.08-3.99-1.31.12-2.21.66-2.83 1.01zM12.5 5.5c1.34 0 2.45 1.12 2.45 2.5s-1.12 2.5-2.5 2.5S10 9.38 10 8c0-1.38 1.12-2.5 2.5-2.5zm6.56 1.34c.45.34 1.23.04 1.44-.64.21-.68-.12-1.44-.57-1.78-.45-.34-1.23-.04-1.44.64-.21.68.12 1.44.57 1.78zM6 7c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
              </svg>
              <span className="text-sm font-medium text-slate-700">Apple</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-600 text-sm">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-[#4F7CFF] hover:text-[#3D6AEE] font-semibold transition-colors"
              >
                Tham gia ngay
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-slate-500 text-xs">
          <p>© 2026 SplitTrip. Chia sẻ chi phí một cách thông minh.</p>
        </div>
      </div>
    </div>
  )
}
