import {useEffect, useState} from 'react';
import LogoutButton from "../components/LogoutButton";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    sub: string;
    email: string;
}

const LockedSubPage = () => {
    const [email, setEmail] = useState<string | null>(null);


    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            const decoded = jwtDecode<JwtPayload>(token);
            setEmail(decoded.email);
        }
    }, []);


    return (
        <div className="flex align-center justify-center flex-col h-screen">
            <h1 className="text-2xl text-white mb-5 text-center">Hello, {email}</h1>
            <LogoutButton/>
        </div>
    );
};

export default LockedSubPage;