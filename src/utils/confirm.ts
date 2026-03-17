import Swal from 'sweetalert2'

export const confirmDelete = async (title = 'Delete Expense?', text = 'Are you sure you want to delete this expense?') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel'
  })
}

export const showSuccess = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 2000,
    showConfirmButton: false
  })
}

export const showError = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'error',
    title,
    text
  })
}
