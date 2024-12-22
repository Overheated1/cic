import { CustomInput } from "../custom_components/CustomInput";
import { v4 as uuid } from "uuid";
import { useEffect, useState} from "react";
import { CustomLabel } from "../custom_components/CustomLabel";
import { Alert } from "../alert_components/Alert/Alert";
import { CustomCheckbox } from "../custom_components/CustomCheckbox";
import { decrementRowCountAction, incrementRowCountAction } from "../../redux/actions/selectedRowsNumberActions";
import { useDispatch } from "react-redux";

export const InputRow = ({ table_id,id,isANewRow,activeRowNumber,rowNumber,addRow,plotData,handleChange,columns,data,buttons }) => {
    
    const [active,setIsActive] = useState(isANewRow);
    const dispatch = useDispatch();
    const handleEdit = (e,callback = undefined) => {
        let keysDataRows = Object.keys(data)
        let continueProcess = true;

        if(isANewRow) activeRowNumber = rowNumber;
        
        for(let i = 0;i < keysDataRows.length;i++){
            if(data[keysDataRows[i]] === ""){
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
                "data":data
            }

            if(callback) callback(e,activeRowNumber != rowNumber ? "pre-edit" : "pre-save");
            if(callback) callback(e,activeRowNumber != rowNumber ? "post-edit" : "post-save");
        
            activeRowNumber = rowNumber
            setIsActive(!active);
        }
    }

    const handleAddRow = (e,callback = undefined) => {
        if(callback) callback(e,"pre-add");
        let { row,rowNumber } = addRow(e);

        e.detail = {
            addedRow:row,
            rowNumber:rowNumber
        }
        activeRowNumber = rowNumber

        // handleEdit(e);
    }

    let types = {
        add:handleAddRow,
        edit:handleEdit,
    } 
    let callbackAssociations = {};

    const handleCustomCallback = (e,callback) => {
        callback(e,data);
    }
    
    const handleCheckbox = (e) => {
        if(e.target.checked)
            dispatch(incrementRowCountAction(table_id))
        else
            dispatch(decrementRowCountAction(table_id))
    }

    return (
        <>
        <div className="row table-grid-container"  id={id}>
            <div className="flex-container custom-checkbox-container" key={uuid()}> 
                <CustomCheckbox handleCheckbox={handleCheckbox} isMasterCheck={false} identifier={`custom-checkbox${ rowNumber } row${ rowNumber }`} name={`custom-checkbox`}/>
            </div> 
            {
                
                columns.map((column,index) => {
                
                        return(
                            <div className="flex-container" key={uuid()}> 
                            {
                                active ?  
                                    <CustomInput value={data[column.name]} handleChange={handleChange} identifier={`row${ rowNumber }`} readOnly={column.name === "d1_d2"} name={`${column.name}`}/> 
                                    : 
                                    <CustomLabel value={data[column.name]} identifier={`row${ rowNumber }`} name={`${column.name}`}/>
                            }
                            </div>
                        ) 
                })
            }
            <div className={`row${rowNumber} flex-container self-align-center container-action-buttons full-width`}>
                <div className={`flex-container no-padding left-alignment containerRow containerRow${rowNumber}`}>
                    {
                        buttons ?
                        buttons.map((data) => { 
                            callbackAssociations[data.action] = data.callback;
                            
                            if(active)
                                return <div key={uuid()} onClick={(e) => (types[data.action] !== undefined ? types[data.action](e,data.callback) : handleCustomCallback(e,data.callback))} className={`update-data-icons ${data.name}`}>
                                            {data.svgComponent}
                                        </div>
                            return <div key={uuid()} onClick={(e) => (types[data.action] !== undefined ? types[data.action](e,data.callback) : data.callback(e,data.action))} className={`update-data-icons ${data.name}`}>
                                        {data.action === "edit" ? (data.secondSvgComponent ?? data.svgComponent) : data.svgComponent}
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