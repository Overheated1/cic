import "../style-sheets/Repeatability.css"
import { useContext, useEffect, useRef, useState } from "react";
import { ApiContext } from "./ApiContext.jsx";
import { InstitutionSvg } from "./svg_components/InstitutionSvg";
import { ComponentSvg } from "./svg_components/ComponentSvg";
import { PatternSvg } from "./svg_components/PatternSvg";
import { EquipmentSvg } from "./svg_components/EquipmentSvg";
import { MethodSvg } from "./svg_components/MethodSvg";
import { TemperatureSvg } from "./svg_components/TemperatureSvg";
import { ConcentrationSvg } from "./svg_components/ConcentrationSvg";
import { SerumSvg } from "./svg_components/SerumSvg";
import { ConcentrationSerumSvg } from "./svg_components/ConcentrationSerumSvg";
import { Table } from "./table_components/Table";
import { DemoLine } from "./DemoLine";
import { N } from "./svg_components/NSvg";
import { D1D2 } from "./svg_components/D1D2Svg";
import { D1AndD2 } from "./svg_components/D1AndD2Svg";
import { DateSvg } from "./svg_components/DateSvg";
import { CustomSelect } from "./custom_components/custom_select_component/CustomSelect";
import { About1Svg } from "./svg_components/About1Svg.jsx";
import { TrashSvg } from "./svg_components/TrashSvg.jsx";
import { EditSvg } from "./svg_components/EditSvg.jsx";
import { AddSvg } from "./svg_components/AddSvg.jsx";
import { SaveSvg } from "./svg_components/SaveSvg.jsx";
import { handleResponse } from "../utils/utils.js";
import AreaLineChart from "./AreLineChart.jsx";
import ReactApexChart from "react-apexcharts";


