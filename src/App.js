import './App.css';
import './style-sheets/General.css';
import './style-sheets/General2.css';
import { useNavigate } from "react-router-dom";
import { RouteHandler } from './components/RouteHandler';
import { getCookie } from "./utils/utils";
import { useEffect } from 'react';
import { ApiContext } from './components/ApiContext';

function App() {
  const navigate = useNavigate();
  const authToken = getCookie('auth_token');
  const BASE_URL =  "http://localhost:";
  const isAuth = authToken !== null;
  useEffect(() => {
    if(!isAuth){
      navigate("/Login");
  }
  },[isAuth,navigate])
  
  return (
    <ApiContext.Provider value={{"BASE_URL" : BASE_URL,PORT:5000 }} >
      <div className="App">
        <RouteHandler navigate={navigate}/>
      </div>
    </ApiContext.Provider>
  );
}

export default App;
