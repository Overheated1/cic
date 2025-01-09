import { CustomInput } from "../custom_components/CustomInput";
import { v4 as uuid } from "uuid";
import { useEffect, useState} from "react";
import { CustomLabel } from "../custom_components/CustomLabel";
import { CustomCheckbox } from "../custom_components/CustomCheckbox";

export const TotalizerRow = ({ columns,dataRows,data,totalizers }) => {

    const handleTotalizers = (column) => {
        if(totalizers.hasOwnProperty(column.name)){
            let operation = totalizers[column.name];

            let result = 0;

            if(operation === "row-count"){
                result = Object.keys(dataRows).length
            }else if(operation === "total"){
                let keysData = Object.keys(dataRows);
                
                for (let i = 0; i < keysData.length; i++) {
                    const fields = Object.keys(dataRows[keysData[i]]);
                    for (let x = 0; x < fields.length; x++) {
                        const field = fields[x];
                        
                        if(totalizers.hasOwnProperty(field) && totalizers[field] === operation){
                            let cellValue = dataRows[keysData[i]][field].length ? dataRows[keysData[i]][field] : 0; 
                            result += parseFloat(cellValue);
                        }   
                    }
                }
            }

            return <CustomLabel value={operation === "row-count" ? result : result.toFixed(2)} name={`${column.name}`}/>
        }
    }
    return (
        <>
            <div className="row totalizer-row table-grid-container">
                <div className="table-flex-container totalizer-cell">Total.</div>
                {
                    columns.map((column,index) => {
                        return(
                            <div className="table-flex-container totalizer-cell" key={uuid()}> 
                            { handleTotalizers(column) }
                            </div>
                        ) 
                    })
                }                
                <div className="table-flex-container totalizer-cell"></div>
            </div>
        </>
    );
}