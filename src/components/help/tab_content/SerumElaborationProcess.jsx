import '../../../style-sheets/Help.css';
import search_svg from "../../../resources/svg/search.svg";
import { NavLink } from 'react-router-dom';
import { ApiContext } from '../../ApiContext';
import { useContext, useState } from 'react';
import { RightArrowSvg } from '../../svg_components/RightArrowSvg';
import SearchBar from '../../SearchBar';
import Question from '../../Question';
import laboratory_worker_help from "../../../resources/laboratory_worker_help.jpg"
import laboratory_worker_help_mobile from "../../../resources/laboratory_worker_help.jpg"
import CustomImageContainer from '../../CustomImageContainer';
import { Helmet } from "react-helmet-async";

const SerumElaborationProcess = () => {

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
                    En desarrollo
                </div>

            </div>
        </div>
    );
}
export default SerumElaborationProcess;