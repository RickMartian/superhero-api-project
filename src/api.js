import axios from 'axios';

const api = axios.create({
    baseURL: 'https://superheroapi.com/api.php/2059713944104200/'
});

export default api;