import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../features/auth/components/AuthLayout'
import { AuthTabs } from '../features/auth/components/AuthTabs'
import { useAuthActions, useAuthForm } from '../features/auth/hooks'
import type { LoginFormValues } from '../features/auth/types'
import { Button } from '../components/ui/Button'
import { TextInput } from '../components/ui/TextInput'
import { useState } from 'react'

const initialLoginState: LoginFormValues = {
  email: '',
  password: '',
}

const LoginPage = () => {
  const { values, setField, resetForm } = useAuthForm(initialLoginState)
  const { login } = useAuthActions()
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')
    try {
      await login(values)
      resetForm()
    } catch {
      // Error is handled in the hook with toast
    } finally {
      setStatus('idle')
    }
  }

  return (
    <AuthLayout
      title="Chào mừng trở lại"
      tabNav={
        <AuthTabs
          tabs={[
            { label: 'Đăng nhập', to: '/auth/login', active: true },
            { label: 'Đăng ký', to: '/auth/register' },
          ]}
        />
      }
      footer={
        <>
          <span className="text-slate-500">Chưa có tài khoản?</span>{' '}
          <Link to="/auth/register" className="font-semibold text-brand-blue hover:text-brand-soft-blue">
            Tạo tài khoản
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} aria-live="polite">
        <TextInput
          label="Địa chỉ email"
          name="email"
          type="email"
          placeholder="ten@example.com"
          value={values.email}
          onChange={(event) => setField('email', event.target.value)}
          required
        />
        <TextInput
          label="Mật khẩu"
          name="password"
          type="password"
          placeholder="Nhập mật khẩu của bạn"
          value={values.password}
          onChange={(event) => setField('password', event.target.value)}
          required
        />
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-slate-400">
        </div>
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </Button>
      </form>

      <div className="mt-4 flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.5em] text-slate-400">
        <span className="flex-1 border-t border-slate-200" />
        <span>hoặc tiếp tục với</span>
        <span className="flex-1 border-t border-slate-200" />
      </div>
    </AuthLayout>
  )
}

export default LoginPage
