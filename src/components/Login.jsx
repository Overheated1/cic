
import { useState } from "react";
import  "../style-sheets/Login.css";
import { Error } from "./Error";
import { useDispatch } from "react-redux";
import { setAuth } from "../redux/reducers/Authslice";
import { UserSvg } from "./svg_components/UserSvg";
import { PasswordSvg } from "./svg_components/PasswordSvg";
import bcrypt from 'bcryptjs';


// import { jwt } from 'jwt-decode';
// import { Cookies } from 'universal-cookie';

export const Login = ({navigate}) => {
    const port = 5000;
    const dispatch = useDispatch();


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
        console.log(error)
        if (error.errorAuth){
            console.log("here")
            return <Error msg="Usuario o contraseña incorrectos"/>
        }else if(error.errorServ){
            return <Error msg="Error en servidor"/>;
        }
    }

    

    async function log(e){
        e.preventDefault();
        try {
            
            let name = userData.name;
            let body = {
                name
            };
            let response = await fetch(`http://localhost:${port}/getPassword`,{
                method:"POST",
                headers:{ "Content-Type": "application/json"},
                body:JSON.stringify(body)
            });
            let jsonData = await response.json();
            let password = userData.password;
            userData.password = "";
            // const salt = await bcrypt.genSaltSync(10);    
            // const hashPassword = await bcrypt.hashSync(password, salt);
            let match = await bcrypt.compareSync(password,jsonData[0]['password']);
            password = "";
            if(!match){
                setError((prevData) => ({...prevData,errorAuth:true}));
            }else{
                setError((prevData) => ({...prevData,errorServ:false,errorAuth:false}));
                body = {
                    name
                };
                response = await fetch(`http://localhost:${port}/getUser`,{
                    method:"POST",
                    headers:{ "Content-Type": "application/json"},
                    body:JSON.stringify(body)
                });
                jsonData = await response.json();

                userData.role = jsonData[0]['role'];
                userData.ci = jsonData[0]['ci'];
                let token = jsonData[0]['token'];
                
                dispatch(setAuth({isAuth:true}))
                document.cookie = 'auth_token=' + token + '; max-age=3600; path=/';
                document.cookie = 'user_name=' + userData.name[0].toUpperCase() + userData.name.slice(1,userData.name.length) + '; max-age=3600; path=/';
                navigate("/");
            }

        } catch (error) {
            setError((prevData) => ({...prevData,errorServ:true}));
        }
    
    }

    return(
        <div className="FormDiv">
    <form action="" onSubmit={log} className="formLogin" autoComplete='off'>
    <p className="LoginP" >Registrarse</p>
    <div className="error no-background-color display-block">
    {(error.errorAuth || error.errorServ) && errorMsg()}
    </div> 
    <div className="ContInpPlaceholder ContInpPlaceholderLog ContInpPlaceholderUser">
        <input autoComplete='off' id="user" className="no-padding inputLogin" onChange={handlerInputs} name="name" required ></input>
        <label className="placeholder" htmlFor="user">Usuario</label>
        { <UserSvg/> } 
    </div>
    <div className="ContInpPlaceholder ContInpPlaceholderLog ContInpPlaceholderPassword">
        <input autoComplete='off' id="password" className="no-padding inputLogin"  onChange={handlerInputs} name="password" type="password" required></input>
        <label className="placeholder" htmlFor="password">Contraseña</label>
        { <PasswordSvg/> }
    </div>
            <button className="buttonLogin" type="reset" onClick={log}>Iniciar sesión</button>
        </form>
        </div>
    )
}