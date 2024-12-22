import "../../style-sheets/ProfileSettings.css"
import { UserSvg } from "../svg_components/UserSvg"
import COMPANY_IDENTITY_IMAGE from "../../resources/medical_sciences_logo.png";
import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { InstitutionSvg } from "../svg_components/InstitutionSvg";
import { ExitArrowSvg } from "../svg_components/ExitArrowSvg";
import { EditSvg } from "../svg_components/EditSvg";
import { MethodSvg } from "../svg_components/MethodSvg";
import { ProfileCard } from "./ProfileCard";
import { ApiContext } from "../ApiContext";
import { getCookie } from "../../utils/utils";
import { About1Svg } from "../svg_components/About1Svg";
import { AboutCard2Svg } from "../svg_components/AboutCard2Svg";
import { AboutCard3Svg } from "../svg_components/AboutCard3Svg";
import { AboutCard4Svg } from "../svg_components/AboutCard4Svg";
import { AboutCard5Svg } from "../svg_components/AboutCard5Svg";

export const ProfileSettings = () => {
    const [ activeElement,setActiveElement ] = useState(1);
    const { BASE_URL,PORT } = useContext(ApiContext);

    const [ userData,setUserData ] = useState({
        ci:"",
        id:-1,
        name:"",
        password:"",
        role_deep_level:-1,
        role_name:"",
        token:""
    })

    const fetchUserData = async () => {
        const ci = getCookie('ci');
        let response = await fetch(`${BASE_URL}${PORT}/users/ci/${ci}`);
        let jsonData = await response.json();

        setUserData(jsonData['result'][0]);
    }

    useEffect(() => {
        fetchUserData()
    },[])

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

                    <div className={`full-width sidebar-item ${activeElement == "1" ? 'sidebar-item-active' : ''}`} onClick={() => setActiveElement("1")}>
                        <UserSvg/>
                        Datos Personales
                    </div>

                    <div className={`full-width sidebar-item ${activeElement == "2" ? 'sidebar-item-active' : ''}`} onClick={() => setActiveElement("2")}>
                        <InstitutionSvg/>
                        Datos de Laboratorio
                    </div>
                    
                    <div className={`full-width sidebar-item ${activeElement == "3" ? 'sidebar-item-active' : ''}`} onClick={() => setActiveElement("3")}>
                        <MethodSvg/>
                        Datos de Almcen
                    </div>
    
                </div>
                
                <div className="sidebar-footer">
                    <div className='sidebar-item exit-container'>
                        <ExitArrowSvg/>
                        Volver atrás
                    </div>
                </div>
            </div>

            <div className="left-alignment short-margin-top container">
                Configuración de Perfil
                
                <div className="flex-container extra-gap medium-margin-top left-alignment ">
                    
                    <ProfileCard svgComponent={ <UserSvg/> } headerTitle={ "Nombre" } labelContent={ userData.name } /> 
                    <ProfileCard svgComponent={ <UserSvg/> } headerTitle={ "CI" } labelContent={ userData.ci } />
                    

                </div>
            </div>
        </section>
    )
}