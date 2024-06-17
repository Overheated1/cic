import { Routes,Route } from "react-router-dom";
import { Login } from './Login';
import { Repeatability } from './Repeatability';
import { Reproducibility } from './Reproducibility';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { About } from "./About";
import { Help } from "./Help";
import { setAuth } from "../redux/reducers/Authslice";
import { getCookie } from "../utils/utils";
import { Home } from "./Home";
import { SampleElaboration } from "./SampleElaboration";

export const RouteHandler = ({navigate}) => {
    const authToken = getCookie('auth_token');

    const isAuth = authToken !== null;

    console.log(isAuth);
    
    return(
    <Routes>
        <Route path="/" element={isAuth ? <Home navigate={navigate} /> : <Login navigate={navigate}/> }/>
        <Route exact path="/Login" element={ <Login navigate={navigate}/> }/>
        <Route exact path="/Repetibilidad" element={isAuth ? <Repeatability/> : <Login navigate={navigate}/>  }/>
        <Route exact path="/Reproducibilidad" element={isAuth ? <Reproducibility/> : <Login navigate={navigate}/>  }/>
        <Route exact path="/Acerca" element={isAuth ? <About/> : <Login navigate={navigate}/>}/>
        <Route exact path="/Ayuda" element={isAuth ? <Help/> : <Login navigate={navigate}/>}/>
        <Route exact path="/Elaboración de muestras" element={isAuth ? <SampleElaboration/> : <Login navigate={navigate}/>}/>
    </Routes>
);
} 
