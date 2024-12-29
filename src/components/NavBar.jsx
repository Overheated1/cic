import React, { useEffect, useRef, useState } from "react";
import "../style-sheets/NavBar.css";
import {  NavLink } from "react-router-dom";
import { getCookie } from "../utils/utils";
import COMPANY_IDENTITY_IMAGE from "../resources/medical_sciences_logo.png";

export const NavBar = ({navigate,data}) => {
    

    const menuContent = useRef(undefined);
    const profileMenuContent = useRef(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const[userMenuVisible,setUserMenuVisible] = useState(false)
    const [isOpenSubmenu, setIsOpenSubmenu] = useState(false);
    const[bottomShadowActive,setBottomShadowActive] = useState(false);    
    const[needHideScrollButton,setNeedHideScrollButton] = useState(false);    
    const[greeting,setGreeting] = useState({
        word:"",
        letter:""
    })  

    const togglePrincipalMenu = (e) => {
        // if(isMobile())
            setIsOpen(!isOpen);
            setIsOpenSubmenu(false);
      };


    const toggleMenu = (e) => {
        setIsOpenSubmenu(!isOpenSubmenu);
        e.target.parentNode.classList.add("active")

        setTimeout(() => {
            e.target.parentNode.classList.remove("active")
        },[800])
    };
      

    function isMobile() {
        return window.innerWidth <= 768;
    }
      
    const handleIdentityVisibility = (e) => {
        const hide = window.scrollY > 0;
        setBottomShadowActive(hide);
    }

    useEffect(() => {
        let word = getCookie("user_name") ? getCookie("user_name") : "User"
        let letter = getCookie("user_name") ? getCookie("user_name")[0].toUpperCase() : "U"
        setGreeting(prevData => ({...prevData,
            word:word,
            letter:letter
    }));
    },[]);

    const handleScroll = (e) => {
        if(e){
            window.scrollTo({
                top: 0,
                behavior:  
            'smooth'
            });
        }
    }

    const handleClickProfileMenu = (e) => {

        if(profileMenuContent?.current){
            if(!profileMenuContent.current.contains(e.target) && userMenuVisible && profileMenuContent.current != e.target){
                setUserMenuVisible(false);
            }else if((profileMenuContent.current.contains(e.target) || profileMenuContent.current == e.target) && getCookie("auth_token")){
                setUserMenuVisible(!userMenuVisible);
            }
        }

    }

    const handleClickMenu = (e) => {
        if(isOpen && menuContent.current){
            if(!menuContent.current.contains(e.target) && menuContent.current != e.target){
                setIsOpen(false);
                setIsOpenSubmenu(false);
                handleScroll();
            }
        }
    }

    window.addEventListener("scroll",(e) => {
        if (window.scrollY === 0) {
            setNeedHideScrollButton(true);
        } else {
            setNeedHideScrollButton(false);
        }
    })
    useEffect(() => {
        window.removeEventListener("click",handleClickMenu);
        window.addEventListener("click",handleClickMenu);
        
        
        window.addEventListener('scroll', handleIdentityVisibility);
        return () => {
            window.removeEventListener('scroll',handleIdentityVisibility);
        };
    }, [isOpen]);

    
    useEffect(() => {
        window.removeEventListener("click",handleClickProfileMenu);
        window.addEventListener("click",handleClickProfileMenu);
        
    }, [userMenuVisible,setUserMenuVisible]);

    return(
        <>
            <div className={`NavbarWrapper ${(bottomShadowActive)  ? "menu-shadow" : ""}`}>  
                <div className = 'company-identity'>
                    <NavLink  to="/">
                    <img
                        className="navbar-logo"
                        src={COMPANY_IDENTITY_IMAGE}
                        loading="lazy"
                        alt="company identity"
                        />
                    </NavLink>
                    {/* <img loading="lazy"  className = "logo" src={require("../resources/logoMedicSc.png")} alt="Logo"/>
                    <img loading="lazy" className = "logo" src={require("../resources/logoInf.png")} alt="Logo"/> */}
                </div>    
                <nav className="nav" ref={menuContent}>
                    <div className="BurgerMenu" onClick={togglePrincipalMenu}>
                        <div className={`top-line ${isOpen ?  "center-second-form" : ""}`}></div>
                        <div className={`center ${isOpen ?  "top-line-second-form" : ""}`}></div>
                        <div className={`bottom-line ${isOpen ?  "bottom-line-second-form" : ""}`}></div>
                    </div>
                    <div className = {`dropdown ${isOpen ? "principal-menu-visible" : ""}`} id="menu">
                        {/* Menu Content */}
                        <div className="navbar-navigation-grid-container">
                            <div className="flex-container-menu navigation-container">
                                {data.map((menu,index) => {
                                    return menu.hasOwnProperty('subMenu') ? (
                                      <div key={index} className="dropdown__list nav_link_tag">
                                        <div className="dropdown__link">
                                            <div className="flex-cont button-submenu" onClick={toggleMenu}>
                                                {menu.svgComponent}
                                                <span className="dropdown-span-menu menu-label">{menu.tag}</span>
                                            </div>
                                        </div>
                                        <div className={`dropdown__content ${isOpenSubmenu ? "dropdown__content__visible" : ""}`}>
                                            <div className="dropdown__sub">
                                                <div className="dropdown__li">
                                                {
                                                    menu.subMenu.map((subMenu,index) => {
                                                    return (
                                                    <NavLink key={index} onClick={togglePrincipalMenu} to={subMenu.to}  className="item" >{subMenu.tag}</NavLink>
                                                    )})
                                                }
                                                </div>
                                            </div>
                                        </div>
                                    </div>) : (
                                    <div key={index} className="dropdown__list nav_link_tag">
                                        <div className="dropdown__link" >
                                            <div className="flex-cont single-menu-cont">
                                                <NavLink onClick={togglePrincipalMenu} key={index} className="dropdown-span-menu nav_link_tag" to={menu.to} >
                                                    {menu.svgComponent}
                                                    <span className="dropdown-span-menu menu-label single-menu">{menu.tag}</span>
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                )
                                })}
                            </div>
                            
                            {/* Profile */}
                            <div ref={ profileMenuContent } className="dropdown__list user-navbar-container" >
                                <div className="container-user">
                                    <div className="user-greeting">Hello {greeting.word}</div>
                                    <div className="user-name-letter">
                                        <span className="dropdown__span">{greeting.letter}</span>
                                    </div>
                                </div>
                                <div className={`container-menu-user ${userMenuVisible ? "visible" : ""}`}>
                                    <div className="user-menu-button logout-button" onClick={() => {
                                        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                        document.cookie = "user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                        document.cookie = "user_deep_level=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                        document.cookie = "user_ci=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                        document.cookie = "institution_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                                        setGreeting(prevData => ({...prevData,
                                            word:"User",
                                            letter:"U"
                                        }));

                                        setUserMenuVisible(false);
                                        navigate("/");
                                    }}>
                                    Exit
                                    </div>
                                    <div className="user-menu-button" onClick={() => navigate("Configuracion de Perfil")}>Configurar Perfil</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
        </div>
        <div className={`scroll-up-arrow standard-button ${needHideScrollButton ? 'hide-up-arrow' : ''}`} onClick={handleScroll}>
            <div className="standard-button-inner">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>
            </div>
        </div>
    </>
    );
}