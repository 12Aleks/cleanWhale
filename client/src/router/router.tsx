import type { RouteObject } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";


const LockedSubPage = lazy(() => import("../pages/LockedSubPage"));
export const routes: RouteObject[] = [
    {
        path: '/',
        element: <LoginPage/>,
    },
    {
        path: '/admin',
        element:(
            <ProtectedRoute>
              <LockedSubPage/>
            </ProtectedRoute>
        )
    },
]