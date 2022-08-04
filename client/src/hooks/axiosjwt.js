import axios from 'axios';
import { useContext, useEffect } from 'react';
import { TokenContext }from '../context/tokencontext';

const axiosJWT = axios.create({ baseURL: 'https://japanese-culture-quiz.herokuapp.com' });

// custom hook to return an axios instance with interceptors added for jwt handling
const useAxiosJWT = () => {
    const { accessToken, setAccessToken } = useContext(TokenContext);
    
    useEffect(() => {
        const requestInterceptor = axiosJWT.interceptors.request.use(config => {
            if(!config.headers['Authorization']) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        }, error => Promise.reject(error));

        const responseInterceptor = axiosJWT.interceptors.response.use(response => response,
            async (error) => {
                if(error.response.status === 403 && !error.config.sent) {
                    error.config.sent = true;
                    const response = await axiosJWT.get('/refresh');
                    setAccessToken(response.data.accessToken);
                    error.config.headers['Authorization'] = `Bearer ${accessToken}`;
                    return axiosJWT(error.config);
                }
                setAccessToken('');
                return Promise.reject(error);
            });
        return () => {
            axiosJWT.interceptors.request.eject(requestInterceptor);
            axiosJWT.interceptors.response.eject(responseInterceptor);
        }
    }, [accessToken]);
    return axiosJWT;

}
export default useAxiosJWT;