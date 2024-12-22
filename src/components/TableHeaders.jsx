import { useContext, useEffect, useState } from "react";
import { CustomSelect } from "./custom_components/custom_select_component/CustomSelect";
import { ComponentSvg } from "./svg_components/ComponentSvg";
import { ConcentrationSerumSvg } from "./svg_components/ConcentrationSerumSvg";
import { ConcentrationSvg } from "./svg_components/ConcentrationSvg";
import { EquipmentSvg } from "./svg_components/EquipmentSvg";
import { InstitutionSvg } from "./svg_components/InstitutionSvg";
import { MethodSvg } from "./svg_components/MethodSvg";
import { PatternSvg } from "./svg_components/PatternSvg";
import { SerumSvg } from "./svg_components/SerumSvg";
import { TemperatureSvg } from "./svg_components/TemperatureSvg";
import { handleResponse } from "../utils/utils";
import { ApiContext } from "./ApiContext";

export const TableHeaders = ({ fragmentsDataRepeatability,getRepeatabilityData }) => {
    let formFieldsObject = {};
    
    const { BASE_URL,PORT } = useContext(ApiContext);
    const [determinationData,setDeterminationData] = useState([]);
    const [temperatureData,setTemperatureData] = useState([]);
    const [institutionsData,setInstitutionsData] = useState([]);
    const [controllersData,setControllersData] = useState([]);

    const [formData,setFormData] = useState({
        "institution_id" : "",
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
        "repeatability_id"  : false,
        "equipment_name" : false,
        "analytic_method_name" : false,
        "analytic_technique_name" : false,
        "controller_concentration" : false,
        "temperature_value" : false,
        "controller_id" : false,
        "controller_commercial_brand" : false,
    })

    const handleChangeController = (e) => {
        console.log(controllersData[e.target.getAttribute("index")]);
        handleFormFieldChange(e)
    }

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

    
    const handleFormFieldChange = async (e) => {
        if(e.target.getAttribute("name") === "determination_id"){
            setFormData(await getRepeatabilityData(e));
        }
        let name = e.target.getAttribute("name");
        let value = e.target.value;
 
        setFormData((prevData) => ({...prevData,[name] : value}));
        setFormDataErrors((prevData) => ({...prevData,[name] : value === ""}));
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

            if(canPush)
                tableFragments.push(actualObject)
        } 
        let repeatability_id = document.getElementById("repeatability_id");
        const actualDate = new Date();

        formFieldsObject = formData;
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

        let body = {
            "formHeaders":formFieldsObject,
            "tableFragments":tableFragments
        }

        // let response = await fetch(`${BASE_URL}${PORT}/repeatability`,{
        //     method:"POST",
        //     headers:{ "Content-Type": "application/json"},
        //     body:JSON.stringify(body)
        // });

        // let jsonData = await handleResponse(response);
        // console.log("jsonData",jsonData)
        // document.getElementById("repeatability_id").setAttribute("repeatability_id",jsonData['repeatability_data']['repeatability_id']);
        // document.getElementById("repeatability_id").setAttribute("header_id",jsonData['table_header']['header_id']);
    }

    useEffect(() => {
        requestDeterminationsData();
    },[])

    return (
        <form className="side-form">{/*institucion fecha componente patron equipo metodo concentracion patron temperatura */}
            <input type="hidden" id="repeatability_id" name="repeatability_id" repeatability_id={-1} header_id={-1}/>
            <div className={`ContInpPlaceholder ${formDataErrors.repeatability_id ? 'error' : ''}`}>
                <ComponentSvg/>
                <div className="custom-select-wrapper">
                    <CustomSelect customClassName={"capitalize-text"} onChange={handleFormFieldChange} name="determination_id" placeholder={"Determinación"} searchable={true} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={determinationData} placeholderSearchBar={"Buscar.."}/>
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
                <input onChange={handleFormFieldChange} value={formData.equipment_name} className="large-width blue-border small-height left-alignment form-input" name="equipment_name" type="text" required/>
                <label className="placeholder form-label" htmlFor="equipment">Equipo</label>
            </div>
            <div className={`ContInpPlaceholder ${formDataErrors.analytic_method_name ? 'error' : ''}`}>
                <PatternSvg/>
                <input onChange={handleFormFieldChange} value={formData.analytic_method_name} className="large-width blue-border small-height left-alignment form-input" name="analytic_method_name" type="text" required/>
                <label className="placeholder form-label" htmlFor="analytic_method">Método analítica</label>
            </div>
            <div className={`ContInpPlaceholder ${formDataErrors.analytic_technique_name ? 'error' : ''}`}>
                <MethodSvg/>
                <input onChange={handleFormFieldChange} value={formData.analytic_technique_name} className="large-width blue-border small-height left-alignment form-input" name="analytic_technique_name" type="text" required/>
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
                <input onChange={handleFormFieldChange} value={formData.controller_concentration} className="large-width blue-border small-height left-alignment form-input" name="controller_concentration" type="text" required/>
                <label className="placeholder form-label" htmlFor="concentration">Concentración controlador</label>
            </div>
            <input type="button" className="extra-width blue-border small-height" id="submitFormButton" onClick={handleSubmitRepeatabilityData} value="Guardar"/>
            
        </form>
    );
}