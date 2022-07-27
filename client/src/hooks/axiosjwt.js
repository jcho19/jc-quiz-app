import axios from 'axios';
import { useContext, useEffect } from 'react';
import TokenContext from '../context/TokenContext';

axios.defaults.baseURL = 'http://localhost:3001';
axios.defaults.withCredentials = true;

const useAxiosJWT = () => {
    const { accessToken, setAccessToken } = useContext(TokenContext);
    
    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(config => {
            if(!config.headers['Authorization']) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;

            }
            return config;


        }, error => Promise.reject(error));

        const responseInterceptor = axios.interceptors.response.use(response => response,
            async (error) => {
                if(error.response.status === 403 && !error.config.sent) {
                    error.config.sent = true;
                    try {
                        const response = await axios.get('/refresh');
                        setAccessToken(response.data.accessToken);
                        error.config.headers['Authorization'] = `Bearer ${accessToken}`;
                        return axios(error.config);
                    } catch (err) {
                        setAccessToken('');
                    }
                }
                else {
                    setAccessToken('');
                }
                return Promise.reject(error);

            });
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        }
    }, 
    []);
    return axios;

}
export default useAxiosJWT;
