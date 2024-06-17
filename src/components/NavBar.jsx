import React, { useState } from "react";
import "../style-sheets/NavBar.css";
import {  NavLink,useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../redux/reducers/Authslice";
import { QualityControlSvg } from "./svg_components/QualityControlSvg";
import { AboutSvg } from "./svg_components/AboutSvg";
import { HelpSvg } from "./svg_components/HelpSvg";
import { getCookie } from "../utils/utils";

export const NavBar = ({navigate}) => {
    const dispatch = useDispatch();

    const[greeting,setGreeting] = useState({
        word:"",
        letter:""
    })    

    useState(() => {
        setGreeting(prevData => ({...prevData,
            word:getCookie("user_name"),
            letter:getCookie("user_name")[0].toUpperCase()
    }));
    },[]);

    return(
        <div className="NavbarWrapper" >  
            <div className = "img">
                {/* <img  className = "logo" src={require("../resources/logoMedicSc.png")} alt="Logo"/>
                <img className = "logo" src={require("../resources/logoInf.png")} alt="Logo"/> */}
            </div>    
            <nav className="nav">
                <input className="BurguerCheck" type="checkBox"></input>
                <div className="BurgerMenu">
                    <div className="top-line"></div>
                    <div className="center"></div>
                    <div className="bottom-line"></div>
                </div>
                <ul className="dropdown" id="menu">
                    <li className="dropdown__List liCl" >
                    <div className="cL">
                <div className="gretting">Hola {greeting.word}</div>
            <div className="l">
            <span className="dropdown__span">{greeting.letter}</span>
            </div>
            </div>
            <div className="contML" >
                <div className="butP" onClick={() => {
                    dispatch(setAuth({log:false}));
                }}>
                    Salir
                </div>
                <div className="butP">Configurar Perfil</div>
            </div>
            </li>
                <li className="dropdown__list txtBotnNav">
                    <div className="dropdown__link">
                        <div className="FlexCont">
                        <QualityControlSvg/>
                        <span className="dropdown__span menu-label">Control de Calidad</span>
                    </div>
                    <input type="checkbox" className="dropdown__check"></input>
                    </div>
                    
                    <div className="dropdown__content">
                    <ul className="dropdown__sub">
                        <li className="dropdown__li">
                        <NavLink to="/Repetibilidad"  className="item" >Repetitividad</NavLink>
                        <NavLink to="/Reproducibilidad"  className="item" >Reproducibilidad</NavLink>
                        <NavLink to="/Elaboración-de-Muestras"  className="item" >Elaboración de Muestras</NavLink>
                        </li >
                    </ul>
                    </div>
                </li>
                <li className="dropdown__List">
                    <div className="dropdown__link txtBotnNav" >
                        <div className="FlexCont">
                            <AboutSvg/>
                            <NavLink className="dropdown__span txtBotnNav" to="/Acerca" >
                            <span className="dropdown__span menu-label">Acerca</span>
                            </NavLink>
                        </div>
                    </div>
                </li>
                <li className="dropdown__List">
                    <div className="dropdown__link txtBotnNav" >
                        <div className="FlexCont">
                            <HelpSvg/>
                            <NavLink className="dropdown__span txtBotnNav" to="/Ayuda" >
                            <span className="dropdown__span menu-label">Ayuda</span>
                            </NavLink>
                        </div>
                    </div>
                </li>
            </ul>
            </nav>
    </div>
    );
}