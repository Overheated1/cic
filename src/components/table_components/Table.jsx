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

export const Table = ({columns,buttons,data,tableTitle}) => {
    let optionsPerName = {};
    let columnHeaders = [];
    let columnHeadersWithoutCalculable = [];
    let calculable = {};
    var dataRows = {};
    let actualRow = "";
    const [dataRowsComponent,setDataRowsComponent] = useState([]);
    const [isVisibleSearching,setIsVisibleSearching] = useState(false);
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


    
    const deleteRow = (e) => {
        e.stopPropagation()
        e.preventDefault()

        setDataRowsComponent(prevDataRowsComponent => [
            ...prevDataRowsComponent.filter((data) => {
                return data.key !== e.target.parentNode.parentNode.parentNode.id
            }),
        ]);
        let rowKey = e.target.parentNode.parentNode.classList[0];
        let deletedRow = dataRows[rowKey];
        
        delete dataRows[rowKey];
        let index = rowKey.split("row")[1];
        let prevIndex = index - 1;
        //fix later esto es lo que esconde el plot data button
        // if(prevIndex >= 0)
            // document.querySelector(`.containerRow${prevIndex} .plot-data`).style.display = "flex"; //shows the plot icon in the row below
        if(optionsPerName.hasOwnProperty(e.target.name)){
            // if had handleChange option execute it
            if(optionsPerName[e.target.name].hasOwnProperty("handleDelete")){
                optionsPerName[e.target.name]['handleDelete'](e,index);
            }
        }
        return deletedRow;
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
        let rowNumber = Object.keys(dataRows).length;
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
            container.firstElementChild.style.display = "none";
        }
        
        //INITIALIZE THE ROW WITH DEFAULT VALUES IN THIS WAY BECAUSE THE ASSIGN WAY PASSES THE OBJECT BY REFERENCE 
        //dataRows[`row${rowNumber}`] = columnHeadersWithoutCalculable -> LINK ONE TO THE OTHER AND THE CHANGE WILL BE REFLECTED FROM ONE TO OTHER
        dataRows[`row${rowNumber}`] = {};
        for(let i = 0;i < columnHeadersWithoutCalculable.length;i++){
            dataRows[`row${rowNumber}`][columnHeadersWithoutCalculable[i]] = "";
        }
        
        if(insert){
            rowNumberActive  = rowNumber;
            console.log(rowNumber,rowNumberActive)
            setDataRowsComponent(prevDataRowsComponent => {
                return [...prevDataRowsComponent,<InputRow buttons={buttons} key={id} id={id} data={dataRows} columns={columns} isActive={rowNumber == rowNumberActive} rowNumber={rowNumber} handleChange={handleChange} addRow={addRow} deleteRow={deleteRow}/>
                ]
            });
        }
        return prevRowNumber === -1 ? dataRows[rowNumber] : dataRows[prevRowNumber];
    }  

    const fillData = async (data) =>  {
        let tempObjectRows = [];
        let id = undefined;
        let rowNumber = undefined;
        dataRows = {};
        
        for(let i=0;i < data.length;i++){
            id = uuid(); 
            rowNumber = i
            dataRows[`row${rowNumber}`] = data[i];
            
            tempObjectRows.push(<InputRow buttons={buttons} key={id} id={id} data={dataRows} columns={columns} rowNumber={rowNumber} handleChange={handleChange} addRow={addRow} deleteRow={deleteRow}/>)
        }
        setDataRowsComponent(tempObjectRows);
    }
    const handleChange = (e) => {
        let classList = e.target.classList;
        let rowNumber = classList[classList.length - 1];
        let calculableArray = Object.keys(calculable);

        dataRows[rowNumber][e.target.name] = e.target.value;

        for(let i = 0;i < calculableArray.length;i++){
            let needed = calculable[calculableArray[i]]['fields'];
            let canCalculate = false;
            let neededNumbers = [];

            for(let j = 0;j < needed.length;j++){
                if(!dataRows[rowNumber].hasOwnProperty(needed[j])){
                    return;
                }else if(dataRows[rowNumber][needed[j]] === ""){
                    canCalculate = false;
                }else{
                    neededNumbers.push(dataRows[rowNumber][needed[j]]);
                    canCalculate = true;
                }
                if(canCalculate && j === (needed.length - 1)){
                    let d1_d2 = calculateFields(neededNumbers,calculable[calculableArray[i]]['operation']);
                    document.querySelector(`input.${ rowNumber }.${ calculableArray[i] }`).value = d1_d2;
                    dataRows[rowNumber]["d1_d2"] = `${d1_d2}`;
                }
            }
        }
        if(optionsPerName.hasOwnProperty(e.target.name)){
            // if had handleChange option execute it
            if(optionsPerName[e.target.name].hasOwnProperty("handleChange")){
                optionsPerName[e.target.name]['handleChange'](e,dataRows);
            }
        }
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
        console.log(e);
    }

    useEffect(() => {
        fillData(data);
    },[data]);


    return (
        <div id="custom-table">
            <div className = "thead flex-container flex-column left-alignment full-width">
                <div className="left-alignment full-width flex-container flex-column">
                    <div className="actions-container full-width extra-gap no-margin no-padding">
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
                    </div>
                </div>
                <div className="table-grid-container">
                {
                        columnHeaders.map((columnType) => {
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
                    dataRowsComponent.map((data) => {
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
                    <span>1 - 8 de 9</span>
                    <div className=" flex-container">
                        <div className="pointer-cursor disabled">
                            <LeftArrowSvg/>
                        </div>
                        <div className="pointer-cursor">
                            <RightArrowSvg/>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
    )
}