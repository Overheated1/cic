import { useState } from 'react';
import '../style-sheets/Help.css';

const Help = () => {
    const[step,setStep] = useState("help-step1")
    
    return(
        <div className="help-container">
            <form className="side-form top-alignment extra-gap">
                <input type="button" onClick={(e) => setStep("help-step1")} className={`help-step help-step1 ${step === "help-step1" ? "current-step" : ""}`} value="Repetitividad"/>
                <input type="button" onClick={(e) => setStep("help-step2")} className={`help-step help-step2 ${step === "help-step2" ? "current-step" : ""}`} value="Reproducibilidad"/>
                <input type="button" onClick={(e) => setStep("help-step3")} className={`help-step help-step3 ${step === "help-step3" ? "current-step" : ""}`} value="Elaboración de muestras"/>
            </form>
            <div>
                <div className={`help-container-data ${step === "help-step1" ? "current-container" : ""}`}>
                    <div className='grid-2-columns-help-item'>
                        <div className="medium-ball"></div>
                        <div className="help-item-text">
                            <span>Se acumularán los resultados del mes ( 20 valores ) pero en este caso se anotarán las diferencias duplicadas</span>
                        </div>
                    </div>
                
                    <div className='grid-2-columns-help-item'>
                        <div className="medium-ball"></div>
                        <div className="help-item-text">
                        <span>Con los 20 valores acumulados se calcula: la media ( X ) y la DE de las diferencias ( R )</span>
                        </div>
                    </div>
                
                    <div className='grid-2-columns-help-item'>
                        <div className="medium-ball"></div>
                        <div className="help-item-text">
                        <span>Construir la carta de control para el próximo mes tendiendo en cuenta el intervalo de 0 a 3 R.</span>
                        </div>
                    </div>
                
                    <div className='grid-2-columns-help-item'>
                        <div className="medium-ball"></div>
                        <div className="help-item-text">
                        <span>Ubicar diariamente las diferencias obtenidas en el gráfico o carta antes de informar la corrida.</span>
                        </div>
                    </div>
                
                    <div className='grid-2-columns-help-item'>
                        <div className="medium-ball"></div>
                        <div className="help-item-text">
                        <span>Interpretar el resultado.</span>
                        </div>
                    </div>
                </div>
                <div className={`help-container-data ${step === "help-step2" ? "current-container" : ""}`}>
                    <div className='grid-2-columns-help-item'>
                        <div className="medium-ball"></div>
                        <div className="help-item-text">
                            Anotar diariamente el resultado para un parámetro determinado de el suero control ( controlador ) y/o calibrador ( incluyendo el Patrón del absorbancia ) hasta commpletar 20 valores
                        </div>
                    </div>

                    <div className='grid-2-columns-help-item'>
                        <div className="medium-ball"></div>
                        <div className="help-item-text">
                            Con los 20 valores acumulados se calcula: la media ( X ), la desviación ( DE ) y el coeficiente de variación ( CV ).
                        </div>
                    </div>
                    
                    <div className='grid-2-columns-help-item'>
                        <div className="medium-ball"></div>
                        <div className="help-item-text">
                            Construir la carta de control paar el próximo mes teniendo en cuenta al media +- las 3 DS ubicar diariamente los valores obtenidos en el gráfico o carta antes de informar la corrida.
                        </div>
                    </div>
                    
                    <div className='grid-2-columns-help-item'>
                        <div className="medium-ball"></div>
                        <div className="help-item-text">
                            Interpretar el resultado.
                        </div>
                    </div>
                    <div className='main-title-help'>
                        Reglas múltiples de Westgard:
                    </div>
                    <div className='grid-2-columns-help-item'>
                        <div className="medium-ball"></div>
                        <div className="help-item-text">
                            Regla1 2S: un valor fuera de 2DE indica precaución.
                        </div>
                    </div>
                    
                    <div className='grid-2-columns-help-item'>
                        <div className="medium-ball"></div>
                        <div className="help-item-text">
                            Regla1 3S: un valor fuera de 3DE indica un error aleatorio.
                        </div>
                    </div>
                    
                    <div className='grid-2-columns-help-item'>
                        <div className="medium-ball"></div>
                        <div className="help-item-text">
                            Regla2 2S: dos valores consecutivos fuera de 2DE indica un error sistemático.
                        </div>
                    </div>
                    
                    <div className='grid-2-columns-help-item'>
                        <div className="medium-ball"></div>
                        <div className="help-item-text">
                            Regla2 4S: dos valores con un rango mayor de 4DE indica un error aleatorio.
                        </div>
                    </div>
                    
                    <div className='grid-2-columns-help-item'>
                        <div className="medium-ball"></div>
                        <div className="help-item-text">
                            Regla4 1S: cuatro valores consecutivos fuera de 1DE indica un error sistemático.
                        </div>
                    </div>
                    
                    <div className='grid-2-columns-help-item'>
                        <div className="medium-ball"></div>
                        <div className="help-item-text">
                            Regla10X: diez valores consecutivos por encima o por debajo de la media indica un error sistemático.
                        </div>
                    </div>
                </div>
                <div className={`help-container-data ${step === "help-step3" ? "current-container" : ""}`}>
                    En desarrollo
                </div>
            </div>
        </div>
    );
}
export default Help;