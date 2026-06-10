import { useState } from "react"
import api from "@/lib/api"
import { AuthResponse, ApiResponse } from "@/types"

interface UpdateProfileData {
  name: string
  phone?: string
  address?: string
  image?: File
}

export function useProfileUpdate() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateProfile = async (data: UpdateProfileData) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("phone", data.phone || "")
      formData.append("address", data.address || "")
      formData.append("image_type", data.image ? "upload" : "preset")
      if (data.image) {
        formData.append("image", data.image)
      }

      const response = await api.post<ApiResponse<AuthResponse>>(
        "/users/auth/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      // Update localStorage with new profile
      const responseData = (response as any).data || response
      if (responseData.profile) {
        localStorage.setItem(
          "userProfile",
          JSON.stringify({
            name: responseData.profile.name || null,
            image: responseData.profile.image || null,
          })
        )
      }

      return responseData
    } catch (err: any) {
      const message = err.response?.data?.message || "Cập nhật hồ sơ thất bại"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    updateProfile,
    isLoading,
    error,
    clearError,
  }
}
