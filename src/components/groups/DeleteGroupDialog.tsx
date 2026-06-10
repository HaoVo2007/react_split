import { useState } from "react"
import { useGroupActions } from "@/hooks/useGroupActions"
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog"
import { Group } from "@/types"

interface DeleteGroupDialogProps {
  isOpen: boolean
  group: Group | null
  onClose: () => void
  onSuccess: () => void
}

export function DeleteGroupDialog({ isOpen, group, onClose, onSuccess }: DeleteGroupDialogProps) {
  const { deleteGroup, isLoading } = useGroupActions()
  const [submitError, setSubmitError] = useState("")

  const handleDelete = async () => {
    if (!group) return

    setSubmitError("")

    try {
      await deleteGroup(group.id)
      onClose()
      onSuccess()
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Xóa nhóm thất bại")
    }
  }

  if (!group) return null

  return (
    <DeleteConfirmDialog
      isOpen={isOpen}
      title="Xóa nhóm"
      description="Hành động này không thể hoàn tác. Tất cả dữ liệu trong nhóm sẽ bị xóa vĩnh viễn."
      itemName={group.name}
      isLoading={isLoading}
      error={submitError}
      onClose={onClose}
      onConfirm={handleDelete}
    />
  )
}
