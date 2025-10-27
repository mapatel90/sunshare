import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const topTost = (type = 'success', title = 'Action Execute Successfully', timer = 3000) => {
    MySwal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true,
        backdrop: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    }).fire({
        icon: type,
        title: title
    });
}

export const showSuccessToast = (title = 'Success!', timer = 3000) => {
    topTost('success', title, timer)
}

export const showErrorToast = (title = 'Error!', timer = 3000) => {
    topTost('error', title, timer)
}

export const showWarningToast = (title = 'Warning!', timer = 3000) => {
    topTost('warning', title, timer)
}

export const showInfoToast = (title = 'Info!', timer = 3000) => {
    topTost('info', title, timer)
}

export default topTost