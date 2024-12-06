import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import { useEffect, useState } from "react";

export const CustomInput = ({ value,onChange,identifier,name,handleChange,readOnly }) => {
    const [valueData,setValueData]= useState("");

    if(onChange !== undefined)
        onChange();
    
    useEffect(() => {
        if(value !== "" && value !== undefined)
            setValueData(value);
    },[value]);

    const handleInputChange = (e) => {
        console.log("value",e.target.value);
        setValueData(e.target.value);
        handleChange(e)
    }
    
    const handleChangeDate = (date) => {
        setValueData(date)
        handleChange(
            {
                target:{
                    classList:['small-width','blue-border','medium-height','custom-input',name,identifier],
                    name:name,
                    value:date[0].toISOString().split("T")[0]
                }
            }
        );
    }

    return(
        name === "date" ? 
            <Flatpickr value={valueData} onChange={handleChangeDate} /> 
            : 
            <input  value={valueData} readOnly={readOnly} type={name === "password" ? "password" : "text"} name={name} className={`medium-width-alternative blue-border medium-height custom-input ${ name } ${ identifier }`} onChange={handleInputChange}/>
    );
}