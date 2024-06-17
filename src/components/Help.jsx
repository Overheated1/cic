import { useState } from 'react';
import '../style-sheets/Help.css';

export const Help = () => {
    const[step,setStep] = useState("help-step1")
    const handleStep = (e) => {
        if(step !== ""){
            document.getElementsByClassName(step)[0].classList.remove("current-step");
        }
        setStep(e.target.classList[1]);
        document.getElementsByClassName(e.target.classList[1])[0].classList.add("current-step");
    }
    return(
        <div className="help-container">
            <form className="side-form top-alignment extra-gap">
                <input type="button" onClick={handleStep} className="help-step help-step1 current-step" value="Repetitividad"/>
                <input type="button" onClick={handleStep} className="help-step help-step2" value="Reproducibilidad"/>
                <input type="button" onClick={handleStep} className="help-step help-step3" value="Elaboración de muestras"/>
            </form>
        </div>
    );
}