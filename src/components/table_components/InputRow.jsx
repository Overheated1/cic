import { CustomInput } from "../custom_components/CustomInput";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import { CustomLabel } from "../custom_components/CustomLabel";
// import { Alert }  from "../alert_components/Alert/Alert";
import { CustomCheckbox } from "../custom_components/CustomCheckbox";
import { decrementRowCountAction, incrementRowCountAction } from "../../redux/actions/selectedRowsNumberActions";
import { useDispatch } from "react-redux";
import { fireToast } from "../alert_components/Alert/CustomAlert";
import { SaveSvg } from "../svg_components/SaveSvg";

export const InputRow = ({ table_id,id,isANewRow,activeRowNumber,rowNumber,handleRow,handleChange,columns,data,buttons }) => {
    /*
    Remember that the handleEdit is in charge for the edit and save process but when there is no edit the handleAdd when the row is active 
    is in charge fro the save process redirecting the event to the handleEdit 
    */
    const [active,setIsActive] = useState(isANewRow);
    const renderSaveSvgInAdd = !buttons.filter(d => d.action === "edit").length > 0;

    const dispatch = useDispatch();

    const handleEdit = async (e,callback = undefined,action = undefined) => {
        let keysDataRows = Object.keys(data)
        let continueProcess = true;

        if(action === "cancel") {
            setIsActive(false);
            if(isANewRow) handleRow(e,action);
            return;
        }

        if(callback && !isANewRow && !active){
            continueProcess = await callback(e,"pre-save");
        } 

        if(isANewRow) activeRowNumber = rowNumber;
        
        for(let i = 0;i < keysDataRows.length;i++){
            if(data[keysDataRows[i]] === ""){
                continueProcess = false;
                // Alert.fire({
                //     "text":"No puede haber ninguna entrada vacía",
                //     "type":"error"
                // })

                fireToast({ text: "No puede haber ninguna entrada vacía", type: "error" });
                return;
            }
        }

        if(continueProcess){

            e.detail = {
                "data":data
            }


            if(active){
                if(callback) callback(e,"post-save");
            }
        
            activeRowNumber = rowNumber
            setIsActive(!active);
        }
    }

    const handleAddRow = (e,callback = undefined,action = undefined) => {
        // SAVE PROCESS WHEN THERE IS NO A EDIT BUTTON
        if(action === "add" && active){
            handleEdit(e,callback,action);
            return;
        }

        if(callback) callback(e,"pre-add");
        let { row,rowNumber } = handleRow(e);

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

    
    const handleCheckbox = (e) => {
        if(e.target.checked)
            dispatch(incrementRowCountAction(table_id))
        else
            dispatch(decrementRowCountAction(table_id))
    }


    return (
        <>
        <div className={`row row${rowNumber} table-grid-container`}  id={id}>
            <div className="table-flex-container custom-checkbox-container" key={uuid()}> 
                <CustomCheckbox handleCheckbox={handleCheckbox} isMasterCheck={false} identifier={`custom-checkbox${ rowNumber } row${ rowNumber }`} name={`custom-checkbox`}/>
            </div> 
            {
                columns.map((column,index) => {
                        const Component = column['options']?.['customComponent'];

                        return(
                            <div className="table-flex-container" key={uuid()}> 
                            {
                                active ?  
                                    (
                                        Component ? 
                                        column['options']?.['customComponent'](data[column.fieldValueName ?? column.name],{},(e) => handleChange(e,column.fieldValueName,column.name))
                                        : 
                                        <CustomInput value={data[column.name]} handleChange={handleChange} readOnly={column.options?.readOnly ?? false} name={`${column.name}`} /> 
                                    )
                                    :   
                                    <CustomLabel value={data[column.name]} name={`${column.name}`}/>
                            }
                            </div>
                        ) 
                })
            }
            <div className={`row${rowNumber} table-flex-container self-align-center container-action-buttons full-width`}>
                <div className={`table-flex-container no-padding left-alignment containerRow containerRow${rowNumber}`}>
                    {
                        buttons ?
                        buttons.map((buttonConfig,index) => { 
                            let renderSvgInAdd = buttonConfig.action === "add" && renderSaveSvgInAdd;
                            
                            return active  && (buttonConfig.action === "edit" ||  renderSvgInAdd) ? 
                                <div key={uuid()} className="container-third-btn"> 
                                    <div  onClick={(e) => (types[buttonConfig.action] !== undefined ? types[buttonConfig.action](e,buttonConfig.callback,buttonConfig.action) : buttonConfig.callback(e,data))} className={`update-data-icons ${buttonConfig.name}`}>
                                        { buttonConfig.secondSvgComponent ?? <SaveSvg /> }
                                    </div>
                                    {
                                        buttonConfig.thirdSvgComponent && 
                                        <div onClick={(e) => (types[buttonConfig.action] !== undefined ? types[buttonConfig.action](e,buttonConfig.callback,"cancel") : buttonConfig.callback(e,data))} className={`update-data-icons ${buttonConfig.name}`}>
                                            { buttonConfig.thirdSvgComponent }
                                        </div>    
                                    }
                                    
                                </div>
                                : 
                                <div key={uuid()} onClick={(e) => (types[buttonConfig.action] !== undefined ? types[buttonConfig.action](e,buttonConfig.callback) : buttonConfig.callback(e,data))} className={`update-data-icons ${buttonConfig.name}`}>
                                    { buttonConfig.svgComponent }
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