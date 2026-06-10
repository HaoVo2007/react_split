import { useState } from "react"
import { useGroups } from "@/hooks/useGroups"
import { GroupCard } from "@/components/groups/GroupCard"
import { BalanceSummary } from "@/components/expenses/BalanceSummary"
import { EmptyGroups } from "@/components/groups/EmptyGroups"
import { LoadingGroups } from "@/components/groups/LoadingGroups"
import { CreateGroupModal } from "@/components/groups/CreateGroupModal"
import { EditGroupModal } from "@/components/groups/EditGroupModal"
import { DeleteGroupDialog } from "@/components/groups/DeleteGroupDialog"
import { AppHeader } from "@/components/layout/AppHeader"
import { Plus } from "lucide-react"
import { Group } from "@/types"

export function GroupsPage() {
  const { groups, stats, isLoading, error, refetch } = useGroups()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

  const handleOpenCreate = () => {
    setShowCreateModal(true)
  }

  const handleOpenEdit = (group: Group) => {
    setSelectedGroup(group)
    setShowEditModal(true)
  }

  const handleOpenDelete = (group: Group) => {
    setSelectedGroup(group)
    setShowDeleteDialog(true)
  }

  const handleCreateSuccess = () => {
    refetch()
  }

  const handleEditSuccess = () => {
    refetch()
  }

  const handleDeleteSuccess = () => {
    refetch()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] pb-24 md:pb-8">
      {/* Header */}
      <AppHeader />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Balance Summary */}
        <div className="mb-8">
          <BalanceSummary totalPaid={stats.total_paid} totalOwed={stats.total_owed} />
        </div>

        {/* Groups Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">Danh sách nhóm</h2>
            </div>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-[#4F7CFF] hover:bg-[#3D6AEE] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="sm:inline">Tạo nhóm</span>
            </button>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <LoadingGroups />
          ) : groups.length === 0 ? (
            <EmptyGroups onCreateGroup={handleOpenCreate} />
          ) : (
            <div className="space-y-4">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditGroupModal
        isOpen={showEditModal}
        group={selectedGroup}
        onClose={() => {
          setShowEditModal(false)
          setSelectedGroup(null)
        }}
        onSuccess={handleEditSuccess}
      />

      <DeleteGroupDialog
        isOpen={showDeleteDialog}
        group={selectedGroup}
        onClose={() => {
          setShowDeleteDialog(false)
          setSelectedGroup(null)
        }}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
