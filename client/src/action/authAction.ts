import {api} from "./axiosInitial";
import Cookies from 'js-cookie';
import {IAuth} from "../components/FormComponent";


export const login = async (dto: IAuth): Promise<{ accessToken: string }> => {
    const res = await api.post('/auth/login', dto);
    Cookies.set('accessToken', res.data.accessToken);
    return res.data;
};

export const refresh = async (): Promise<{ accessToken: string }> => {
    const res = await api.post('/auth/refresh');
    return res.data;
};

export const logout = async (): Promise<{ message: string }> => {
    const res = await api.post('/auth/logout', { withCredentials: true });
    Cookies.remove('accessToken');
    return res.data;
};