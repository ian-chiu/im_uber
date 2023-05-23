import useAsync from "./useAsync"
import axios from "~/app/axios";

export default function useFetch(api, options = {}, dependencies = []) {
    return useAsync(() => {
        return axios.request(api, {...options }).then(res => {
            if (res.status == 200) {
                return res.data
            }
            return res.json().then(json => Promise.reject(json))
        })
    }, dependencies)
}