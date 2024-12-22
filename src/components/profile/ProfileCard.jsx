import { useEffect, useState } from "react"
import { UserSvg } from "../svg_components/UserSvg";
import { EditSvg } from "../svg_components/EditSvg";
import { SaveSvg } from "../svg_components/SaveSvg";

export const ProfileCard = ({ svgComponent,headerTitle,labelContent }) => {
    const [isEditing,setIsEditing] = useState(false);
    const [value,setValue] = useState("");

    useEffect((e) => {
        setValue(labelContent);
    },[ labelContent ])
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
                        <input value={ value } className="blue-border form-input" onChange={ (e) => setValue(e.target.value) }/>
                    :
                        <label>{ labelContent }</label>     
                }

                <div className="edit-container" onClick={() => setIsEditing(!isEditing)}>
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