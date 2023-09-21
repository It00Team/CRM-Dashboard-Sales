import axios from "axios";

// const API_ENDPOINT = `http://localhost:5000/api`;
const API_ENDPOINT = `http://192.168.2.195:5000/api`;

const MyAPI = {
    async get(url, token = null) {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.get(`${API_ENDPOINT}${url}`, { headers });
            return { status: response.status, data: response.data };
        } catch (error) {
            return { status: error.response?.status || 501, error: error.message };
        }
    },
    async post(url, data, token = null) {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.post(`${API_ENDPOINT}${url}`, data, { headers });
            return { status: response.status, data: response.data };
        } catch (error) {
            return { status: error.response?.status || 500, error: error.message };
        }
    },
    async put(url, data, token = null) {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.put(`${API_ENDPOINT}${url}`, data, { headers });
            return { status: response.status, data: response.data };
        } catch (error) {
            return { status: error.response?.status || 500, error: error.message };
        }
    },
    async delete(url, token = null) {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.delete(`${API_ENDPOINT}${url}` , { headers });
            return { status: response.status, data: response.data };
        } catch (error) {
            return { status: error.response?.status || 500, error: error.message };
        }
    }
};

export const Token = {
    setToken(token) {
        localStorage.setItem('token', token);  
    },
    getToken() {
        return localStorage.getItem('token');
    }
};

export const FormatDate = (date, formatString) => {
    const myDate = new Date(date);
    const year = myDate.getFullYear();
    const month = String(myDate.getMonth() + 1).padStart(2, '0');
    const day = String(myDate.getDate()).padStart(2, '0');

    const dateFormats = {
        'dd-mm-yyyy': `${day}-${month}-${year}`,
        'dd/mm/yyyy': `${day}/${month}/${year}`,
        'mm-dd-yyyy': `${month}-${day}-${year}`,
        'mm/dd/yyyy': `${month}/${day}/${year}`,
        'yyyy-dd-mm': `${year}-${day}-${month}`,
        'yyyy/mm/dd': `${year}/${month}/${day}`
    };

    return dateFormats[formatString];
};


export default MyAPI;
