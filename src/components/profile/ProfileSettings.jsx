import "../../style-sheets/ProfileSettings.css"
import { UserSvg } from "../svg_components/UserSvg"
import COMPANY_IDENTITY_IMAGE from "../../resources/medical_sciences_logo.png";
import { NavLink, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { InstitutionSvg } from "../svg_components/InstitutionSvg";
import { ExitArrowSvg } from "../svg_components/ExitArrowSvg";
import { MethodSvg } from "../svg_components/MethodSvg";
import { ProfileCard } from "./ProfileCard";
import { ApiContext } from "../ApiContext";
import { getCookie, handleResponse } from "../../utils/utils";
import { PasswordSvg } from "../svg_components/PasswordSvg";
import { EmailSvg } from "../svg_components/EmailSvg";
import { IdCardSvg } from "../svg_components/IdCardSvg";
import { fireToast } from "../alert_components/Alert/CustomAlert";

export const ProfileSettings = () => {
    const [ activeElement,setActiveElement ] = useState(1);
    const { BASE_URL,PORT } = useContext(ApiContext);
    const [ institutionsDataFormatted,setInstitutionsDataFormatted ] = useState([]);
    const [ institutionsData,setInstitutionsData ] = useState({});
    
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [ userData,setUserData ] = useState({
        ci:"",
        id:-1,
        name:"",
        password:"",
        institution_name:"",
        institution_id:"",
        email:"",
        role_deep_level:-1,
        role_name:"",
        token:""
    })

    const fetchUserData = async () => {
        const ci = getCookie('ci');
        let response = await fetch(`${BASE_URL}${PORT}/users/ci/${ci}`);
        let jsonData = await handleResponse(response);
        let tempInstitutionsData = {};

        let responseInstitutions = await fetch(`${BASE_URL}${PORT}/institutions`);
        let jsonDataInstitutions = await handleResponse(responseInstitutions)
        setInstitutionsDataFormatted(jsonDataInstitutions);

        jsonDataInstitutions.forEach(data => {
            tempInstitutionsData[data['value']] = data['text'];
        });

        setInstitutionsData(tempInstitutionsData);

        if(jsonData['institution_id']){
            let responseInstitution = await fetch(`${BASE_URL}${PORT}/institutions/${jsonData['institution_id']}`);
            let jsonDataInstitution = await handleResponse(responseInstitution);
            jsonData['institution_name'] = jsonDataInstitution['institution_name'];
            
        }
        
        setUserData(jsonData);
    }

    useEffect(() => {
        fetchUserData()
    },[])

    const handlerFields = async (value,headerName,headerValue = undefined) => {
        let tempUserData = {};
        Object.assign(tempUserData,userData);

        if(headerValue){
            tempUserData[headerName] = institutionsData[value];
            tempUserData[headerValue] = institutionsData[value];
        }else
            tempUserData[headerName] = value;

        setUserData(tempUserData);
        let response = await fetch(`${BASE_URL}${PORT}/users`,{
            method:"POST",
            headers:{ "Content-Type": "application/json"},
            body:JSON.stringify(userData)
        });

        let jsonData = await response.json();
        if(jsonData.code === 200){
            fireToast({ text: "Datos actualizados correctamente", type: "success" });
        }else{
            fireToast({ text: "No se pudo actualizar sus datos", type: "error" });
        }
    }

    return (
        <section className="profile-settings-container">
            <div className="sidebar">
                <div className="sidebar-content">
                    <div className="sidebar-logo">
                        <NavLink  to="/">
                            <img
                                className="navbar-logo"
                                src={COMPANY_IDENTITY_IMAGE}
                                loading="lazy"
                                alt="company identity"
                                />
                        </NavLink>
                    </div>

                    <div className={`full-width sidebar-item ${activeElement === 1 ? 'sidebar-item-active' : ''}`} onClick={() => setActiveElement(1)}>
                        <UserSvg/>
                        Datos Personales
                    </div>

                    <div className={`full-width sidebar-item ${activeElement === 2 ? 'sidebar-item-active' : ''}`} onClick={() => setActiveElement(2)}>
                        <InstitutionSvg/>
                        Datos de Laboratorio
                    </div>
                    
                </div>
                
                <div className="sidebar-footer">
                    <div className='sidebar-item exit-container'>
                        <ExitArrowSvg/>
                        <NavLink to={ from }>Volver atrás</NavLink>
                    </div>
                </div>
            </div>

            <div className="left-alignment short-margin-top container">
                Configuración de Perfil
                
                <div className="container-cards-profile">
                    {
                        activeElement === 1 && 
                        <>
                            <ProfileCard svgComponent={ <UserSvg/> } handler={handlerFields} headerName={ "name" }  headerTitle={ "Nombre" } labelContent={ userData.name } /> 
                            <ProfileCard svgComponent={ <IdCardSvg/> } handler={handlerFields} headerTitle={ "CI" } headerName={ "ci" } labelContent={ userData.ci } /> 
                            <ProfileCard svgComponent={ <EmailSvg/> } handler={handlerFields} headerTitle={ "Email" } headerName={ "email" } labelContent={ userData.email } />
                            <ProfileCard svgComponent={ <PasswordSvg/> } handler={handlerFields} headerTitle={ "Contraseña" } headerName={ "password" } labelContent={ userData.password } />
                        </>
                    }
                    {
                        activeElement === 2 && 
                        <>
                            <ProfileCard svgComponent={ <InstitutionSvg/> } handler={handlerFields} headerTitle={ "Institución" } headerValue={ "institution_id" } labelContent={ userData.institution_name } headerName={ "institution_name" } selectValue={ userData.institution_id } selectData={ institutionsDataFormatted }/>
                        </>
                    }
                    

                </div>
            </div>
        </section>
    )
}