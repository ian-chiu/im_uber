import { toast } from 'react-toastify'
import store from '~/app/store'
import { authActions } from '~/pages/Auth/authSlice'

export default function handleError(error) {
    console.log(error)
    let data = error.response.data
    switch(data.statusCode) {
        case 403:
            store.dispatch(authActions.logout())
            toast.error("session expired, please login again!")
            // location.href = '/auth';
            break
        default:
            toast.error(data.message)
    }
}