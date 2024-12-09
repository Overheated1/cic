import { InputRow } from "./InputRow";
import { v4 as uuid } from "uuid";
import { useEffect, useState} from "react";
import { SearchSvg } from "../svg_components/SearchSvg";
import { AddSvg } from "../svg_components/AddSvg";
import { DownloadCsvSvg } from "../svg_components/DownloadCsvSvg";
import { PrintSvg } from "../svg_components/PrintSvg";
import { Alert } from "../alert_components/Alert/Alert.js";
import { ErrorSvg } from "../svg_components/ErrorSvg.jsx";
import { CustomSelect } from "../custom_components/custom_select_component/CustomSelect.jsx";
import { LeftArrowSvg } from "../svg_components/LeftArrowSvg.jsx";
import { RightArrowSvg } from "../svg_components/RightArrowSvg.jsx";
import { CustomCheckbox } from "../custom_components/CustomCheckbox.jsx";
import { TrashSvg } from "../svg_components/TrashSvg.jsx";

export const Table = ({columns,buttons,data,tableTitle}) => {
    let optionsPerName = {};
    let columnHeaders = [];
    let columnHeadersWithoutCalculable = [];
    let calculable = {};
    var dataRowsTemp = {};
    var checkedCountTemp = 0;
    let actualRow = "";
    const [dataRowsComponent,setDataRowsComponent] = useState([]);
    const [dataRows,setDataRows] = useState({});
    const [deleteOptionsObject,setDeleteOptionsObject] = useState({});
    const [dataRowsComponentToMap,setDataRowsComponentToMap] = useState([]);
    const [isVisibleSearching,setIsVisibleSearching] = useState(false);
    const [isMasterCheckChecked, setIsMasterCheckChecked] = useState(false);
    const [rowsPerPage,setRowsPerPage] = useState(8);
    const [checkedCount,setCheckedCount] = useState(0);
    const [actualPageNumber,setActualPageNumber] = useState(1);

    var rowNumberActive = 0;


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

    
    const handleCheckAll = (e) => {
        let checkboxesList = document.querySelectorAll(".custom-normal-checkbox");

        for(let i = 0;i < checkboxesList.length;i++){
            checkboxesList[i].checked = e.target.checked;
        }

        if(e.target.checked){
            checkedCountTemp = checkboxesList.length;
            setCheckedCount(checkboxesList.length);    
        }else{
            checkedCountTemp = 0;
            setCheckedCount(0);
        }
        setIsMasterCheckChecked(e.target.checked);
    }

    const handleCheckbox = (action,checkbox_id,e = undefined,id = undefined) => {
        if(e.target.checked) checkedCountTemp++;
        else checkedCountTemp--;

        setCheckedCount(checkedCountTemp)
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
        dataRowsTemp = dataRows;
        let checkboxesList = document.querySelectorAll(".custom-normal-checkbox");
        let rowsIdentifiersToDelete = [];

        for(let i = 0;i < checkboxesList.length;i++){
            let isChecked = checkboxesList[i].checked

            if(isChecked)
                rowsIdentifiersToDelete.push(checkboxesList[i]);
        }

        for(let i = 0;i < rowsIdentifiersToDelete.length;i++){
            let rowKey = rowsIdentifiersToDelete[i].parentNode.rowId;
            let classArray = rowsIdentifiersToDelete[i].classList;

            let index = undefined;
            for(let i = 0;i < classArray.length;i++){
                if(classArray[i].includes("custom-checkbox")) 
                    index = classArray[i].split("custom-checkbox")[1];
            }

            let prevIndex = index - 1;
            
            setDataRowsComponent(prevDataRowsComponent => [
                ...prevDataRowsComponent.filter((data) => {
                    return data.key !== rowKey
                }),
            ]);

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
    
    const search = (e) => {
        let tbody = document.getElementById("data-container");
        let tr = tbody.querySelectorAll("tr");
        if(e.target.value === ''){
            for(let i =0;i<tr.length;i++){
                tr[i].style.display = "table-row";
            }
        }else{
            let continueLooping = false;
            for(let i =0;i<tr.length;i++){
                let children = tr[i].querySelectorAll("input")
                for(let x =0;x<children.length;x++){
                    continueLooping = false;
                    if(children[x].value === e.target.value){
                        continueLooping = true;
                        tr[i].style.display = "table-row";
                        break
                    }
                }
                if(!continueLooping) tr[i].style.display = "none";
            } 
        }
    }
    
    const addRow = (e) => {
        e.stopPropagation()
        e.preventDefault()
        dataRowsTemp = dataRows;
        
        let rowNumber = Object.keys(dataRowsTemp).length;
        let prevRowNumber = rowNumber - 1;
        actualRow = `row${rowNumber}`;
        let insert = true;
        let id = uuid(); 
        let container = e.target.parentNode;
        let tr = container.parentNode.parentNode
        let tdToValidate = tr.children;

        if(prevRowNumber !== -1){
            prevRowNumber = `row${prevRowNumber}`;
            // -1 because the buttons in the table is the last column
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
            rowNumberActive  = rowNumber;

            setDataRowsComponent(prevDataRowsComponent => {
                return [...prevDataRowsComponent,<InputRow  handleCheckbox={handleCheckbox} buttons={buttons} key={id} id={id} data={dataRowsTemp} columns={columns} isActive={rowNumber == rowNumberActive} rowNumber={rowNumber} handleChange={handleChange} addRow={addRow}/>
                ]
            });
            setDataRows(dataRowsTemp);
        }
        return prevRowNumber === -1 ? dataRowsTemp[rowNumber] : dataRowsTemp[prevRowNumber];
    }  


    const fillData = async (data) =>  {
        let tempObjectRows = [];
        let id = undefined;
        let rowNumber = undefined;
        dataRowsTemp = {};
        
        for(let i=0;i < data.length;i++){
            id = uuid(); 
            rowNumber = i
            dataRowsTemp[`row${rowNumber}`] = data[i];
            
            tempObjectRows.push(<InputRow  handleCheckbox={handleCheckbox} buttons={buttons} key={id} id={id} data={dataRowsTemp} columns={columns} rowNumber={rowNumber} handleChange={handleChange} addRow={addRow}/>)
        }
        setDataRowsComponent(tempObjectRows);
        setDataRows(dataRowsTemp);
    }
    const handleChange = (e) => {
        let classList = e.target.classList;
        let rowNumber = classList[classList.length - 1];
        let calculableArray = Object.keys(calculable);

        dataRowsTemp = dataRows;
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

        setDataRows(dataRowsTemp)
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
        let isRightDisabled = tempPageNumber >= (Math.ceil(dataRowsComponent.length / rowsPerPage));
        
        if(actualPageNumber < (Math.ceil(dataRowsComponent.length / rowsPerPage)) && !isRightDisabled){
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
        return rowsPerPage >= dataRowsComponent.length ? dataRowsComponent.length : rowsPerPage;
    }


    const getPagesNumber = (rowsPerPageVal = undefined) => {
        return Math.ceil(dataRowsComponent.length / (rowsPerPageVal ?? rowsPerPage));
    }

    useEffect(() => {
        fillData(data);
    },[data]);

    useEffect(() => {
        let temp = [];
        let rowCount = getPageRowCount();
        
        //the total elements might not be the real total elements because you could have 7 elements with 3 rows per page and 3 pages, 
        //and the total elements have a value of 9 but doesn't matter because we only need the first array position for ech page so we subtracts
        //the total with the row count in the page minus one 2 in this case 9 - 2 is 7 (we need to subtract another position because the array starts in 0 not in 1 ) and that is the needed position for the first element of 
        //the last page
        let totalElements = rowCount * actualPageNumber;
        let startIndex = (totalElements - (rowCount - 1) - 1);

        for(let i = 0;i < rowsPerPage;i++){
            temp.push(dataRowsComponent[startIndex + i]);
        }

        setDataRowsComponentToMap(temp);
        
    },[dataRowsComponent,rowsPerPage,actualPageNumber]);

    
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
        <div id="custom-table">
            <div className = "thead flex-container flex-column left-alignment full-width no-padding">
                <div className="left-alignment full-width flex-container flex-column no-padding">
                    <div className={`actions-container full-width extra-gap no-margin ${checkedCount > 0 ? "deleting-header" : ""}`}>
                        {
                            checkedCount === 0 ? 
                            <>
                                <div className="table-left-part flex-container left-alignment full-width">
                                    { 
                                        isVisibleSearching ?
                                            <div className="flex-container bottom-alignment no-padding search">
                                                <SearchSvg/>
                                                <input id="search" onInput={search}  placeholder="Buscar..."/>
                                                <div className="close-handler-container" onClick={(e) => setIsVisibleSearching(false)}>
                                                    <ErrorSvg/>
                                                </div>
                                            </div>
                                            :
                                            <span>{tableTitle}</span>
                                    }
                                </div>
                                
                                <div className="flex-container right-alignment extra-gap action-icons-container">
                                    <div className="parent-svg" onClick={(e) => setIsVisibleSearching(!isVisibleSearching)}>
                                        <SearchSvg/>
                                    </div>
                                    <div className="parent-svg">
                                        <DownloadCsvSvg/>
                                    </div>
                                    <div className="parent-svg">
                                        <PrintSvg/>
                                    </div>
                                </div>
                            </>   
                            :
                            <>
                                <div className="flex-container selected-rows-text">{ checkedCount } fila(s) seleccionada(s)</div>
                                <div className="flex-container container-trash">
                                    <div className="parent-svg" onClick={handleDelete}>
                                        {deleteOptionsObject?.svgComponent ?? <TrashSvg/>}
                                    </div>
                                </div>
                            </>                            
                                
                        }
                    </div>
                </div>
                <div className="table-grid-container">
                <div className="flex-container header-checkbox-container" key={uuid()}> 
                    <CustomCheckbox checked={isMasterCheckChecked} handleCheckbox={handleCheckAll} isMasterCheck={true} identifier={`header-checkbox`} name={`custom-checkbox`}/>
                </div> 
                {
                        columnHeaders.map((columnType,index) => {
                            return (
                                <div key={uuid()} className="flex-container th-cell full-width no-margin no-padding">
                                    {columnType['svgComponent']} {columnType['label']}
                                </div>
                            );
                        })
                    }
                    
                </div>
                
            </div>
            <div id="data-container" className="data-container tbody">
                {dataRowsComponent.length === 0 ?
                    <div  className="no-data-column">
                        <div className="flex-container">
                            <p className="no-data-paragraph">No hay datos por el momento</p> <div onClick={addRow} className="update-data-icons add-row">
                                <AddSvg/>
                            </div>
                        </div>
                    </div> :
                    dataRowsComponentToMap.map((data) => {
                        return (
                            data
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
                        <div className={`pointer-cursor ${actualPageNumber >= (Math.ceil(dataRowsComponent.length / rowsPerPage)) ? "disabled" : ""}`} onClick={handleNextData}>
                            <RightArrowSvg/>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
    )
}