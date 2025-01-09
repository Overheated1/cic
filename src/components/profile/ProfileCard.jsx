import { useEffect, useState } from "react"
import { EditSvg } from "../svg_components/EditSvg";
import { SaveSvg } from "../svg_components/SaveSvg";
import bcrypt from 'bcryptjs';
import { CustomSelect } from "../custom_components/custom_select_component/CustomSelect";

export const ProfileCard = ({ selectValue,svgComponent,headerTitle,headerValue,labelContent,handler,headerName,selectData }) => {
    const [isEditing,setIsEditing] = useState(false);
    const [value,setValue] = useState("");

    useEffect((e) => {
        setValue(headerName === "password" ? "" : selectValue ?? labelContent);

    },[ labelContent ])

    const handleClick = (e) => {
        if(headerName === "password"  && isEditing) setValue(bcrypt.hashSync(value, 10));
        if(handler && isEditing) handler(value,headerName,headerValue);
        setIsEditing(!isEditing)
    }
    
    return (
        <div className="profile-card">
            <div className="profile-card-header full-width">
                { headerTitle }
            </div>
            <div className="profile-card-grid-container profile-card-body">
                <div className="container-svg flex-container">
                    { svgComponent }
                </div>
                { 
                    isEditing ? 
                        selectData.length ?
                            <CustomSelect customClassName={"capitalize-text"} onChange={ (e) => setValue(e.target.value) }  selectedValue = { value } placeholder={"Institución"} searchable={false} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={selectData} placeholderSearchBar={"Buscar.."} /> 
                            : 
                            <input value={ value } className="blue-border form-input" onChange={ (e) => setValue(e.target.value) }/>
                    :
                        <label>{ headerName === "password" ? "******" : labelContent }</label>     
                }

                <div className="edit-container" onClick={handleClick}>
                    {
                        isEditing ? 
                            <SaveSvg/> : 
                            <EditSvg/>
                    }
                </div>
            </div>
            
        </div>
    )
}