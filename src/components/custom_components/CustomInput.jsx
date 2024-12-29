import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import { useEffect, useState,useRef } from "react";

export const CustomInput = ({ value,onChange,name,handleChange,readOnly }) => {
    let initialValue = "";

    if(name === "date") initialValue = new Date()
    else if(name === "n") initialValue = new Date().getDate();
    else if(readOnly) initialValue = "-";

    const [valueData,setValueData]= useState(initialValue);
    const dateRef = useRef(undefined);

    if(onChange !== undefined)
        onChange();
    
    useEffect(() => {
        if(value !== "" && value !== undefined)
            setValueData(value);
    },[value]);

    const handleInputChange = (e) => {
        setValueData(e.target.value);
        handleChange(e)
    }
    
    const handleChangeDate = (date) => {
        setValueData(date)
        dateRef.current.node.name = name;
        handleChange({ target: dateRef.current.node }
        );
    }

    return(
        name === "date" ? 
            <Flatpickr ref={dateRef} value={valueData} onChange={handleChangeDate} /> 
            : 
            <input  value={valueData} readOnly={readOnly} type={name === "password" ? "password" : "text"} name={name} className={`${readOnly ? "read-only-input" : ""}  medium-width-alternative blue-border medium-height custom-input ${ name }`} onChange={handleInputChange}/>
    );
}