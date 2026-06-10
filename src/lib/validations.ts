import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
})

export const registerSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
  confirm_password: z.string().min(6, "Vui lòng nhập lại mật khẩu"),
}).refine(data => data.password === data.confirm_password, {
  message: "Mật khẩu không khớp",
  path: ["confirm_password"],
})

export const createGroupSchema = z.object({
  name: z.string().min(1, "Tên nhóm không được trống").max(100, "Tên nhóm tối đa 100 ký tự"),
  description: z.string().max(500, "Mô tả tối đa 500 ký tự").optional(),
})

export const updateGroupSchema = z.object({
  name: z.string().min(1, "Tên nhóm không được trống").max(100, "Tên nhóm tối đa 100 ký tự"),
  description: z.string().max(500, "Mô tả tối đa 500 ký tự").optional(),
})

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Tên không được trống").max(100, "Tên tối đa 100 ký tự"),
  phone: z.string().optional(),
  address: z.string().max(500, "Địa chỉ tối đa 500 ký tự").optional(),
})

export const createExpenseSchema = z.object({
  name: z.string().min(1, "Tên chi phí không được trống").max(100, "Tên chi phí tối đa 100 ký tự"),
  amount: z.number().min(1, "Số tiền phải lớn hơn 0").max(999999999, "Số tiền quá lớn"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  date: z.string().min(1, "Vui lòng chọn ngày"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CreateGroupInput = z.infer<typeof createGroupSchema>
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>
