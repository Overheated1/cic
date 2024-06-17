import './App.css';
import './style-sheets/General.css';
import { useNavigate } from "react-router-dom";
import { NavBar } from './components/NavBar';
import { RouteHandler } from './components/RouteHandler';
import { getCookie } from "./utils/utils";
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();
  const authToken = getCookie('auth_token');

  const isAuth = authToken !== null;
  useEffect(() => {
    if(!isAuth){
      navigate("/Login");
  }
  },[isAuth,navigate])
  
  return (
    <div className="App">
      {isAuth && <NavBar navigate={navigate}/>}
      <RouteHandler navigate={navigate}/>
    </div>
  );
}

export default App;
