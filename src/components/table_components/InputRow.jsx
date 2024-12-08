
import { About1Svg } from "../svg_components/About1Svg";
import { AddSvg } from "../svg_components/AddSvg";
import { TrashSvg } from "../svg_components/TrashSvg";
import { EditSvg } from "../svg_components/EditSvg";
import { CustomInput } from "../custom_components/CustomInput";
import { v4 as uuid } from "uuid";

import { useEffect, useState} from "react";
import { CustomLabel } from "../custom_components/CustomLabel";
import { Alert } from "../alert_components/Alert/Alert";

export const InputRow = ({ id,rowNumber,addRow,deleteRow,plotData,handleChange,columns,data,buttons,isActive }) => {
    const handleEdit = (e,callback = undefined) => {
        let keysDataRows = Object.keys(data[`row${rowNumber}`])
        let continueProcess = keysDataRows.length >= 4 ? true : false;

        for(let i = 0;i < keysDataRows.length;i++){
            if(data[`row${rowNumber}`][keysDataRows[i]] === ""){
                continueProcess = false;
                Alert.fire({
                    "text":"No puede haber ninguna entrada vacía",
                    "type":"error"
                })
                return;
            }
        }
        if(continueProcess){
            e.detail = {
                "data":data[`row${rowNumber}`]
            }
            if(callback) callback(e,!isActive ? "pre-edit" : "pre-save");
            if(callback) callback(e,!isActive ? "post-edit" : "post-save");

        }
    }

    const handleAddRow = (e,callback = undefined) => {
        if(callback) callback(e,"pre-add");
        let addedRow = addRow(e);
        e.detail = {
            addedRow:addedRow
        }
        if(callback) callback(e,"post-add");

        if(!isActive){
            handleEdit(e);
        }
    }

    const handleDelete = (e,callback = undefined) => {
        if(callback) callback(e,"pre-delete");
        let deletedRow = deleteRow(e);
        e.detail = {
            deletedRow:deletedRow
        };
        if(callback) callback(e,"post-delete");
    }
    let types = {
        add:handleAddRow,
        edit:handleEdit,
        delete:handleDelete
    } 
    const handleCustomCallback = (e,callback) => {
        callback(e,data);
    }

    return (
        <>
        <div className="row table-grid-container"  id={id}>
            {columns.map((column) => {

                
                if(isActive)
                    return <div className="flex-container" key={uuid()}> <CustomInput value={data[`row${rowNumber}`][column.name]} handleChange={handleChange} identifier={`row${ rowNumber }`} readOnly={column.name === "d1_d2"} name={`${column.name}`}/> </div>  
                return <div className="flex-container" key={uuid()}> <CustomLabel value={data[`row${rowNumber}`][column.name]} identifier={`row${ rowNumber }`} name={`${column.name}`}/> </div>
        })}
            <div className={`row${rowNumber} flex-container self-align-center full-width`}>
                <div className={`flex-container no-padding left-alignment containerRow containerRow${rowNumber}`}>
                    {
                        buttons ?
                        buttons.map((data) => {
                            if(isActive)
                                return <div key={uuid()} onClick={(e) => (types[data.action] !== undefined ? types[data.action](e,data.callback) : handleCustomCallback(e,data.callback))} className={`update-data-icons ${data.name}`}>
                                            {data.svgComponent}
                                        </div>
                            return <div key={uuid()} onClick={(e) => (types[data.action] !== undefined ? types[data.action](e,data.callback) : data.callback(e,data.action))} className={`update-data-icons ${data.name}`}>
                                        {data.action === "edit" ? (data.secondSvgComponent !== undefined ? data.secondSvgComponent : data.svgComponent) : data.svgComponent}
                                    </div>
                        })
                        : 
                        ''
                    }   
                </div>
            </div>
        </div>
        </>
    );
}