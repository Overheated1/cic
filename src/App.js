import './App.css';
import { useNavigate, Route,Routes, Outlet } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { DemoPie } from './components/DemoPie.js';
function App() {
  return (
    <div className="App">
    <DemoPie />
      <Routes>
        <Route exact path="/" />{/*<Link to="path">Home</Link>*/}
      </Routes>
    </div>
  );
}

export default App;
