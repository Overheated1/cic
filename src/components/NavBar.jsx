import React, { useState } from "react";
import "../style-sheets/NavBar.css";
import {  NavLink,useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getCookie } from "../utils/utils";
import { v4 as uuid } from "uuid";

export const NavBar = ({navigate,data}) => {
    const dispatch = useDispatch();
    
    const[greeting,setGreeting] = useState({
        word:"",
        letter:""
    })    

    const[userMenuVisible,setUserMenuVisible] = useState(false)

    useState(() => {
        setGreeting(prevData => ({...prevData,
            word:getCookie("user_name"),
            letter:getCookie("user_name")[0].toUpperCase()
    }));
    },[]);

    return(
        <div className="NavbarWrapper" >  
            <div className = "img">
                {/* <img loading="lazy"  className = "logo" src={require("../resources/logoMedicSc.png")} alt="Logo"/>
                <img loading="lazy" className = "logo" src={require("../resources/logoInf.png")} alt="Logo"/> */}
            </div>    
            <nav className="nav">
                <input className="BurgerCheck" type="checkBox"></input>
                <div className="BurgerMenu">
                    <div className="top-line"></div>
                    <div className="center"></div>
                    <div className="bottom-line"></div>
                </div>
                <ul className="dropdown" id="menu">
                    {/* Menu Content */}
                    <ul className="flex-container-menu-reverse">
                        <ul className="flex-container-menu">
                            {data.map((menu) => {
                                return menu.hasOwnProperty('subMenu') ? (
                                    <li key={uuid()} className="dropdown__list nav_link_tag">
                                    <div className="dropdown__link">
                                        <div className="FlexCont">
                                            {menu.svgComponent}
                                            <span className="dropdown-span-menu menu-label">{menu.tag}</span>
                                        </div>
                                        <input type="checkbox" className="dropdown__check"></input>
                                    </div>
                                    <div className="dropdown__content">
                                        <ul className="dropdown__sub">
                                            <li className="dropdown__li">
                                            {
                                                menu.subMenu.map((subMenu) => {
                                                return (
                                                <NavLink key={uuid()} to={subMenu.to}  className="item" >{subMenu.tag}</NavLink>
                                                )})
                                            }
                                            </li>
                                        </ul>
                                    </div>
                                </li>) : (
                                <li key={uuid()} className="dropdown__list nav_link_tag">
                                    <div className="dropdown__link" >
                                        <div className="FlexCont">
                                            {menu.svgComponent}
                                            <NavLink key={uuid()} className="dropdown-span-menu nav_link_tag" to={menu.to} >
                                            <span className="dropdown-span-menu menu-label">{menu.tag}</span>
                                            </NavLink>
                                        </div>
                                    </div>
                                </li>
                            )
                            })}
                        </ul>
                        {/* Profile */}
                        <li className="dropdown__list" >
                            <div className="container-user">
                                <div className="user-greeting">Hola {greeting.word}</div>
                                <div className="user-name-letter" onClick={() => setUserMenuVisible(!userMenuVisible)}>
                                    <span className="dropdown__span">{greeting.letter}</span>
                                </div>
                            </div>
                            <div className={`container-menu-user ${userMenuVisible ? "visible" : ""}`}>
                                <div className="user-menu-button logout-button" onClick={() => {
                                    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                    document.cookie = "user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                    document.cookie = "user_deep_level=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                                    setGreeting(prevData => ({...prevData,
                                        word:"User",
                                        letter:"U"
                                    }));

                                    navigate("/Login");
                                }}>
                                Salir
                                </div>
                                <div className="user-menu-button">Configurar Perfil</div>
                            </div>
                        </li>
                    </ul>
                </ul>
            </nav>
    </div>
    );
}