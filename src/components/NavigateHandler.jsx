import { Navigate, useLocation } from "react-router-dom";
import { getCookie } from "../utils/utils";

const NavigateHandler = () => {

    const location = useLocation();
    const user_deep_level = getCookie('user_deep_level');
    
    let url = "";
    
    if(user_deep_level=== null){
        url = "/Login";
    }else if(user_deep_level.includes("0")){
        url = "/Admin"
    }else if(user_deep_level.includes("2")){
        url = "/Home"
    } else{
        url = "/Report"
    }

    return(
        <Navigate to={url} state={{from : location}} replace /> 
    )
}
export default NavigateHandler;