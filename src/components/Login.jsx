
import { useContext, useState } from "react";
import { ApiContext } from "./ApiContext.jsx";
import  "../style-sheets/Login.css";
import { Error } from "./Error";
import { useDispatch,useSelector } from "react-redux";
import { showAlert } from "../redux/actions/customAlertAction";
import { UserSvg } from "./svg_components/UserSvg";
import { PasswordSvg } from "./svg_components/PasswordSvg";
import bcrypt from 'bcryptjs';
import { Alert } from "./alert_components/Alert/Alert.js";
import { useLocation } from "react-router-dom";

// import { jwt } from 'jwt-decode';
// import { Cookies } from 'universal-cookie';

export const Login = ({navigate}) => {
    const { BASE_URL,PORT } = useContext(ApiContext);
    
    const dispatch = useDispatch();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/Home";

    const[userData,SetUserData] = useState({
        name:"",
        password:"",
        role:0,
        ci:""
    });
    const [error,setError] = useState({
        errorAuth:false,
        errorServer:false
    })
    

    const handlerInputs = (e) =>{
        const {name , value} = e.target;
        userData[name] = value;
    }
    const errorMsg = () => {
        if (error.errorAuth){
            // dispatch(showAlert('Usuario o contraseña incorrectos', 3000));
            Alert.fire({
                "text":"Usuario o contraseña incorrectos",
                "type":"error"
            })
        }else if(error.errorServer){
            Alert.fire({
                "text":"Error en servidor",
                "type":"error"
            })
            // dispatch(showAlert('Error en servidor', 3000));
        }
    }

    

    async function login(e){
        e.preventDefault();
        try {
            let response = await fetch(`${BASE_URL}${PORT}/users/ci/${userData.ci}`,);

            let jsonData = await response.json();

            if((jsonData.code == 409 && response.status == 409) || (jsonData.code == 500 && response.status == 500)){
                setError((prevData) => ({...prevData,errorAuth:true}));
                return;
            }

            let fetchedData = jsonData.result[0];
            let match = bcrypt.compareSync(userData.password,fetchedData['password']);
            
            if(!match)
                setError((prevData) => ({...prevData,errorAuth:true}));
            else{
                setError((prevData) => ({...prevData,errorServer:false,errorAuth:false}));

                userData.role = fetchedData['role'];
                userData.name = fetchedData['name'];
                userData.ci = fetchedData['ci'];
                console.log(fetchedData,fetchedData['name'])
                userData.deep_level = fetchedData['role_deep_level'];
                let token = fetchedData['token'];
                console.log(token,token.role_deep_level)
                document.cookie = `auth_token=${token}; max-age=3600; path=/`;
                document.cookie = `user_name=${userData.name[0].toUpperCase() + userData.name.slice(1,userData.name.length)}; max-age=3600; path=/`;
                document.cookie = `user_deep_level=${userData.deep_level}; max-age=3600; path=/`;
                navigate("/",{replace : true});
                
                Alert.fire({
                    "text":"Todo Bien!",
                    "type":"success"
                })
            }

        } catch (error) {
            console.log(error)
            setError((prevData) => ({...prevData,errorServer:true}));
        }
    
    }

    return(
        <div className="loginPaddingDiv">
            
            <div className="loginCard">
                <div className="container-login-image">
                    <img src={require("../resources/test/2/3800315.jpg")} alt="logo"/>
                </div>
                <form action="" onSubmit={login} className="formLogin" autoComplete='off'>
                    <p className="LoginP" >Login</p>
                    {(error.errorAuth || error.errorServer) && errorMsg()}
                    <div className="ContInpPlaceholder ContInpPlaceholderLog">
                        <input autoComplete='off' id="ci" className="no-padding inputLogin" onChange={handlerInputs} name="ci" required ></input>
                        <label className="placeholder" htmlFor="ci">CI</label>
                        { <UserSvg/> } 
                    </div>
                    <div className="ContInpPlaceholder ContInpPlaceholderLog">
                        <input autoComplete='off' id="password" className="no-padding inputLogin"  onChange={handlerInputs} name="password" type="password" required></input>
                        <label className="placeholder" htmlFor="password">Contraseña</label>
                        { <PasswordSvg/> }
                    </div>
                    <button className="buttonLogin" type="reset" onClick={login}>Iniciar sesión</button>
                </form>
            </div>
        </div>
    )
}