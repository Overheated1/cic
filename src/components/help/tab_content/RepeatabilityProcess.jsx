import '../../../style-sheets/Help.css';
import { ApiContext } from '../../ApiContext';
import { useContext, useState } from 'react';
import SearchBar from '../../SearchBar';
import Question from '../../Question';
import laboratory_worker_help from "../../../resources/laboratory_worker_help.jpg"
import laboratory_worker_help_mobile from "../../../resources/laboratory_worker_help.jpg"
import CustomImageContainer from '../../CustomImageContainer';
import { Helmet } from "react-helmet-async";

const RepeatabilityProcess = () => {

    const { COMPANY_PHONE,BASE_URL } = useContext(ApiContext);
    const [matchedQuestions,setMatchedQuestions] = useState([]);
    
    return(
        <div className="section-container">
            <Helmet>          
                <meta charSet="utf-8" />          
                <title>Centro de ayuda</title>          
                <link rel="canonical" href={`${BASE_URL}/help`} />          
                <meta name="description" content="Encuentra la respuesta a tus dudas sobre nuestro sistema."/>        
            </Helmet>
            <div className="container-image">
                    <CustomImageContainer url={ laboratory_worker_help } urlMobile={ laboratory_worker_help_mobile }/>
                    <div className="container-principal-text center-align-text">
                        <h1 className="title-principal-text ">Como podemos ayudarte?</h1>
                    </div>
                </div>
            <div className="flex-container  flex-column  very-extra-gap main-content-help">
                <SearchBar title="Encuentra todas las preguntas sobre nuestra plataforma!" matchedQuestions={matchedQuestions} setMatchedQuestions={setMatchedQuestions}/>

                {
                    matchedQuestions && matchedQuestions.length ?
                    
                    <div className="content-questions section-content"> 
                        { 
                            matchedQuestions.map((d,index) => {
                                return <Question key={index} title={d["question"]} paragraphToShow = {d["answer"]}/>
                            })
                        }
                    </div> : ""
                }

                {/* TEMPORAL | */}
                {/*          V */}

                <div className="content-questions section-content">
                    <Question title="pregunta de ejemplo 1" paragraphToShow = {`respuesta de ejemplo 1`}/>
                    <Question title="pregunta de ejemplo 2" paragraphToShow = {`respuesta de ejemplo 2`}/>
                </div>
                
                <div className="section-separator section-content-alt section-separator full-width"></div>
                
                <div className='help-container-data current-container'>
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

            </div>
        </div>
    );
}
export default RepeatabilityProcess;