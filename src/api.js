import axios from "axios"

export default {
    user: {
        login: (credential) => {
            // Should be return
            return axios.post("http://192.168.1.104:8000/api/auth", {credential}).then(res => res.data.user)
        }
            
    }
}