const Repeatability = () => {
    const [isCommercial,setIsCommercial] = useState(false);
    const { BASE_URL,PORT } = useContext(ApiContext);

    const [determinationData,setDeterminationData] = useState([]);
    const [temperatureData,setTemperatureData] = useState([]);
    const [institutionsData,setInstitutionsData] = useState([]);
    const [controllersData,setControllersData] = useState([]);
    const [dataRows,setDataRows] = useState([]);

    const[dates,setDates] = useState([]);
    const[data,setData] = useState([]);

    const [formData,setFormData] = useState({
        "institution_id" : "",
        "determination_id" : "",
        "repeatability_id"  : "",
        "equipment_name" : "",
        "analytic_method_name" : "",
        "analytic_technique_name" : "",
        "controller_concentration" : "",
        "temperature_value" : "",
        "controller_id" : "",
        "controller_commercial_brand" : "",
        "is_commercial_serum" : false
    })

    const [formDataErrors,setFormDataErrors] = useState({
        "institution_id" : false,
        "determination_id" : false,
        "repeatability_id"  : false,
        "equipment_name" : false,
        "analytic_method_name" : false,
        "analytic_technique_name" : false,
        "controller_concentration" : false,
        "temperature_value" : false,
        "controller_id" : false,
        "controller_commercial_brand" : false,
    })

    let fragmentsDataRepeatability = {};

    let formFieldsObject = {};


    const requestDeterminationsData = async () => {
        let response = await fetch(`${BASE_URL}${PORT}/determinations`);
        setDeterminationData(await handleResponse(response));

        response = await fetch(`${BASE_URL}${PORT}/temperatures`);
        setTemperatureData(await handleResponse(response));
        
        response = await fetch(`${BASE_URL}${PORT}/institutions`);
        setInstitutionsData(await handleResponse(response));
        
        response = await fetch(`${BASE_URL}${PORT}/controllers`);
        setControllersData(await handleResponse(response));
        
    }
    const isLastFragmentFull = (data) => {
        let dataKeys = Object.keys(data)
        let lastPosition = dataKeys[dataKeys.length - 1]
        let lastFragment = data[lastPosition]; 

        return Object.keys(lastFragment).length === 5 ? true : false;
    }
    const handleTableChange = (e,data) => {
        if(isLastFragmentFull(data))
            fragmentsDataRepeatability = data;
    }

    useEffect(() => {
        requestDeterminationsData();
    },[])

    const getRepeatabilityData = async (e) => {
        const actualDate = new Date();
        
        let body = {
            repeatability_date: `${actualDate.getFullYear()}-${actualDate.getMonth()}-1`,
            determination_id : e.target.value
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
        jsonData['institution_id'] = jsonData['institution_id'] === undefined ? "" : jsonData['institution_id'];

        if(jsonData['is_commercial_serum']){
            setIsCommercial(true);
        }

        setDataRows(jsonData['table_fragments'] == undefined ? [] : jsonData['table_fragments'].map((d) => {
            d.date = d.date.split("T")[0]
            return d
        }));

        return jsonData;
        
    }

    const handleFormFieldChange = async (e) => {
        let name = e.target.getAttribute("name");
        let value = e.target.value == "" ? e.target.getAttribute("value") : e.target.value;
        
        setFormData((prevData) => ({...prevData,[name] : value}));
        setFormDataErrors((prevData) => ({...prevData,[name] : value === ""}));

        console.log(name,value)
        if(e.target.getAttribute("name") === "determination_id"){
            let data = await getRepeatabilityData(e)
            data[name] = value;
            setFormData(data);
        }
        console.log(formData)

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


    const handleSubmitRepeatabilityData= async (e) => {
        let keysDataRepeatability = Object.keys(fragmentsDataRepeatability);
        let tableFragments = [];
        for(let i = 0; i < keysDataRepeatability.length;i++){
            let actualRow = keysDataRepeatability[i];
            let actualObject = fragmentsDataRepeatability[actualRow];
            let keysActualObject = Object.keys(actualObject);

            let canPush = true;
            for(let g = 0;g < keysActualObject.length;g++){
                if(actualObject[keysActualObject[g]] === "")
                    canPush = false
            }

            if(canPush){
                console.log(actualObject)
                tableFragments.push(actualObject)
            }
        } 
        let repeatability_id = document.getElementById("repeatability_id");
        const actualDate = new Date();

        formFieldsObject = formData;
        console.log("formFieldsObject",formFieldsObject,formData)
        formFieldsObject["header_id"] = repeatability_id.getAttribute("header_id");
        formFieldsObject["repeatability_id"] = repeatability_id.getAttribute("repeatability_id");
        formFieldsObject["repeatability_date"] = `${actualDate.getFullYear()}-${actualDate.getMonth()}-1`;

        let keysFormField = Object.keys(formFieldsObject);
        let tempErrors = formDataErrors;

        for(let i = 0;i < keysFormField.length;i++){
            if(formFieldsObject[keysFormField[i]] === ""){
                tempErrors[keysFormField[i]] = true;
            }else{
                tempErrors[keysFormField[i]] = false;
            }
        }
        setFormDataErrors(tempErrors);

        if(formFieldsObject["is_commercial_serum"] === undefined){
            formFieldsObject["is_commercial_serum"] = false;
        }

        let body = {
            "formHeaders":formFieldsObject,
            "tableFragments":tableFragments
        }

        let response = await fetch(`${BASE_URL}${PORT}/repeatability`,{
            method:"POST",
            headers:{ "Content-Type": "application/json"},
            body:JSON.stringify(body)
        });

        let jsonData = await handleResponse(response);
        console.log("jsonData",jsonData)
        document.getElementById("repeatability_id").setAttribute("repeatability_id",jsonData['repeatability_data']['repeatability_id']);
        document.getElementById("repeatability_id").setAttribute("header_id",jsonData['table_header']['header_id']);
    }

    const handleCommercialStatus = (e) => {
        setIsCommercial(!isCommercial);
    }

    const handlePlotData = (e,data) => {
        let dates = [];
        let data_ = [];

        let keysData = Object.keys(data);

        for(let i =0;i < keysData.length;i++){
            if(data[keysData[i]]?.date)
                dates.push(data[keysData[i]]?.date)
            if(data[keysData[i]]?.d1_d2)
                data_.push(data[keysData[i]]?.d1_d2)
        }
        setData(data_);
        setDates(dates);
    }

    let buttons = [
        {
            name:'plot-data',
            svgComponent:<About1Svg/>,
            action:'custom',
            callback:(e,data) => {handlePlotData(e,data)}
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

    let columns = [{
        name:'n',
        label:'N',
        svgComponent:<N/>,
        options:{
            handleChange:handleTableChange
        }
    },
    {
        name:'date',
        label:'Fecha',
        svgComponent:<DateSvg/>,
        options:{
            handleChange:handleTableChange
        }
    },
    {
        name:'d1',
        label:
            <span>d
                <sub>1</sub>
            </span>,
        svgComponent:<D1D2/>,
        options:{
            handleChange:handleTableChange
        }
    },
    {
        name:'d2',
        label:
            <span>d
                <sub>2</sub>
            </span>,
        svgComponent:<D1D2/>,
        options:{
            handleChange:handleTableChange
        }
    },
    {
        name:'d1_d2',
        label:
            <span>|d
                <sub>1</sub>
                -
                d
                <sub>2|</sub>
            </span>,
        svgComponent:<D1AndD2/>,
        options:{
            calculable:{
                fields:['d1','d2'],
                operation:'-',
            } 
        }
    },
    ];

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

    const handleChangeController = (e) => {
        console.log(controllersData[e.target.getAttribute("index")]);
        handleFormFieldChange(e)
    }

    return (
        <section className="TableContainer">
            <form className="side-form">{/*institucion fecha componente patron equipo metodo concentracion patron temperatura */}
                <input type="hidden" id="repeatability_id" name="repeatability_id" repeatability_id={-1} header_id={-1}/>
                <div className={`ContInpPlaceholder ${formDataErrors.determination_id ? 'error' : ''}`}>
                    <ComponentSvg/>
                    <div className="custom-select-wrapper">
                        <CustomSelect customClassName={"capitalize-text"} selectedValue = {formData.determination_id} onChange={handleFormFieldChange} name="determination_id" placeholder={"Determinación"} searchable={true} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={determinationData} placeholderSearchBar={"Buscar.."}/>
                    </div>
                </div>
                <div className={`ContInpPlaceholder ${formDataErrors.institution_id ? 'error' : ''}`}>
                    <InstitutionSvg/>
                    <div className="custom-select-wrapper">
                        <CustomSelect onChange={handleFormFieldChange} selectedValue = {formData.institution_id} name="institution_id" placeholder={"Institución"} searchable={true} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={institutionsData} placeholderSearchBar={"Buscar.."}/>
                    </div>
                </div>
                <div className={`ContInpPlaceholder ${formDataErrors.equipment_name ? 'error' : ''}`}>
                    <EquipmentSvg/>
                    <input onChange={handleFormFieldChange} value={formData.equipment_name} className="medium-width blue-border small-height left-alignment form-input" name="equipment_name" type="text" required/>
                    <label className="placeholder form-label" htmlFor="equipment">Equipo</label>
                </div>
                <div className={`ContInpPlaceholder ${formDataErrors.analytic_method_name ? 'error' : ''}`}>
                    <PatternSvg/>
                    <input onChange={handleFormFieldChange} value={formData.analytic_method_name} className="medium-width blue-border small-height left-alignment form-input" name="analytic_method_name" type="text" required/>
                    <label className="placeholder form-label" htmlFor="analytic_method">Método analítica</label>
                </div>
                <div className={`ContInpPlaceholder ${formDataErrors.analytic_technique_name ? 'error' : ''}`}>
                    <MethodSvg/>
                    <input onChange={handleFormFieldChange} value={formData.analytic_technique_name} className="medium-width blue-border small-height left-alignment form-input" name="analytic_technique_name" type="text" required/>
                    <label className="placeholder form-label" htmlFor="analytic_technique">Técnica analítico</label>
                </div>
                <div className={`ContInpPlaceholder ${formDataErrors.temperature_value ? 'error' : ''}`}>
                    <TemperatureSvg/>
                    <input onChange={handleFormFieldChange} value={formData.temperature_value} className="blue-border left-alignment small-height form-input" name="temperature_value" type="text" required/>
                    <label className="placeholder form-label" htmlFor="temperature">Temperatura</label>
                    <div className="custom-select-wrapper-small">
                        <CustomSelect name="temperature_type_id" selectedValue = {formData.temperature_type_id} onChange={handleFormFieldChange} placeholder={"Tipo"} searchable={true} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={temperatureData} placeholderSearchBar={"Buscar.."}/>
                    </div>
                </div>
                <div className={`ContInpPlaceholder ${formDataErrors.controller_id ? 'error' : ''}`}>
                    <ConcentrationSerumSvg/>
                    <div className="custom-select-wrapper">
                        <CustomSelect name="controller_id" selectedValue = {formData.controller_id} onChange={handleChangeController} placeholder={"Controlador"} searchable={true} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={controllersData} placeholderSearchBar={"Buscar.."}/>
                    </div>
                </div>
                
                <div className={`ContInpPlaceholder ${formDataErrors.controller_concentration ? 'error' : ''}`}>
                    <ConcentrationSvg/>
                    <input onChange={handleFormFieldChange} value={formData.controller_concentration} className="medium-width blue-border small-height left-alignment form-input" name="controller_concentration" type="text" required/>
                    <label className="placeholder form-label" htmlFor="concentration">Concentración controlador</label>
                </div>
                {isCommercial &&
                <div className={`ContInpPlaceholder ${formDataErrors.controller_commercial_brand ? 'error' : ''}`}>
                    <SerumSvg/>
                    <input onChange={handleFormFieldChange} value={formData.controller_commercial_brand} className="medium-width blue-border small-height left-alignment form-input" name="controller_commercial_brand" type="text" required/>
                    <label className="placeholder form-label" htmlFor="pattern">Marca Comercial</label>
                </div>
                }
                <div className="ContInpCheckbox">
                    <input className="blue-border left-alignment" id="commercial_check" name="commercial_check" checked={isCommercial} onChange={handleCommercialStatus} type="checkbox"/>
                    <label className="placeholder" htmlFor="commercial_check">Es un suero comercial</label>
                </div>
                <input type="button" className="extra-width blue-border small-height" id="submitFormButton" onClick={handleSubmitRepeatabilityData} value="Guardar"/>
                
            </form>
            <div className="left-alignment short-margin-top container">
                <div className="short-margin-left current-date">{new Date().toLocaleDateString("es-MX",{ weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>
                <Table columns={columns} data={dataRows} buttons={buttons} />
            </div>
            <div className="report-graph">
                <ReactApexChart options={state.options} series={state.series} type="area" height={350} />
            </div>
            {/* {Object.keys(dataPlot).length > 0 && <DemoLine data={dataPlot}/>}             */}
        </section>
    );
}
export default Repeatability;