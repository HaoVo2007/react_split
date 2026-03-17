import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import AuthLayout from '../features/auth/components/AuthLayout'
import { AuthTabs } from '../features/auth/components/AuthTabs'
import { useAuthActions, useAuthForm } from '../features/auth/hooks'
import type { RegisterFormValues } from '../features/auth/types'
import { Button } from '../components/ui/Button'
import { TextInput } from '../components/ui/TextInput'
import { useState } from 'react'

const initialRegisterState: RegisterFormValues = {
  email: '',
  password: '',
  confirm_password: '',
}

const RegisterPage = () => {
  const { values, setField, resetForm } = useAuthForm(initialRegisterState)
  const { register } = useAuthActions()
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (values.password !== values.confirm_password) {
      toast.error('Mật khẩu cần phải khớp.')
      return
    }

    setStatus('loading')
    try {
      await register(values)
      resetForm()
    } catch {
      // Error is handled in the hook with toast
    } finally {
      setStatus('idle')
    }
  }

  return (
    <AuthLayout
      title="Tạo tài khoản của bạn"
      tabNav={
        <AuthTabs
          tabs={[
            { label: 'Đăng nhập', to: '/auth/login' },
            { label: 'Đăng ký', to: '/auth/register', active: true },
          ]}
        />
      }
      footer={
        <>
          <span className="text-slate-500">Đã là thành viên?</span>{' '}
          <Link to="/auth/login" className="font-semibold text-brand-blue hover:text-brand-soft-blue">
            Đăng nhập
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
          placeholder="Tạo mật khẩu"
          value={values.password}
          onChange={(event) => setField('password', event.target.value)}
          required
        />
        <TextInput
          label="Xác nhận mật khẩu"
          name="confirm_password"
          type="password"
          placeholder="Nhập lại mật khẩu của bạn"
          value={values.confirm_password}
          onChange={(event) => setField('confirm_password', event.target.value)}
          required
        />
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}
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

export default RegisterPage
