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
import { CustomInput } from "./custom_components/CustomInput"
import { CancelSvg } from "./svg_components/CancelSvg"
import { CustomSelect } from "./custom_components/custom_select_component/CustomSelect"
import { fireToast } from "./alert_components/Alert/CustomAlert"

const Users = () => {
    
    const { BASE_URL,PORT } = useContext(ApiContext);
    const[userDataStatistics,setUserDataStatistics] = useState({});
    const[userData,setUserData] = useState([]);
    const[institutionData,setInstitutionData] = useState([]);

    const getUserData = async () => {
        try {
            let response = await fetch(`${BASE_URL}${PORT}/users/actual-year`);
            setUserDataStatistics(await handleResponse(response));
        
            response = await fetch(`${BASE_URL}${PORT}/users`);
            let jsonData = await handleResponse(response);
                
            var tempInstitutions = [];
            //   CAN IMPROVE BY MEMOIZING THE PREVIOUS FETCHED SO IF THE ID IS THE SAME USE THE SAME FETCHED AND NOT FETCH AGAIN THE SAME
            const promises = jsonData.map(async (data, index) => {
                if (data['institution_id']) {
                let responseInstitution = await fetch(`${BASE_URL}${PORT}/institutions/${data['institution_id']}`);
                let jsonDataInstitution = await handleResponse(responseInstitution);

                tempInstitutions.push({
                    value: jsonDataInstitution['institution_id'],
                    text: jsonDataInstitution['institution_name'] + index
                })
                return { ...data, institution_name: jsonDataInstitution['institution_name'] }; 
                }
                return data; 
            });
        

            jsonData = await Promise.all(promises);
            
            if(jsonData){
                let responseInstitutions = await fetch(`${BASE_URL}${PORT}/institutions`);
                let jsonDataInstitutions = await handleResponse(responseInstitutions)
                setInstitutionData(jsonDataInstitutions);
            }
            
            setUserData(jsonData); 
            } catch (error) {
                console.error("Error fetching user data:", error);
                fireToast({text : "Error fetching user data:",type : error});
            }
      };

    const handleEdit = async (e,type) => {
        let data = e?.detail?.data;

        if(type === "pre-save"){
            data['role_id'] = 2;
            data['password'] = data['password'].length > 10 ? data['password'] : bcrypt.hashSync(data['password'], 10);
        }

        if(type === "post-edit"){
            if(data){
                data['password'] = data['password'].length > 10 ? data['password'] : bcrypt.hashSync(data['password'], 10);

                let response = await fetch(`${BASE_URL}${PORT}/users`,{
                    method:"POST",
                    headers:{ "Content-Type": "application/json"},
                    body:JSON.stringify(data)
                });
    
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
            },
        }
    },
    {
        name:'institution_name',
        fieldValueName:'institution_id',
        label:"Institución",
        // svgComponent:<D1AndD2/>,
        options:{
            handleChange:(e) => {
                console.log(e.target)
            },
            customComponent : (value, tableMeta,handleChange) => {
                return <CustomSelect selectedValue={value} onChange={handleChange} customClassName={"table-select"} name="institution_id" placeholder={"Institución"} searchable={true} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={institutionData} placeholderSearchBar={"Buscar.."}/>
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
            svgComponent:<EditSvg/>,
            secondSvgComponent:<SaveSvg/>,
            thirdSvgComponent:<CancelSvg/>,
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
                <div className="card full-width">
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
                <div className="card to-do-list-container">
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



/*
TO CHECK

const getUserData = async () => {
        try {
          let response = await fetch(`${BASE_URL}${PORT}/users/actual-year`);
          setUserDataStatistics(await handleResponse(response));
      
          response = await fetch(`${BASE_URL}${PORT}/users`);
          let jsonData = await handleResponse(response);
            
          var tempInstitutions = [];
          const promises = jsonData.map(async (data, index) => {
            if (data['institution_id']) {
              let responseInstitution = await fetch(`${BASE_URL}${PORT}/institutions/${data['institution_id']}`);
              let jsonDataInstitution = await handleResponse(responseInstitution);

              tempInstitutions.push({
                value: jsonDataInstitution['institution_id'],
                text: jsonDataInstitution['institution_name'] + index
              })
              return { ...data, institution_name: jsonDataInstitution['institution_name'] }; 
            }
            return data; 
          });
      

          jsonData = await Promise.all(promises);
          
          if(jsonData)
            setInstitutionData(tempInstitutions);
          
          setUserData(jsonData); 
        } catch (error) {
          console.error("Error fetching user data:", error);
          fireToast({text : "Error fetching user data:",type : error});
        }
      };

*/