import { useContext, useEffect, useState } from "react"
import { About1Svg } from "./svg_components/About1Svg"
import { AddSvg } from "./svg_components/AddSvg"
import { EditSvg } from "./svg_components/EditSvg"
import { SaveSvg } from "./svg_components/SaveSvg"
import { TrashSvg } from "./svg_components/TrashSvg"
import { Table } from "./table_components/Table"
import { getDataFlow, getDataFlowColorClassName, handleResponse } from "../utils/utils"
import { ApiContext } from "./ApiContext"
import { AboutSvg } from "./svg_components/AboutSvg"
import bcrypt from 'bcryptjs';

const Users = () => {
    
    const { BASE_URL,PORT } = useContext(ApiContext);
    const[userDataStatistics,setUserDataStatistics] = useState({});
    const[userData,setUserData] = useState([]);

    const getUserData = async () => {
        let response = await fetch(`${BASE_URL}${PORT}/users/actual-year`);
        setUserDataStatistics(await handleResponse(response));
        
        response = await fetch(`${BASE_URL}${PORT}/users`);
        let jsonData = await handleResponse(response);
        
        let temp = [...jsonData];

        setUserData(temp);
        console.log(userData)
    }

    const handleEdit = async (e,type) => {
        if(type === "pre-save"){
            let data = e?.detail?.data;
            data['role_id'] = 2;
            data['password'] = data['password'].length > 10 ? data['password'] : bcrypt.hashSync(data['password'], 10);
            if(data){
                let response = await fetch(`${BASE_URL}${PORT}/users`,{
                    method:"POST",
                    headers:{ "Content-Type": "application/json"},
                    body:JSON.stringify(data)
                });
                console.log(await handleResponse(response))
                getUserData();
            }
        }
    }

    const handleDelete = async (e,type) => {
        if(type === "post-delete"){
            let data = e?.detail?.deletedRow;
            if(data){
                let response = await fetch(`${BASE_URL}${PORT}/users/${data['id']}`,{
                    method:"DELETE",
                });
                console.log(await handleResponse(response))
                getUserData();
            }
        }
    }

    useEffect(() => {
        getUserData()
    },[]);

    let columns = [
    {
        name:'name',
        label:'Nombre',
        // svgComponent:<DateSvg/>,
        options:{
            handleChange:(e) => {
                console.log(e.target)
            }
        }
    },
    
    {
        name:'password',
        label:"Contraseña",
        // svgComponent:<D1D2/>,
        options:{
            handleChange:(e) => {
                console.log(e.target)
            }
        }
    },
    {
        name:'ci',
        label:"CI",
        // svgComponent:<D1D2/>,
        options:{
            handleChange:(e) => {
                console.log(e.target)
            }
        }
    },
    
    {
        name:'email',
        label:"Email",
        // svgComponent:<D1AndD2/>,
        options:{
            handleChange:(e) => {
                console.log(e.target)
            }
        }
    },
    ]

    let buttons = [
        // {
        //     name:'plot-data',
        //     svgComponent:<About1Svg/>,
        //     action:'custom',
        //     callback:(e,type) => {console.log(e,type)}
        // },
        {
            name:'add-row',
            svgComponent:<AddSvg/>,
            action:'add',
        },    
        {
            name:'edit-row',
            svgComponent:<SaveSvg/>,
            secondSvgComponent:<EditSvg/>,
            action:'edit',
            callback:(e,type) => {handleEdit(e,type)}
        },  
        
        {
            name:'delete-row',
            svgComponent:<TrashSvg/>            ,
            action:'delete',
            callback:(e,type) => {handleDelete(e,type)}
        },  
    ];

    return(
        <div className="users-section">
            <div className="flex-container flex-column no-margin">
                <div className="card card-alt-wth">
                    <div className="self-align-center flex-container m01">
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
                                { userDataStatistics[new Date().getFullYear()] }
                            </div>

                            <div className="flex-container no-margin">
                                <span className={getDataFlowColorClassName(userDataStatistics['user_change_percent'],"inverted")}>{ userDataStatistics['user_change_percent'] }%</span> <span className="gray-text">{ getDataFlow(userDataStatistics['user_change_percent']) }</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card to-do-list-container card-alt-wth">
                    <div className="self-align-center flex-container m01 ">
                        <span className="important-text">Actividades recientes</span>
                        |
                        <span className="gray-text subtitle-card">Hoy</span>
                    </div>
                    <div className="main-container no-gap full-width flex-container flex-column m01">
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
                    </div>
                </div>
            </div>
            <div className="table-container">
                <Table tableTitle={"Usuarios"} columns={columns} data={userData} buttons={buttons}/>
            </div>
        </div>
    )
}
export default Users;