
import { useContext, useEffect, useRef, useState } from "react";
import { ApiContext } from "./ApiContext.jsx";
import  "../style-sheets/Login.css";
import { UserSvg } from "./svg_components/UserSvg";
import { PasswordSvg } from "./svg_components/PasswordSvg";
import bcrypt from 'bcryptjs';
// import { Alert }  from "./alert_components/Alert/Alert.js";
import { fireToast } from "./alert_components/Alert/CustomAlert.jsx";

// import { jwt } from 'jwt-decode';
// import { Cookies } from 'universal-cookie';

export const Login = ({navigate}) => {
    const { BASE_URL,PORT } = useContext(ApiContext);
    
    const loginButton = useRef(null);

    const[userData,SetUserData] = useState({
        name:"",
        password:"",
        role:0,
        ci:"",
        institution_id:"",
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
            fireToast({ text: "Usuario o contraseña incorrectos", type: "error" });

            // Alert.fire({
            //     "text":"Usuario o contraseña incorrectos",
            //     "type":"error"
            // })
        }else if(error.errorServer){
            fireToast({ text: "Error en servidor", type: "error" });
            // Alert.fire({
            //     "text":"Error en servidor",
            //     "type":"error"
            // })
        }
    }

    

    async function login(e){
        e.preventDefault();
        try {
            let response = await fetch(`${BASE_URL}${PORT}/users/ci/${userData.ci}`);

            let jsonData = await response.json();

            if((jsonData.code == 409 && response.status == 409) || (jsonData.code == 500 && response.status == 500)){
                setError((prevData) => ({...prevData,errorAuth:true}));
                return;
            }

            let fetchedData = jsonData.result;
            let match = bcrypt.compareSync(userData.password,fetchedData['password']);

            if(!match)
                setError((prevData) => ({...prevData,errorAuth:true}));
            else{
                setError((prevData) => ({...prevData,errorServer:false,errorAuth:false}));

                userData.role = fetchedData['role'];
                userData.name = fetchedData['name'];
                userData.ci = fetchedData['ci'];
                userData.deep_level = fetchedData['role_deep_level'];
                userData.institution_id = fetchedData['institution_id'];

                let token = fetchedData['token'];

                document.cookie = `auth_token=${token}; max-age=3600; path=/`;
                document.cookie = `user_name=${userData.name[0].toUpperCase() + userData.name.slice(1,userData.name.length)}; max-age=3600; path=/`;
                document.cookie = `user_deep_level=${userData.deep_level}; max-age=3600; path=/`;
                document.cookie = `ci=${userData.ci}; max-age=3600; path=/`;
                document.cookie = `institution_id=${userData.institution_id}; max-age=3600; path=/`;
                navigate("/",{replace : true});
                
                // Alert.fire({
                //     "text":"Todo Bien!",
                //     "type":"success"
                // })

                fireToast({ text: "Todo Bien!", type: "success" });
                
            }

        } catch (error) {
            console.error(error)
            setError((prevData) => ({...prevData,errorServer:true}));
        }
    
    }

    const handleClick = (e) => {
        if(e.key === "Enter") loginButton.current.click();
    }
    
    return(
        <div className="loginPaddingDiv" onKeyDown={ handleClick }>
            
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
                    <button ref={loginButton} className="buttonLogin" type="reset" onClick={login}>Iniciar sesión</button>
                </form>
            </div>
        </div>
    )
}