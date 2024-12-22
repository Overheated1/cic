import "../style-sheets/Home.css"
import principal from "../resources/principal.png"

const Home = ({ navigate }) => {
    
    return(
        <div className="flex-container huge-percent-margin-top flex-column center-flex">
            <div className="flex-container extra-gap">
                <h1 className="title">
                    CIC en busca de un mejor control de calidad
                </h1>
                <input type="button" onClick={() => navigate("/Acerca")} id="about-us" value="Acerca de Nosotros"/>
            </div>
            <img loading="lazy" className="main-page-image" src={ principal } alt="Principal icon laboratory with persons"/>
        </div>
    );
}
export default Home;