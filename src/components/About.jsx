import '../style-sheets/About.css';
import { AboutCard1Svg } from './svg_components/AboutCard1Svg';
import { AboutCard2Svg } from './svg_components/AboutCard2Svg';
import { AboutCard3Svg } from './svg_components/AboutCard3Svg';
import { AboutCard4Svg } from './svg_components/AboutCard4Svg';
import { AboutCard5Svg } from './svg_components/AboutCard5Svg';
import { AboutCard6Svg } from './svg_components/AboutCard6Svg';
import { AboutCard7Svg } from './svg_components/AboutCard7Svg';
import  MicroscopeSvg  from '../resources/svg/microscope.svg';
import  LaboratorySvg  from '../resources/svg/cientifics-brain.svg';
    

const About = () => {
    return (
    <div className="about-container">
        <h1 className='title'>CIC: CONTROL INTERNO DE CALIDAD</h1>
        <div className="grid-two-columns">
            <div className='left-alignment left-blue-border'>
                <h2 className="large-extra-font-size">Introducción</h2>
                <p className="left-alignment extra-font-size">
                    El Sistema de Control Interno de Calidad (CIC) es una herramienta
                    informática diseñada para facilitar y optimizar la gestión del control de
                    calidad interno en los laboratorios clínicos. El sistema está dirigido a
                    laboratoristas y profesionales de la salud que deseen mejorar la
                    precisión y confiabilidad de los resultados de laboratorio.
                </p>
            </div>
            <div>
                <img loading="lazy" src={ MicroscopeSvg } alt="microscope"/>
                {/* <About1Svg/> */}
            </div>
        </div>
        <div className='full-width'>    
            <h2 className="large-extra-font-size">Beneficios del proyecto</h2>
            <div className="flex-container container-cards spaced-components">
                <div className="card top-column-alignment">
                    <div className="flex-container column-flex extra-gap large-margin-top">
                        <AboutCard1Svg/>
                        <p>Mejora la precisión y confiabilidad de los resultados de laboratorio.</p>
                    </div>
                </div>
                <div className="card top-column-alignment">
                    <div className="flex-container column-flex extra-gap large-margin-top">
                        <AboutCard2Svg/>
                        <p>Módulos para la gestión de datos de control de calidad.</p>
                    </div>
                </div>
                <div className="card top-column-alignment">
                    <div className="flex-container column-flex extra-gap large-margin-top">
                        <AboutCard3Svg/>
                        <p>Cálculo automático de indicadores de calidad.</p>
                    </div>
                </div>
                <div className="card top-column-alignment">
                    <div className="flex-container column-flex extra-gap large-margin-top">
                        <AboutCard4Svg/>
                        <p>Generación de gráficas de control de calidad.</p>
                    </div>
                </div>
        </div>
        </div>
        <div className='left-alignment left-blue-border'>
            <h2 className="large-extra-font-size ">Necesidad del proyecto</h2>
            <p className="left-alignment extra-font-size">
                El control de calidad interno es un aspecto fundamental para garantizar la
                confiabilidad de los resultados de laboratorio. Sin embargo, este proceso
                suele ser manual y engorroso, lo que puede llevar a errores y retrasos. El
                CIC ofrece una solución automatizada y eficiente para el control de
                calidad interno, lo que permite a los laboratorios clínicos dedicar más
                tiempo a la atención de sus pacientes.
            </p>
        </div>
        
        <div className='full-width'>    
            <h2 className="large-extra-font-size">Características del sistema</h2>
            <div className="flex-container container-cards spaced-components">
                <div className="card top-column-alignment">
                    <div className="flex-container column-flex extra-gap large-margin-top">
                        <AboutCard6Svg/>
                        <p>Facilitar la recolección y análisis de datos mediante Base de datos para el almacenamiento de datos de control de calidad.</p>
                    </div>
                </div>
                <div className="card top-column-alignment">
                    <div className="flex-container column-flex extra-gap large-margin-top">
                        <AboutCard7Svg/>
                        <p>Posibilidad de generar informes personalizados.</p>
                    </div>
                </div>
                <div className="card top-column-alignment">
                    <div className="flex-container column-flex extra-gap large-margin-top">
                        <AboutCard5Svg/>
                        <p>Sistema de alertas para posibles problemas de calidad.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="grid-two-columns">
            <div>
                <img loading="lazy" src={ LaboratorySvg } alt="laboratory"/>
            </div>
            <div>
                <h2 className="large-extra-font-size">Objetivos del proyecto</h2>
                    <ul>
                        <li className="left-alignment extra-font-size" >Fortalecer el control de calidad interno en los laboratorios clínicos.</li>
                        <li className="left-alignment extra-font-size" >Reduce el riesgo de errores.</li>
                        <li className="left-alignment extra-font-size" >Ahorra tiempo y recursos.</li>
                        <li className="left-alignment extra-font-size" >Facilita la toma de decisiones.</li>
                        <li className="left-alignment extra-font-size" >Contribuye a la acreditación de los laboratorios clínicos.</li>
                    </ul>
            </div>
        </div>
        <div className='left-alignment left-blue-border'>
            <h2 className="large-extra-font-size">Impacto del proyecto</h2>
            <p className="left-alignment extra-font-size">
                El CIC tiene el potencial de mejorar significativamente la calidad de la
                atención médica en Cuba. Al mejorar la precisión y confiabilidad de los
                resultados de laboratorio, el sistema puede ayudar a prevenir errores
                diagnósticos y terapéuticos, lo que puede salvar vidas y mejorar la
                calidad de vida de los pacientes.
            </p>
        </div>
    </div>
);
};
export default About;
