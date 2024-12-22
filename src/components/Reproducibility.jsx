import "../style-sheets/Reproducibility.css"
import { useContext, useEffect, useState} from "react";
import { N } from "./svg_components/NSvg";
import { D1D2 } from "./svg_components/D1D2Svg";
import { D1AndD2 } from "./svg_components/D1AndD2Svg";
import { DateSvg } from "./svg_components/DateSvg";
import { v4 as uuid } from "uuid"
import { Table } from "./table_components/Table";
import { About1Svg } from "./svg_components/About1Svg";
import { AddSvg } from "./svg_components/AddSvg";
import { SaveSvg } from "./svg_components/SaveSvg";
import { EditSvg } from "./svg_components/EditSvg";
import { TrashSvg } from "./svg_components/TrashSvg";
import { ApiContext } from "./ApiContext";
import { handleResponse } from "../utils/utils";
import ReactApexChart from "react-apexcharts";
import { TableHeaders } from "./TableHeaders";


const Reproducibility = () => {
    const [days,setDays] = useState([]); 
    const { BASE_URL,PORT } = useContext(ApiContext);

    const[dates,setDates] = useState([]);
    const[data,setData] = useState([]);
    const [dataRows,setDataRows] = useState([]);
    

    let fragmentsDataRepeatability = {};


    const isLastFragmentFull = (data) => {
        let dataKeys = Object.keys(data)
        let lastPosition = dataKeys[dataKeys.length - 1]
        let lastFragment = data[lastPosition]; 

        return Object.keys(lastFragment).length == 5 ? true : false;
    }
    const handleTableChange = (e,data) => {
        if(isLastFragmentFull(data))
            fragmentsDataRepeatability = data;
    }


    //revisar
    const getRepeatabilityData = async (e) => {
        const actualDate = new Date();
        
        let body = {
            repeatability_date: `${actualDate.getFullYear()}-${actualDate.getMonth()}-1`,
            determination_id : e.target.getAttribute("value")
        }

        let response = await fetch(`${BASE_URL}${PORT}/repeatability/get`,{
            method:"POST",
            headers:{ "Content-Type": "application/json"},
            body:JSON.stringify(body)
        });
        
        let jsonData = await handleResponse(response);
        document.getElementById("repeatability_id").setAttribute("repeatability_id",jsonData["repeatability_id"]);
        document.getElementById("repeatability_id").setAttribute("header_id",jsonData["header_id"]);

        jsonData['equipment_name'] = jsonData['equipment_name'] === undefined ? "" : jsonData['equipment_name'];
        jsonData['analytic_method_name'] = jsonData['analytic_method_name'] === undefined ? "" : jsonData['analytic_method_name'];
        jsonData['analytic_technique_name'] = jsonData['analytic_technique_name'] === undefined ? "" : jsonData['analytic_technique_name'];
        jsonData['controller_concentration'] = jsonData['controller_concentration'] === undefined ? "" : jsonData['controller_concentration'];
        jsonData['temperature_value'] = jsonData['temperature_value'] === undefined ? "" : jsonData['temperature_value'];
        jsonData['controller_id'] = jsonData['controller_id'] === undefined ? "" : jsonData['controller_id'];
        jsonData['controller_commercial_brand'] = jsonData['controller_commercial_brand'] === undefined ? "" : jsonData['controller_commercial_brand'];
        
        setDataRows(jsonData['table_fragments']);

        return jsonData;
    }


    const handlePlotDataClick =  async (e,data) => {
        let nArray = [];
        let differenceArray = [];
        let keys_data = Object.keys(data);

        for(let i = 0;i < keys_data.length;i++){
            let actual_key = keys_data[i];
            let data_object = data[actual_key];

            nArray.push(data_object["n"]);
            differenceArray.push(data_object["d1_d2"]);            
        }

        let body = {
            "totalNSum":nArray.length,
            "differenceArray":differenceArray,
        }

        let response = await fetch(`${BASE_URL}${PORT}/deviations`,{
            method:"POST",
            headers:{ "Content-Type": "application/json"},
            body:JSON.stringify(body)
        });
        let jsonData = await handleResponse(response);
    }

    

    let columns = [{
        name:'n',
        label:'N',
        svgComponent:<N/>,
        options:{
            handleChange:(e) => {
                console.log(e.target)
            }
        }
    },
    {
        name:'date',
        label:'Fecha',
        svgComponent:<DateSvg/>,
        options:{
            handleChange:(e) => {
                console.log(e.target)
            }
        }
    },
    {
        name:'Xi',
        label:
            <sub>(Xi)</sub>,
        svgComponent:<D1D2/>,
        options:{
            handleChange:(e) => {
                console.log(e.target)
            }
        }
    },
    {
        name:'Xi_X',
        label:
            <sub>(Xi-X)</sub>,
        svgComponent:<D1D2/>,
        options:{
            handleChange:(e) => {
                console.log(e.target)
            }
        }
    },
    {
        name:'Xi_X_2',
        label:
        <span>(Xi-X)
            <sup>2</sup>
        </span>,
        svgComponent:<D1AndD2/>,
        options:{
            calculable:{
                fields:['Xi','Xi_X'],
                operation:'-',
            } 
        }
    },
    ]
    let buttons = [
        {
            name:'plot-data',
            svgComponent:<About1Svg/>,
            action:'custom',
            callback:(type,e) => {console.log(e)}
        },
        {
            name:'add-row',
            svgComponent:<AddSvg/>,
            action:'add',
            callback:(type,e) => {console.log(e)}
        },    
        {
            name:'edit-row',
            svgComponent:<SaveSvg/>,
            secondSvgComponent:<EditSvg/>,
            action:'edit',
            callback:(type,e) => {console.log(e)}
        },  
        
        {
            name:'delete-row',
            svgComponent:<TrashSvg/>            ,
            action:'delete',
            callback:(type,e) => {console.log(e)}
        },  
    ];


    const generateDays = (init,end,arrow) => {
        let objectDate = new Date();
        let actualDay = objectDate.getDate()
        let temp = [];
        for(let i = init;i <= end;i++){
            let classNameDay = "day-container";
            if(i === actualDay){
                classNameDay += " active-day";
            }
            temp.push(
                <div key={uuid()} className={ classNameDay }>
                    {i}
                </div>
            );
        }
        switch(arrow){
            case "forward":
                temp.push(
                    <div key={uuid()} className="steps-forward" onClick={handleStepsForward}>
                        <p>{'>'}</p>
                    </div>
                );      
                break;
            case "backward":
                temp.unshift(
                    <div key={uuid()} className="steps-backward" onClick={handleStepsBackward}>
                        <p>{'<'}</p>
                    </div>
                );
                break;
            default:
                break;
        }
        return temp;
    }
    
    const handleStepsBackward = () =>{
        setDays(generateDays(1,22,"forward"));
    }

    const handleStepsForward = (e) => {
        let objectDate = new Date();
        setDays(generateDays(22,new Date(objectDate.getFullYear(), objectDate.getMonth() + 1, 0).getDate(),"backward"));
    }

    if (!days.length) setDays(generateDays(1,22,"forward"))
    

    let state = {
          
        series: [{
          name: "d1_d2",
          data: data
        }],
        options: {
          chart: {
            height: 350,
            type: 'area'
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },
          xaxis: {
            type: 'datetime',
            categories: dates
          },
          tooltip: {
            x: {
              format: 'dd/MM/yy HH:mm'
            },
          },
        },
      
      
      };
    return (
        <section className="TableContainer">
            <TableHeaders getRepeatabilityData={ getRepeatabilityData } fragmentsDataRepeatability={ fragmentsDataRepeatability } />
            <div className="flex-container left-alignment extra-gap short-margin-top flex-column">
                <div className="container-steps">
                        <div className="current-date">{new Date().toLocaleDateString("es-MX",{ weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>
                        <div className="days-steps">
                            {
                                days.map((data) => {
                                    return data
                                })
                            }
                        </div>
                </div>
                <Table tableTitle={"Reproducibilidad"} columns={columns} data={[]} buttons={buttons}/>
            </div>
            {/* {Object.keys(dataPlot).length > 0 && <DemoLine data={dataPlot}/>}             */}
            <div className="report-graph">
                <ReactApexChart options={state.options} series={state.series} type="area" height={350} />
            </div>
        </section>
    );
}
export default Reproducibility; 