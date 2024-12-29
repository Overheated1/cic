import { useContext, useEffect, useState } from "react";
import { CustomSelect } from "./custom_components/custom_select_component/CustomSelect";
import { DateSvg } from "./svg_components/DateSvg";
import { ComponentSvg } from "./svg_components/ComponentSvg";
import { handleResponse } from "../utils/utils";
import { ApiContext } from "./ApiContext";
import { Table } from "./table_components/Table";
import { D1D2 } from "./svg_components/D1D2Svg";
import { N } from "./svg_components/NSvg";
import ReactApexChart from "react-apexcharts";

const Report = () => {

    const { BASE_URL,PORT } = useContext(ApiContext);

    const [determinationData,setDeterminationData] = useState([]);

    const [formData,setFormData] = useState({
        "start_month" : "",
        "start_year"  : "",
        "end_month" : "",
        "end_year" : "",
        "determination_id" : "",
        "method" : ""
    })

    const [formDataErrors,setFormDataErrors] = useState({
        "start_month" : false,
        "start_year"  : false,
        "end_month" : false,
        "end_year" : false,
        "determination_id" : false,
        "method" : false
    })
    const [noData,setNoData] = useState(false);

    const [methodData,setMethodData] = useState([
        {
            "text" : "Repetibilidad",
            "value" : "repeatability"
        },
        {
            "text" : "Reproducibilidad",
            "value" : "reproducibility"
        },
    ]);

    const [methodFetchedData,setMethodFetchedData] = useState([]);

    const [monthsData,setMonthsData] = useState([
        {
            "text" : "Enero",
            "value" : "1"
        },
        {
            "text" : "Febrero",
            "value" : "2"
        },
        {
            "text" : "Marzo",
            "value" : "3"
        },
        {
            "text" : "Abril",
            "value" : "4"
        },
        {
            "text" : "Mayo",
            "value" : "5"
        },
        {
            "text" : "Junio",
            "value" : "6"
        },
        {
            "text" : "Julio",
            "value" : "7"
        },
        {
            "text" : "Agosto",
            "value" : "8"
        },
        
        {
            "text" : "Septiembre",
            "value" : "9"
        },
        
        {
            "text" : "Octure",
            "value" : "10"
        },
        {
            "text" : "Noviembre",
            "value" : "11"
        },
        {
            "text" : "Diciembre",
            "value" : "12"
        },

    ]);
    const [yearsData,setYearsData] = useState([
        {
            "text" : "2024",
            "value" : "2024"
        },

    ]);
    const requestDeterminationsData = async () => {
        let response = await fetch(`${BASE_URL}${PORT}/determinations`);
        setDeterminationData(await handleResponse(response));
        
    }
    
    
    let columns = [{
        name:'n',
        label:'N',
        svgComponent:<N/>,
    },
    {
        name:'date',
        label:'Fecha',
        svgComponent:<DateSvg/>,
    },
    {
        name:'d1',
        label:
            <span>d
                <sub>1</sub>
            </span>,
        svgComponent:<D1D2/>,
    },
    {
        name:'d2',
        label:
            <span>d
                <sub>2</sub>
            </span>,
        svgComponent:<D1D2/>,
    },
    ];

    const[dates,setDates] = useState([]);
    const[data,setData] = useState([]);
   
    const handleFormFieldChange = async (e) => {
        let name = e.target.getAttribute("name");
        let value = e.target.getAttribute("value");

        setFormData((prevData) => ({...prevData,[name] : value}));
        setFormDataErrors((prevData) => ({...prevData,[name] : value === ""}));
    }

    const handleGetData = async (e) => {
        let areAlmostOneError = false;

        let dataKeys = Object.keys(formData); 

        for(let i =0;i < dataKeys.length;i++){

            if(formData[dataKeys[i]] === ""){
                areAlmostOneError = true;
                setFormDataErrors((preValue) => ({...preValue,[dataKeys[i]]:true}));
            }
        }
        if(!areAlmostOneError){
            let body = formData;
            let start_date = `${formData['start_year']}-${formData['start_month']}-1`;
            let end_date = `${formData['end_year']}-${formData['end_month']}-1`;

            let response = undefined;

            if(body['method'] == "repeatability"){
                response = await fetch(`${BASE_URL}${PORT}/repeatability?start_date=${start_date}&end_date=${end_date}&determination_id=${formData['determination_id']}`);
            }
            
            if(body['method'] == "reproducibility"){
                response = await fetch(`${BASE_URL}${PORT}/reproducibility?start_date=${start_date}&end_date=${end_date}&determination_id=${formData['determination_id']}`);
            }
            
            let jsonData = await handleResponse(response);
            if(jsonData?.length == 0 || jsonData == undefined)
                setNoData(true);
            else{
                setNoData(false);
                setMethodFetchedData(jsonData[0]['fragments_data']);
                let dates = [];
                let data_ = [];

                let data = jsonData[0]['fragments_data'];

                for(let i =0;i < data.length;i++){
                    if(data[[i]]?.date)
                        dates.push(data[[i]]?.date)
                    if(data[[i]]?.d1 && data[[i]]?.d2)
                        data_.push(data[[i]]?.d1 - data[[i]]?.d2)
                }
                setData(data_);
                setDates(dates);
            }
        }
    }

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
    useEffect(() => {
        requestDeterminationsData();
    },[])

    return(
        <section className="TableContainer">
            <form className="side-form">
                <div className={`ContInpPlaceholder ${formDataErrors.determination_id ? 'error' : ''}`}>
                    <ComponentSvg/>
                    <div className="custom-select-wrapper">
                        <CustomSelect customClassName={"capitalize-text"} onChange={handleFormFieldChange} name="determination_id" placeholder={"Determinación"} searchable={true} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={determinationData} placeholderSearchBar={"Buscar.."}/>
                    </div>
                </div>
                <div className={`ContInpPlaceholder ${formDataErrors.method ? 'error' : ''}`}>
                    <ComponentSvg/>
                    <div className="custom-select-wrapper">
                        <CustomSelect customClassName={"capitalize-text"} onChange={handleFormFieldChange} name="method" placeholder={"Método"} searchable={false} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={methodData} placeholderSearchBar={"Buscar.."}/>
                    </div>
                </div>
                <div className={`ContInpPlaceholder ${formDataErrors.start_month ? 'error' : ''}`}>
                    <DateSvg/>
                    <div className="custom-select-wrapper">
                        <CustomSelect customClassName={"capitalize-text"} onChange={handleFormFieldChange} name="start_month" placeholder={"Mes inicio"} searchable={true} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={monthsData} placeholderSearchBar={"Buscar.."}/>
                    </div>
                </div>
                <div className={`ContInpPlaceholder ${formDataErrors.start_year ? 'error' : ''}`}>
                    <DateSvg/>
                    <div className="custom-select-wrapper">
                        <CustomSelect onChange={handleFormFieldChange} selectedValue = {formData.institution_id} name="start_year" placeholder={"Año inicio"} searchable={false} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={yearsData} placeholderSearchBar={"Buscar.."}/>
                    </div>
                </div>
                <div className={`ContInpPlaceholder ${formDataErrors.end_month ? 'error' : ''}`}>
                    <DateSvg/>
                    <div className="custom-select-wrapper">
                        <CustomSelect customClassName={"capitalize-text"} onChange={handleFormFieldChange} name="end_month" placeholder={"Mes final"} searchable={true} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={monthsData} placeholderSearchBar={"Buscar.."}/>
                    </div>
                </div>
                <div className={`ContInpPlaceholder ${formDataErrors.end_year ? 'error' : ''}`}>
                    <DateSvg/>
                    <div className="custom-select-wrapper">
                        <CustomSelect onChange={handleFormFieldChange} selectedValue = {formData.institution_id} name="end_year" placeholder={"Año final"} searchable={false} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={yearsData} placeholderSearchBar={"Buscar.."}/>
                    </div>
                </div>
                <input type="button" className="extra-width blue-border small-height" id="submitFormButton" onClick={handleGetData} value="Enviar"/>
                
            </form>
            <div className="left-alignment short-margin-top container">
                {methodFetchedData.length === 0 ? <div>No hay datos por el momento</div> : 
                <div className="report-container">
                    <Table tableTitle={"Reportes"} columns={columns} data={methodFetchedData} />
                    <div className="report-graph">
                        <ReactApexChart options={state.options} series={state.series} type="area" height={350} />
                    </div>
                </div>
                }
            </div>
            {/* {Object.keys(dataPlot).length > 0 && <DemoLine data={dataPlot}/>}             */}
        </section>
    )
}
export default Report;