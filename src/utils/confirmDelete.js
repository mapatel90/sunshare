import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

/**
 * Show confirmation dialog for delete operations
 * @param {string} title - Title of the confirmation dialog
 * @param {string} text - Text content of the confirmation dialog
 * @param {string} confirmButtonText - Text for confirm button
 * @param {string} itemName - Name of the item being deleted
 * @returns {Promise<boolean>} - Returns true if confirmed, false if cancelled
 */
export const confirmDelete = async (
  title = 'Are you sure?',
  text = 'You won\'t be able to revert this!',
  confirmButtonText = 'Yes, delete it!',
  itemName = 'item'
) => {
  try {
    const result = await MySwal.fire({
      title: title,
      text: text.includes('${itemName}') ? text.replace('${itemName}', itemName) : text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancel',
      focusCancel: true,
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-danger m-1",
        cancelButton: "btn btn-secondary m-1"
      }
    })

    return result.isConfirmed
  } catch (error) {
    console.error('Error showing confirmation dialog:', error)
    return false
  }
}

/**
 * Show success message after successful delete
 * @param {string} title - Title of the success message
 * @param {string} text - Text content of the success message
 * @param {number} timer - Auto close timer in milliseconds
 */
export const showDeleteSuccess = (
  title = 'Deleted!',
  text = 'The item has been deleted successfully.',
  timer = 2000
) => {
  MySwal.fire({
    title: title,
    text: text,
    icon: 'success',
    timer: timer,
    showConfirmButton: false,
    timerProgressBar: true,
    customClass: {
      confirmButton: "btn btn-success"
    }
  })
}

/**
 * Show error message for failed delete operations
 * @param {string} title - Title of the error message
 * @param {string} text - Text content of the error message
 */
export const showDeleteError = (
  title = 'Error!',
  text = 'Something went wrong while deleting the item.'
) => {
  MySwal.fire({
    title: title,
    text: text,
    icon: 'error',
    confirmButtonText: 'OK',
    customClass: {
      confirmButton: "btn btn-danger"
    }
  })
}

/**
 * Generic confirmation dialog
 * @param {Object} options - Configuration options
 * @returns {Promise<boolean>} - Returns true if confirmed, false if cancelled
 */
export const showConfirmDialog = async (options = {}) => {
  const {
    title = 'Are you sure?',
    text = 'This action cannot be undone.',
    icon = 'warning',
    confirmButtonText = 'Yes, proceed',
    cancelButtonText = 'Cancel',
    confirmButtonColor = '#007bff',
    cancelButtonColor = '#6c757d',
    reverseButtons = true,
    focusCancel = true
  } = options

  try {
    const result = await MySwal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonColor,
      cancelButtonColor,
      confirmButtonText,
      cancelButtonText,
      focusCancel,
      reverseButtons,
      customClass: {
        confirmButton: "btn btn-primary m-1",
        cancelButton: "btn btn-secondary m-1"
      }
    })

    return result.isConfirmed
  } catch (error) {
    console.error('Error showing confirmation dialog:', error)
    return false
  }
}

export default confirmDelete