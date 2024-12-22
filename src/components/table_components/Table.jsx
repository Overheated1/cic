import { InputRow } from "./InputRow";
import { v4 as uuid } from "uuid";
import { useEffect, useState} from "react";
import { AddSvg } from "../svg_components/AddSvg";
import { Alert } from "../alert_components/Alert/Alert.js";
import { CustomSelect } from "../custom_components/custom_select_component/CustomSelect.jsx";
import { LeftArrowSvg } from "../svg_components/LeftArrowSvg.jsx";
import { RightArrowSvg } from "../svg_components/RightArrowSvg.jsx";
import { TableHeader } from "./TableHeader.jsx";

export const Table = ({columns,buttons,data,tableTitle}) => {
    var table_id = uuid(); 
    let optionsPerName = {};
    let columnHeaders = [];
    let columnHeadersWithoutCalculable = [];
    let calculable = {};
    var dataRowsTemp = {};
    const [dataRows,setDataRows] = useState({});
    const [deleteOptionsObject,setDeleteOptionsObject] = useState({});
    const [dataRowsToMap,setDataRowsToMap] = useState({});
    const [rowsPerPage,setRowsPerPage] = useState(8);
    const [actualPageNumber,setActualPageNumber] = useState(1);
    var activeRowNumber = -1;


    // INITIALIZING SETUPS
    for(let i = 0;i < columns.length;i++){
        let data = columns[i];
        if(data.hasOwnProperty('name') && data.hasOwnProperty('label')) {
            columnHeaders.push({
                'name':data['name'],
                'label':data['label'],
                'svgComponent':data['svgComponent'],
            });
            
            if(data?.options){
                if(data.hasOwnProperty('options'))
                    optionsPerName[data['name']] = data['options']
            
                if(data['options'].hasOwnProperty('calculable')) {
                    let calculableArray = data['options']['calculable']['fields'];
                    let count = 0;
    
                    calculable[data['name']] = {};
                    calculable[data['name']]['fields'] = []
                    calculable[data['name']]['operation'] = data['options']['calculable']['operation'];
                    while(count < calculableArray.length){
                        calculable[data['name']]['fields'].push(calculableArray[count]);
                        count++;
                    }
                    if(count <= 1) console.warn(`calculable field ${data['name']} will not be calculate correctly`)
                }else{
                    columnHeadersWithoutCalculable.push(data['name']);
                }
            }
        }else{
            console.warn("Some columns missing the label attribute");
        }
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
            return deletedRow;
        }
    }
    
    
    const addRow = (e) => {
        e.stopPropagation()
        e.preventDefault()
        Object.assign(dataRowsTemp,dataRows);
        
        let rowNumber = Object.keys(dataRowsTemp).length;
        let prevRowNumber = rowNumber - 1;
        let insert = true;
        let container = e.target.parentNode;
        let tr = container.parentNode.parentNode
        let tdToValidate = tr.children;

        if(prevRowNumber !== -1){
            prevRowNumber = `row${prevRowNumber}`;
            // -1 because is the last buttons column in the table
            for(let i = 0;i < (tdToValidate.length - 1);i++){
                if(tdToValidate[i].firstElementChild.value === ""){
                    insert = false;
                    Alert.fire({
                        "text":"No puede haber ninguna entrada vacía",
                        "type":"error"
                    })
                    
                    return;
                }
            };
            // container.firstElementChild.style.display = "none";
        }
        
        //INITIALIZE THE ROW WITH DEFAULT VALUES IN THIS WAY BECAUSE THE ASSIGN WAY PASSES THE OBJECT BY REFERENCE 
        //dataRowsTemp[`row${rowNumber}`] = columnHeadersWithoutCalculable -> LINK ONE TO THE OTHER AND THE CHANGE WILL BE REFLECTED FROM ONE TO OTHER
        dataRowsTemp[`row${rowNumber}`] = {};
        for(let i = 0;i < columnHeadersWithoutCalculable.length;i++){
            dataRowsTemp[`row${rowNumber}`][columnHeadersWithoutCalculable[i]] = "";
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
        }

        setDataRows(dataRowsTemp);
    }

    const handleChange = (e) => {
        let classList = e.target.classList;
        let rowNumber = classList[classList.length - 1];
        let calculableArray = Object.keys(calculable);

        Object.assign(dataRowsTemp,dataRows);

        dataRowsTemp[rowNumber][e.target.name] = e.target.value;

        for(let i = 0;i < calculableArray.length;i++){
            let needed = calculable[calculableArray[i]]['fields'];
            let canCalculate = false;
            let neededNumbers = [];

            for(let j = 0;j < needed.length;j++){
                if(!dataRowsTemp[rowNumber].hasOwnProperty(needed[j])){
                    return;
                }else if(dataRowsTemp[rowNumber][needed[j]] === ""){
                    canCalculate = false;
                }else{
                    neededNumbers.push(dataRowsTemp[rowNumber][needed[j]]);
                    canCalculate = true;
                }
                if(canCalculate && j === (needed.length - 1)){
                    let d1_d2 = calculateFields(neededNumbers,calculable[calculableArray[i]]['operation']);
                    document.querySelector(`input.${ rowNumber }.${ calculableArray[i] }`).value = d1_d2;
                    dataRowsTemp[rowNumber]["d1_d2"] = `${d1_d2}`;
                }
            }
        }
        if(optionsPerName.hasOwnProperty(e.target.name)){
            // if had handleChange option execute it
            if(optionsPerName[e.target.name].hasOwnProperty("handleChange")){
                optionsPerName[e.target.name]['handleChange'](e,dataRowsTemp);
            }
        }

        // setDataRows(dataRowsTemp)
    }

    const calculateFields = (neededNumbers,operation) => {
        let result = 0;

        for(let i = 0;i < neededNumbers.length - 1;i++){
            switch(operation){
                case '+':
                    result += parseInt(neededNumbers[i]) + parseInt(neededNumbers[i + 1]);
                    break
                case '-':
                    result += parseInt(neededNumbers[i]) - parseInt(neededNumbers[i + 1]);
                    break
                default:
                    break
            }

        }
        return result
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

        console.log("temp",temp,dataRowsToMap)
        setDataRowsToMap(temp);
    }

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
            <div id="data-container" className="data-container tbody">
                {
                    Object.keys(dataRowsToMap).length === 0 ?
                        <div  className="no-data-column">
                            <div className="flex-container">
                                <p className="no-data-paragraph">No hay datos por el momento</p> <div onClick={addRow} className="update-data-icons add-row">
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
                                <InputRow table_id={table_id}  isANewRow={isANewRow} buttons={buttons} key={id} id={id} data={data} columns={columns} activeRowNumber={activeRowNumber} rowNumber={index} handleChange={handleChange} addRow={addRow}/>
                            );
                        })
                }
            </div>
            <div className = "table-footer">
                <div className="flex-container extra-gap right-alignment full-width">
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
                    <div className=" flex-container">
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