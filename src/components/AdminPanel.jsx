import { useContext, useEffect, useState } from "react";
import { AboutSvg } from "./svg_components/AboutSvg";
import { ErrorSvg } from "./svg_components/ErrorSvg";
import { SuccessSvg } from "./svg_components/SuccessSvg";
import { UserSvg } from "./svg_components/UserSvg";
import { ApiContext } from "./ApiContext";
import { getDataFlow, getDataFlowColorClassName, handleResponse } from "../utils/utils";
import RingChart from "./graphs/RingChart";
import AreaLineChart from "./graphs/AreaLineChart";

const AdminPanel = () => {
    const { BASE_URL,PORT } = useContext(ApiContext);
    
    const[DatabaseInfoData,setDatabaseInfoData] = useState({});
    const[chartData,setChartData] = useState({
        dates:[],
        data:[[],[]],
        labels:[]
    });

    const[userData,setUserData] = useState({});


    const getCardsData = async () => {
        let response = await fetch(`${BASE_URL}${PORT}/query-logs`);
        let temp = await handleResponse(response);

        response = await fetch(`${BASE_URL}${PORT}/database-size`);
        
        setDatabaseInfoData({...temp,...await handleResponse(response)});

        response = await fetch(`${BASE_URL}${PORT}/query-logs/actual-year`);
        let jsonData = await handleResponse(response);
        
        let dates = [];
        let data = [[],[]];

        for(let i=0;i < jsonData.length;i++){
            data[0].push(jsonData[i]['successful_queries_count']);
            data[1].push(jsonData[i]['error_queries_count']);

            dates.push(jsonData[i]['statistic_date']);
        }

        setChartData((prevValue) => ({...prevValue,dates:dates,data:data}));
        
        response = await fetch(`${BASE_URL}${PORT}/users/actual-year`);
        setUserData(await handleResponse(response));
    }
    const getRingData = () => {
        let dbSize = DatabaseInfoData['dbSize'] === undefined ? 0 : DatabaseInfoData['dbSize'];
        let freeDiskSpace = DatabaseInfoData['free'] === undefined? 0 : DatabaseInfoData['free'];
        
        return [parseInt(dbSize),parseInt(freeDiskSpace)];
    }
    useEffect(() => {
        getCardsData();
    },[]);
    
    return (
        <div className="admin-panel">
            <div className="container-cards-admin">
                <div className="grid-2-columns">
                    <div className="card">
                        <div className="self-align-center flex-container m01">
                            <span className="important-text">Consultas Exitosas</span>
                            |
                            <span className="gray-text subtitle-card">Hoy</span>
                        </div>
                        <div className="main-container flex-container m01">
                            <div className="success-svg-container">
                                <SuccessSvg/>
                            </div>
                            <div className="text-card">
                                <div className="main-text">
                                    { DatabaseInfoData['successQueryCount'] }
                                </div>

                                <div className="flex-container no-margin">
                                    <span className={getDataFlowColorClassName(DatabaseInfoData['successQueryChange'])}>{ DatabaseInfoData['successQueryChange'] }%</span> <span className="gray-text">{ getDataFlow(DatabaseInfoData['successQueryChange']) }</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card">
                        <div className="self-align-center flex-container m01">
                            <span className="important-text">Consultas Fallidas</span>
                            |
                            <span className="gray-text subtitle-card">Hoy</span>
                        </div>
                        <div className="main-container flex-container m01">
                            <div className="error-svg-container">
                                <ErrorSvg/>
                            </div>
                            <div className="text-card">
                                <div className="main-text">
                                    { DatabaseInfoData['errorQueryCount'] }
                                </div>

                                <div className="flex-container no-margin">
                                    <span className={getDataFlowColorClassName(DatabaseInfoData['errorQueryChange'],"inverted")}>{ DatabaseInfoData['errorQueryChange'] }%</span> <span className="gray-text">{ getDataFlow(DatabaseInfoData['errorQueryChange']) }</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card card-alt grid-fill-2-cols">
                        <div className=" flex-container m01">
                            <span className="important-text">Usuarios</span>
                            |
                            <span className="gray-text subtitle-card">Año</span>
                        </div>
                        <div className="main-container flex-container m01">
                            <div className="users-svg-container">
                                <AboutSvg/>
                            </div>
                            <div className="text-card">
                                <div className="main-text">
                                    { userData[new Date().getFullYear()] }
                                </div>

                                <div className="flex-container no-margin">
                                    <span className={getDataFlowColorClassName(userData['user_change_percent'],"inverted")}>{ userData['user_change_percent'] }%</span> <span className="gray-text">{ getDataFlow(userData['user_change_percent']) }</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card card-alt grid-fill-2-cols ">
                        <div className="self-align-center flex-container m01">
                            <span className="important-text">Consultas</span>
                            |
                            <span className="gray-text subtitle-card">Este Año</span>
                        </div>
                        <AreaLineChart labels = {["Consultas exitosas","Consultas fallidas"]} dates={chartData.dates} data={chartData.data}/>
                    </div>
                    
                    
                </div>
                <div className="flex-container flex-column no-margin no-padding-top">
                    <div className="card">
                        <div className="self-align-center flex-container m01">
                            <span className="important-text">Espacio ocupado por la Base de datos</span>
                            |
                            <span className="gray-text subtitle-card">Hoy</span>
                        </div>
                        <div className="main-container flex-container m01">
                            <RingChart data={getRingData()} labels={["Ocupado por la BD","Libre en disco"]} />
                            <div className="text-card disk-usage-container">
                                <div className="main-text">
                                    { (parseInt(DatabaseInfoData['dbSize'] != undefined ? DatabaseInfoData['dbSize'] : 0) / (1024 * 1024 * 1024)).toFixed(3) + ' GB' }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card to-do-list-container">
                        <div className="self-align-center flex-container m01 ">
                            <span className="important-text">Actividades recientes</span>
                            |
                            <span className="gray-text subtitle-card">Hoy</span>
                        </div>
                        <div className="main-container max-wdt025 no-gap full-width flex-container flex-column m01">
                            <div className="list-item full-width">
                                <div className="grid-3-columns">
                                    <div className="time gray-text">2 min</div>
                                    <div className="flex-container no-margin no-gap flex-column no-padding">
                                        <div className="activity-classification green-classification"></div>
                                        <div className="time-line-fragment"></div>
                                    </div>
                                    <div className="activity-text gray-text">Datos de usuarios correctamente obtenidos</div>
                                </div>
                            </div>
                            <div className="list-item full-width">
                                <div className="grid-3-columns">
                                    <div className="time gray-text">32 min</div>
                                    <div className="flex-container no-margin no-gap flex-column no-padding">
                                        <div className="activity-classification red-classification"></div>
                                        <div className="time-line-fragment"></div>
                                    </div>
                                    <div className="activity-text gray-text">Error al insertar el usuario Julio</div>
                                </div>
                            </div>
                            <div className="list-item full-width">
                                <div className="grid-3-columns">
                                    <div className="time gray-text">1 h</div>
                                    <div className="flex-container no-margin no-gap flex-column no-padding">
                                        <div className="activity-classification blue-classification"></div>
                                        <div className="time-line-fragment"></div>
                                    </div>
                                    <div className="activity-text gray-text">Considere limpiar las consultas de informes previos</div>
                                </div>
                            </div>
                            <div className="list-item full-width">
                                <div className="grid-3-columns">
                                    <div className="time gray-text">2 h</div>
                                    <div className="flex-container no-margin no-gap flex-column no-padding">
                                        <div className="activity-classification green-classification"></div>
                                        <div className="time-line-fragment"></div>
                                    </div>
                                    <div className="activity-text gray-text">Datos de Consultas correctamente obtenidos</div>
                                </div>
                            </div>
                            <div className="list-item full-width">
                                <div className="grid-3-columns">
                                    <div className="time gray-text">3 h</div>
                                    <div className="flex-container no-margin no-gap flex-column no-padding">
                                        <div className="activity-classification red-classification"></div>
                                        <div className="time-line-fragment"></div>
                                    </div>
                                    <div className="activity-text gray-text">Error al insertar el usuario Pepe</div>
                                </div>
                            </div>
                            <div className="list-item full-width">
                                <div className="grid-3-columns">
                                    <div className="time gray-text">1 d</div>
                                    <div className="flex-container no-margin no-gap flex-column no-padding">
                                        <div className="activity-classification red-classification"></div>
                                        <div className="time-line-fragment"></div>
                                    </div>
                                    <div className="activity-text gray-text">Error al insertar el tipo de Temperatura</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminPanel;