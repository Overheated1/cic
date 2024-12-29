import { useContext, useEffect, useState } from "react";
import { CustomSelect } from "./custom_components/custom_select_component/CustomSelect";
import { ComponentSvg } from "./svg_components/ComponentSvg";
import { ConcentrationSerumSvg } from "./svg_components/ConcentrationSerumSvg";
import { EquipmentSvg } from "./svg_components/EquipmentSvg";
import { MethodSvg } from "./svg_components/MethodSvg";
import { PatternSvg } from "./svg_components/PatternSvg";
import { TemperatureSvg } from "./svg_components/TemperatureSvg";
import { handleResponse } from "../utils/utils";
import { ApiContext } from "./ApiContext";

export const TableHeaders = ({ handleFormFieldChange,controllersData,determinationData,formDataErrors,formData,setControllersData,setDeterminationData,handleSubmitFormData }) => {
    var temperatureData = [
        {
            text:"Celsius",
            value:"celsius"
        },
        {
            text:"Farenheit",
            value:"Farenheit"
        }
    ];
    
    const { BASE_URL,PORT } = useContext(ApiContext);
    
    const requestDeterminationsData = async () => {
        let response = await fetch(`${BASE_URL}${PORT}/determinations`);
        setDeterminationData(await handleResponse(response));
        
        response = await fetch(`${BASE_URL}${PORT}/controllers`);
        setControllersData(await handleResponse(response));
        
    }

    

    useEffect(() => {
        requestDeterminationsData();
    },[])

    return (
        <form className="side-form">
            <div className={`ContInpPlaceholder ${formDataErrors.determination_id ? 'error' : ''}`}>
                <ComponentSvg/>
                <div className="custom-select-wrapper">
                    <CustomSelect customClassName={"capitalize-text"} onChange={handleFormFieldChange} name="determination_id" placeholder={"Determinación"} searchable={true} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={determinationData} placeholderSearchBar={"Buscar.."}/>
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
                    <CustomSelect name="temperature_type" selectedValue = {formData.temperature_type} onChange={handleFormFieldChange} placeholder={"Tipo"} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={temperatureData} placeholderSearchBar={"Buscar.."}/>
                </div>
            </div>
            <div className={`ContInpPlaceholder ${formDataErrors.controller_id ? 'error' : ''}`}>
                <ConcentrationSerumSvg/>
                <div className="custom-select-wrapper">
                    <CustomSelect name="controller_id" selectedValue = {formData.controller_id} onChange={handleFormFieldChange} placeholder={"Controlador"} searchable={true} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={controllersData} placeholderSearchBar={"Buscar.."}/>
                </div>
            </div>
            
            <input type="button" className="extra-width blue-border small-height" id="submitFormButton" onClick={handleSubmitFormData} value="Guardar"/>
            
        </form>
    );
}