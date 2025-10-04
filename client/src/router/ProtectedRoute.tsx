import {ReactNode} from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const token = Cookies.get("accessToken");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;