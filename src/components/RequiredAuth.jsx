import { Navigate,Outlet, useLocation } from "react-router-dom";
import { getCookie } from "../utils/utils";

export const RequireAuth = ({allowedLevels}) => {
    let deep_level = getCookie('user_deep_level');
    let level = deep_level !== undefined ? deep_level : deep_level;
    const location = useLocation();
    
    return(
        allowedLevels.includes(parseInt(level)) ? 
        //from and replace to replace the login from the history for the route where you came from
        <Outlet/> : <Navigate to="/" state={{from : location}} replace /> 
    )
}