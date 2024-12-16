import axios from 'axios';

// axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

const API_URL = '/api/user';

class AuthService {
    async login(email, password) {
        try {
            const response = await axiosInstance.get(`${API_URL}/${email}`);
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async register(email, username, rawPassword) {
        console.log('Sending data:', { email, username, rawPassword });
        try {
            const response = await axiosInstance.post(API_URL + '/post', {
                email: email,
                username: username,
                rawPassword: rawPassword
            });
            console.log('Registration response:', response);
            return response;
        } catch (error) {
            console.error('Registration error details:', error);
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    async updateUser(userData) {
        return axiosInstance.patch(`${API_URL}/${userData.email}`, {
            username: userData.username
        });
    }

    async deleteUser(email) {
        return axiosInstance.delete(`${API_URL}/${email}`);
    }

    async getUserInfo(email) {
        try {
            const response = await axiosInstance.get(`${API_URL}/${email}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updatePassword(userData) {
        return axiosInstance.patch(`${API_URL}/${userData.email}/password`, {
            newPassword: userData.newPassword
        });
    }
}

export default new AuthService();
