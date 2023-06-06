import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
})

//You can also use interceptors in an instance
instance.interceptors.request.use(request => {
    const accessToken = `Bearer ${localStorage.getItem("token")}`;
    if (localStorage.getItem("token"))
        request.headers['Authorization'] = accessToken;
    return request;
}, error => {
    return Promise.reject(error);
})

instance.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error);
})

export default instance;