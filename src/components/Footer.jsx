import "../style-sheets/Footer.css"
import { NavLink } from "react-router-dom";
import COMPANY_IDENTITY_IMAGE from "../resources/medical_sciences_logo.png";

const Footer = () => {

    return(
        <footer id="principal-footer">
            <div className="grid-4-columns grid-footer">
                
                <div className="flex-container grid-group grd-1-clm flex-column">

                    <div className="footer-group company-logo-footer">
                        <NavLink  to="/">
                            <img
                                className="navbar-logo"
                                src={COMPANY_IDENTITY_IMAGE}
                                loading="lazy"
                                alt="company identity"
                                />
                        </NavLink>
                    </div>
                </div>
            
                    
                <div className="flex-container grid-group grd-4-clm flex-column">
                    <div className="container-footer-title">
                        <label className="footer-title">Navigation</label>
                    </div>

                    
                    <div className="footer-group">
                        <NavLink className="flex-container custom-footer-link" to="/Repetibilidad">Repetibilidad</NavLink>
                        <NavLink className="flex-container custom-footer-link" to="/Reproducibilidad">Reproducibilidad</NavLink>
                        <NavLink className="flex-container custom-footer-link" to="/Elaboración de muestras">Elaboración de muestras</NavLink>
                        <NavLink className="flex-container custom-footer-link" to="/Acerca">Acerca</NavLink>
                        <NavLink className="flex-container custom-footer-link" to="/Ayuda">Ayuda</NavLink>
                    </div> 
                </div>
                

            </div>

            <div className="footer-separator"></div>
            <div className="copyright-container">
                <p>&copy; 2024 CIC. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}
export default Footer;