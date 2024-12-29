import { InputRow } from "./InputRow";
import { TotalizerRow } from "./TotalizerRow";
import { v4 as uuid } from "uuid";
import { useEffect, useRef, useState} from "react";
import { AddSvg } from "../svg_components/AddSvg";
// import { Alert }  from "../alert_components/Alert/Alert.js";
import { CustomSelect } from "../custom_components/custom_select_component/CustomSelect.jsx";
import { LeftArrowSvg } from "../svg_components/LeftArrowSvg.jsx";
import { RightArrowSvg } from "../svg_components/RightArrowSvg.jsx";
import { TableHeader } from "./TableHeader.jsx";
import "./table-stylesheets/Table.css";
import { fireToast } from "../alert_components/Alert/CustomAlert.jsx";

export const Table = ({columns,buttons,data,tableTitle}) => {
    var table_id = uuid(); 
    var dataRowsTemp = {};

    const [dataRows,setDataRows] = useState({});
    const [optionsPerName,setOptionsPerName] = useState({});
    const [calculable,setCalculable] = useState({});
    const [dynamicColumns,setDynamicColumns] = useState([]);
    const [columnHeaders,setColumnHeaders] = useState([]);
    const [columnHeadersWithoutCalculable,setColumnHeadersWithoutCalculable] = useState({});
    const [deleteOptionsObject,setDeleteOptionsObject] = useState({});
    const [dataRowsToMap,setDataRowsToMap] = useState({});
    const [rowsPerPage,setRowsPerPage] = useState(8);
    const [actualPageNumber,setActualPageNumber] = useState(1);
    const [totalizers,setTotalizers] = useState({});
    const dataTableBody = useRef(undefined);
    var activeRowNumber = -1;

    const setConfigs = () => {

        // INITIALIZING SETUPS
        let totalizersTemp = {};
        var calculableTemp = {};
        var optionsPerNameTemp = {};

        let columnHeadersTemp = [];
        let dynamicColumnsTemp = [];
        let columnHeadersWithoutCalculableTemp = {};

        for(let i = 0;i < columns.length;i++){
            let data = columns[i];
            if(data.hasOwnProperty('name') && data.hasOwnProperty('label')) {
                columnHeadersTemp.push({
                    'name':data['name'],
                    'label':data['label'],
                    'svgComponent':data['svgComponent'],
                });
                
                if(data?.options){
                    if(data.hasOwnProperty('options'))
                        optionsPerNameTemp[data['name']] = data['options']
                
                    if(data['options'].hasOwnProperty('calculable')) {
                        let calculableArray = data['options']['calculable']['fields'];
                        let count = 0;
        
                        calculableTemp[data['name']] = {};
                        calculableTemp[data['name']]['fields'] = []
                        calculableTemp[data['name']]['equation'] = data['options']['calculable']['equation'];
                        
                        if(data['options']?.['calculable']?.['type'] && data['options']?.['calculable']?.['type'].toLowerCase() === "dynamic")
                            dynamicColumnsTemp.push(data['name']);
                        
                        calculableTemp[data['name']]['modifiers'] = data['options']['calculable']['modifiers'];
                        while(count < calculableArray.length){
                            calculableTemp[data['name']]['fields'].push(calculableArray[count]);
                            count++;
                        }
                        //to check
                        // if(count <= 1) console.warn(`calculable field ${data['name']} will not be calculate correctly`)
                    }if (data['options'].hasOwnProperty('totalizer')){
                        totalizersTemp[data['name']] = data['options']['totalizer'];
                    }if(!data['options'].hasOwnProperty('calculable')){
                        columnHeadersWithoutCalculableTemp[data['name']] = data['options']['initialValue'] ?? "";
                    }

                }
            }else{
                console.warn("Some columns missing the label attribute");
            }
            
        }

        setTotalizers(totalizersTemp);
        setColumnHeaders(columnHeadersTemp);
        setColumnHeadersWithoutCalculable(columnHeadersWithoutCalculableTemp);
        setCalculable(calculableTemp);
        setOptionsPerName(optionsPerNameTemp);
        setDynamicColumns(dynamicColumnsTemp);
    }


    const handleDelete = (e) => {
        if(deleteOptionsObject?.callback) deleteOptionsObject?.callback(e,"pre-delete");

        let deletedRow = deleteRow(e);
        e.detail = {
            deletedRow:deletedRow
        };
        
        if(deleteOptionsObject?.callback) deleteOptionsObject?.callback(e,"post-delete");
    }

    const deleteRow = (e) => {
        Object.assign(dataRowsTemp,dataRows);
        let checkboxesList = document.querySelectorAll(".custom-normal-checkbox");
        let rowsIdentifiersToDelete = [];

        for(let i = 0;i < checkboxesList.length;i++){
            let isChecked = checkboxesList[i].checked

            if(isChecked)
                rowsIdentifiersToDelete.push(checkboxesList[i]);
        }

        for(let i = 0;i < rowsIdentifiersToDelete.length;i++){
            let classArray = rowsIdentifiersToDelete[i].classList;

            let index = undefined;
            for(let i = 0;i < classArray.length;i++){
                if(classArray[i].includes("custom-checkbox")) 
                    index = classArray[i].split("custom-checkbox")[1];
            }

            
            let deletedRow = dataRowsTemp[`row${index}`];
            delete dataRowsTemp[`row${index}`];

            // if(optionsPerName.hasOwnProperty(e.target.name)){
            //     // if had handleChange option execute it
            //     if(optionsPerName[e.target.name].hasOwnProperty("handleDelete")){
            //         optionsPerName[e.target.name]['handleDelete'](e,index);
            //     }
            // }
            setDataRows(dataRowsTemp);

            handleDynamicColumns();
            return deletedRow;
        }
    }
    
    
    const handleRow = (e,type = "add") => {
        e.stopPropagation()
        e.preventDefault()

        Object.assign(dataRowsTemp,dataRows);
        
        let rowNumber = Object.keys(dataRowsTemp).length;
        let prevRowNumber = rowNumber - 1;
        let insert = true;

        // IF CANCEL DELETE THE LAST ROW
        if(type === "cancel"){
            delete dataRowsTemp[`row${prevRowNumber}`];
            setDataRows(dataRowsTemp);
            return;
        }
        
        let container = e.target.parentNode;
        let tr = container.parentNode.parentNode
        let tdToValidate = tr.children;

        if(prevRowNumber !== -1){
            prevRowNumber = `row${prevRowNumber}`;
            // -1 because is the last buttons column in the table
            for(let i = 0;i < (tdToValidate.length - 1);i++){
                if(tdToValidate[i].firstElementChild.value === ""){
                    insert = false;
                    // Alert.fire({
                    //     "text":"No puede haber ninguna entrada vacía",
                    //     "type":"error"
                    // })

                    fireToast({ text: "No puede haber ninguna entrada vacía", type: "error" });
                    
                    return;
                }
            };
            // container.firstElementChild.style.display = "none";
        }
        
        //INITIALIZE THE ROW WITH DEFAULT VALUES IN THIS WAY BECAUSE THE ASSIGN WAY PASSES THE OBJECT BY REFERENCE 
        //dataRowsTemp[`row${rowNumber}`] = columnHeadersWithoutCalculable -> LINK ONE TO THE OTHER AND THE CHANGE WILL BE REFLECTED FROM ONE TO OTHER
        dataRowsTemp[`row${rowNumber}`] = {};
        let keyColumns = Object.keys(columnHeadersWithoutCalculable);
        for(let i = 0;i < keyColumns.length;i++){
            dataRowsTemp[`row${rowNumber}`][keyColumns[i]] = columnHeadersWithoutCalculable[keyColumns[i]];
        }

        if(insert){
            activeRowNumber = rowNumber;
            setDataRows(dataRowsTemp);

        }

        return { row : prevRowNumber === -1 ? dataRowsTemp[rowNumber] : dataRowsTemp[prevRowNumber],rowNumber : rowNumber };
    }  


    const fillData = async (data) =>  {
        let rowNumber = undefined;
        dataRowsTemp = {};
        
        for(let i=0;i < data.length;i++){
            rowNumber = i
            dataRowsTemp[`row${rowNumber}`] = data[i];
            dataRowsTemp = handleCalculableFields(`row${rowNumber}`,dataRowsTemp)
        }
        
        setDataRows(dataRowsTemp);
    }

    const handleModifiers = (modifiers,dataRowsTemp) => {
        let fields = Object.keys(modifiers);
        let arrayKeysData = Object.keys(dataRowsTemp);

        let modifiedFields = {};
        for (let m = 0; m < fields.length; m++) {
            const modifier = modifiers[fields[m]]['operations'][0]; //0 for now but consider put this in a modifiers for 
            const outputName = modifiers[fields[m]]['outputVariableName'] ?? fields[m];
            let result = 0;
            
            if(modifier === "total"){
                for (let i = 0; i < arrayKeysData.length; i++) {
                    const row = arrayKeysData[i];
                    let objectData = dataRowsTemp[row]
                    result += parseFloat(objectData[fields[m]]);
                }
            }else if(modifier === "row-count"){
                result += arrayKeysData.length
            }

            modifiedFields[outputName] = result.toFixed(2);
        }
        console.debug("modifier applied results -> ",modifiedFields);

        return modifiedFields
    }

    const handleCalculableFields = (rowNumber,dataRowsTemp,row = undefined,fieldsToRecalculate = undefined) => {
        let calculableArray = Object.keys(calculable);

        if(fieldsToRecalculate)
            calculableArray = fieldsToRecalculate;
        
        row = row ?? document.querySelector(`row${rowNumber}`);

        for(let i = 0;i < calculableArray.length;i++){
            let needed = calculable[calculableArray[i]]['fields'];
            let canCalculate = false;
            let neededFieldsAndValues = {};

            for(let j = 0;j < needed.length;j++){
                if(!dataRowsTemp[rowNumber].hasOwnProperty(needed[j])){
                    continue;
                }else if(dataRowsTemp[rowNumber][needed[j]] === ""){
                    canCalculate = false;
                }else{
                    neededFieldsAndValues[needed[j]] = dataRowsTemp[rowNumber][needed[j]];
                    canCalculate = true;
                }
                if(canCalculate && j === (needed.length - 1)){
                    console.debug("can calculate | FIELD -> ",calculableArray[i]," | NEEDED -> ",needed," | EQUATION -> ",calculable[calculableArray[i]]['equation']," | NEEDED FIELDS WITH VALUES -> ",neededFieldsAndValues)
                    
                    if(calculable[calculableArray[i]]['modifiers']){
                        let result = handleModifiers(calculable[calculableArray[i]]['modifiers'],dataRowsTemp);
                        
                        let fieldsArray = Object.keys(result);
                        
                        for (let i = 0; i < fieldsArray.length; i++) {
                            neededFieldsAndValues[fieldsArray[i]] = result[fieldsArray[i]];                            
                        }
                    }
                    
                    let result = calculateFields(neededFieldsAndValues,calculable[calculableArray[i]]['equation']);

                    if(row)
                        row.querySelector(`.${ calculableArray[i] }`).value = result;
                    
                    dataRowsTemp[rowNumber][calculableArray[i]] = `${result}`;
                }
            }
        }

        return dataRowsTemp;
    }

    const handleChange = (e,fieldValueName,name = undefined) => {
        Object.assign(dataRowsTemp,dataRows);
        let row = e.target.closest('.row');
        let rowNumber = `row${Array.from(dataTableBody.current.children).indexOf(row)}`;        
        
        if(name){
            dataRowsTemp[rowNumber][fieldValueName] = e.target.value;
            dataRowsTemp[rowNumber][name] = e.target.innerText;
        }else
            dataRowsTemp[rowNumber][e.target.name] = e.target.value;

        dataRowsTemp = handleCalculableFields(rowNumber,dataRowsTemp,row)

        if(optionsPerName.hasOwnProperty(e.target.name)){
            // if had handleChange option execute it
            if(optionsPerName[e.target.name].hasOwnProperty("handleChange")){
                optionsPerName[e.target.name]['handleChange'](e,dataRowsTemp);
            }
        }

        handleDynamicColumns();

    }

    const handleDynamicColumns = () => {
        let keysDataRows = Object.keys(dataRows);

        for (let i = 0; i < keysDataRows.length; i++) {
            const rowNumber = keysDataRows[i];
            handleCalculableFields(rowNumber,dataRows,document.querySelector(`.${ rowNumber }`,dynamicColumns))            
        }
    }

    const replaceExactWord = (str, targetWord, replacementWord) => {
        const regex = new RegExp(`\\b${targetWord}\\b`, 'g'); // 'b' is word regex
        return str.replace(regex, replacementWord); 
    }

    const calculateFields = (neededFieldsAndValues,equation) => {
        let fieldsArray = Object.keys(neededFieldsAndValues);
        let result = 0;
        let isEquation = false;

        let interpolatedEquation = equation;
        for(let i = 0;i < fieldsArray.length;i++){
            let field = fieldsArray[i];
            let valueToInterpolate = neededFieldsAndValues[fieldsArray[i]];

            if(equation === 'month-day'){
                result = new Date(valueToInterpolate).getDate() + 1;
            }else if(equation.startsWith('^')){
                result = Math.pow(parseFloat(valueToInterpolate).toFixed(2),equation.split("^")[1])
            }else{
                console.debug(interpolatedEquation.indexOf(field),interpolatedEquation)
                interpolatedEquation = replaceExactWord(interpolatedEquation,field,valueToInterpolate);
                isEquation = true;
            }            
        }
        if(isEquation) result = eval(interpolatedEquation);
        console.debug("EQUATION -> ",interpolatedEquation," | RESULT -> ",result)
        return result;
    }


    const handleRowChange = (e) => {
        let rowsPerPageTemp = e.target.value;
        setRowsPerPage(rowsPerPageTemp);

        setActualPageNumber(getPagesNumber(rowsPerPageTemp));
    }

    const handleNextData = (e) => {
        let tempPageNumber = actualPageNumber;
        let dataRowLength = Object.keys(dataRows).length;
        let isRightDisabled = tempPageNumber >= (Math.ceil(dataRowLength / rowsPerPage));
        
        if(actualPageNumber < (Math.ceil(dataRowLength / rowsPerPage)) && !isRightDisabled){
            setActualPageNumber(actualPageNumber + 1)
            tempPageNumber++;
        }
    } 

    
    const handlePrevData = (e) => {
        let tempPageNumber = actualPageNumber;
        let isLeftDisabled = tempPageNumber <= 1;
        
        if(actualPageNumber > 1 && !isLeftDisabled){
            setActualPageNumber(actualPageNumber - 1)
            tempPageNumber--;
        }
    } 

    const getPageRowCount = () => {
        let dataRowLength = Object.keys(dataRows).length;
        return rowsPerPage >= dataRowLength ? dataRowLength : rowsPerPage;
    }


    const getPagesNumber = (rowsPerPageVal = undefined) => {
        let dataRowLength = Object.keys(dataRows).length;
        return Math.ceil(dataRowLength / (rowsPerPageVal ?? rowsPerPage));
    }
    
    const setActualRows = () => {
        let temp = {};
        let rowCount = getPageRowCount();
        
        //the total elements might not be the real total elements because you could have 7 elements with 3 rows per page and 3 pages, 
        //and the total elements have a value of 9 but doesn't matter because we only need the first array position for ech page so we subtracts
        //the total with the row count in the page minus one 2 in this case 9 - 2 is 7 (we need to subtract another position because the array starts in 0 not in 1 ) and that is the needed position for the first element of 
        //the last page
        let totalElements = rowCount * actualPageNumber;
        let startIndex = (totalElements - (rowCount - 1) - 1);
        let dataRowsArray = Object.keys(dataRows);
        
        if(dataRowsArray.length){

            for(let i = 0;i < getPageRowCount();i++){
                let row = dataRowsArray[startIndex + i];
                let data = dataRows[row];
                
                if(!row) break;
                
                temp[row] = data;
            }
        }

        setDataRowsToMap(temp);
    }

    
    useEffect(() => {
        setConfigs();
    }, []);

    useEffect(() => {
        fillData(data);
    },[data]);

    
    useEffect(() => {
        setActualRows();
    },[dataRows,rowsPerPage,actualPageNumber]);


    useEffect(() => {
        let deleteIndex = undefined;
        buttons.forEach((d,i) => {
            if(d.action == "delete"){
                setDeleteOptionsObject(d);                
                deleteIndex = i;
            } 
        })

        if(deleteIndex)
            buttons = buttons.splice(deleteIndex,1)
    },[buttons])


    return (
    <div id='custom-table'>
            <TableHeader setActualRows={setActualRows} dataRowsToMap={ dataRowsToMap } setDataRowsToMap={ setDataRowsToMap } dataRows={dataRows} table_id={table_id} columnHeaders={columnHeaders} tableTitle={tableTitle} handleDelete={handleDelete} deleteOptionsObject={deleteOptionsObject}/>                
            <div id="data-container" ref={dataTableBody} className="data-container tbody">
                {
                    Object.keys(dataRowsToMap).length === 0 ?
                        <div  className="no-data-column">
                            <div className="table-no-data-row">
                                <p className="no-data-paragraph">No hay datos por el momento</p> <div onClick={handleRow} className="update-data-icons add-row">
                                    <AddSvg/>
                                </div>
                            </div>
                        </div> 
                        :
                        Object.keys(dataRowsToMap).map((row,index) => {
                            let data = dataRowsToMap[row];
                            let id = uuid();

                            let dataValues = Object.values(data)
                            let isANewRow = false;

                            for(let i = 0;i < dataValues.length;i++){
                                if(dataValues[i] == ""){
                                    isANewRow = true; 
                                    break;
                                }
                            }
                            return (
                                <InputRow table_id={table_id}  isANewRow={isANewRow} buttons={buttons} key={id} id={id} data={data} columns={columns} activeRowNumber={activeRowNumber} rowNumber={index} handleChange={handleChange} handleRow={handleRow}/>
                            );
                        })
                }
                
            </div>
            {
                Object.keys(totalizers).length && Object.keys(dataRowsToMap).length ? 
                <TotalizerRow totalizers={totalizers} columns={columns} dataRows={dataRows} data={data}/> 
                : 
                <></>
            }
            <div className = "table-footer">
                <div className="table-flex-container table-actions-container">
                    <span>Filas por página</span>
                    <CustomSelect customClassName={"select-alternative"} selectedValue = {8} onChange={handleRowChange} name="row_per_page" placeholder={"1"} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={
                        Array.from({ length: 9 }, (_, index) => {

                            const number = index + 1;
                        
                            return {
                                value: number,
                                text: number
                            };
                        
                        })
                    } placeholderSearchBar={"Buscar.."}/>
                    <span>{actualPageNumber} - {rowsPerPage} de {getPagesNumber()}</span>
                    <div className="table-flex-container">
                        <div className={`pointer-cursor ${actualPageNumber <= 1 ? "disabled" : ""}`} onClick={handlePrevData}>
                            <LeftArrowSvg/>
                        </div>
                        <div className={`pointer-cursor ${actualPageNumber >= (Math.ceil(Object.keys(dataRows).length / rowsPerPage)) ? "disabled" : ""}`} onClick={handleNextData}>
                            <RightArrowSvg/>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
    )
}