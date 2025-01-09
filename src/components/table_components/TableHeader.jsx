import { useEffect, useRef, useState } from "react"
import { DownloadCsvSvg } from "../svg_components/DownloadCsvSvg"
import { ErrorSvg } from "../svg_components/ErrorSvg"
import { PrintSvg } from "../svg_components/PrintSvg"
import { SearchSvg } from "../svg_components/SearchSvg"
import { TrashSvg } from "../svg_components/TrashSvg"
import { CustomCheckbox } from "../custom_components/CustomCheckbox.jsx";
import { v4 as uuid } from "uuid";
import { useDispatch, useSelector } from "react-redux"
import { clearSelectionAction, fullSelectionAction } from "../../redux/actions/selectedRowsNumberActions.js"
import { exportTableToExcel } from "./tableFunctions/downloadExcel.js"
import { printTable } from "./tableFunctions/printTable.js"

export const TableHeader = ({setActualRows,table_id,dataRows,setDataRowsToMap,columnHeaders,tableTitle,handleDelete,deleteOptionsObject}) => {
    const [isVisibleSearching,setIsVisibleSearching] = useState(false);
    const [isMasterCheckChecked, setIsMasterCheckChecked] = useState(false);
    const dispatch = useDispatch();
    let searchInput = useRef(undefined);
    
    const selectedRowCount = useSelector((state) => state.selectedRows[table_id] || 0);

    const handleCheckAll = (e) => {
        let checkboxesList = document.querySelectorAll(".custom-normal-checkbox");

        for(let i = 0;i < checkboxesList.length;i++){
            checkboxesList[i].checked = e.target.checked;
        }

        if(e.target.checked)
            dispatch(fullSelectionAction(table_id,checkboxesList.length));    
        else
            dispatch(clearSelectionAction(table_id));

        setIsMasterCheckChecked(e.target.checked);
    }

    const search = (e) => {
        let dataObjectArray = Object.keys(dataRows);

        let filteredElements = {};
         
        for(let i = 0;i < dataObjectArray.length;i++){
            let dataRow = dataObjectArray[i];
            let dataObject = dataRows[dataRow];

            Object.values(dataObject).forEach((data) => {
                if(String(data).includes(e.target.value)) filteredElements[dataRow] = dataObject;
            })
        }

        if(Object.keys(filteredElements).length && e.target.value.length) setDataRowsToMap(filteredElements); 
        else setActualRows();
        
        
    }

    useEffect((e) => {
        if(searchInput.current)
            searchInput.current.focus();
    },[isVisibleSearching]);

    return (
        <div className = "thead table-flex-container">

            <div className="left-alignment full-width table-flex-container flex-column no-padding">
                <div className={`actions-container ${selectedRowCount > 0 ? "deleting-header" : ""}`}>
                {
                    selectedRowCount === 0 ? 
                    <>
                        <div className="table-left-part">
                            { 
                                isVisibleSearching ?
                                    <div className="table-flex-container bottom-alignment no-padding search">
                                        <SearchSvg/>
                                        <input ref={searchInput} id="search" onInput={search}  placeholder="Buscar..."/>
                                        <div className="close-handler-container" onClick={(e) => {setIsVisibleSearching(false)}}>
                                            <ErrorSvg/>
                                        </div>
                                    </div>
                                    :
                                    <span>{tableTitle}</span>
                            }
                        </div>
                        
                        <div className="table-flex-container action-icons-container">
                            <div className="parent-svg" onClick={ () => setIsVisibleSearching(!isVisibleSearching ) }>
                                <SearchSvg/>
                            </div>
                            <div className="parent-svg" onClick={(e) => exportTableToExcel(e,dataRows,columnHeaders,tableTitle)}>
                                <DownloadCsvSvg/>
                            </div>
                            <div className="parent-svg" onClick={(e) => printTable(e,dataRows,columnHeaders,tableTitle)}>
                                <PrintSvg/>
                            </div>
                        </div>
                    </>   
                    :
                    <>
                        <div className="table-flex-container selected-rows-text">{ selectedRowCount } fila(s) seleccionada(s)</div>
                        <div className="table-flex-container container-trash">
                            <div className="parent-svg" onClick={handleDelete}>
                                {deleteOptionsObject?.svgComponent ?? <TrashSvg/>}
                            </div>
                        </div>
                    </>                            
                        
                }
                </div>
            </div>
            <div className="table-grid-container">
                <div className="table-flex-container header-checkbox-container" key={uuid()}> 
                    <CustomCheckbox checked={isMasterCheckChecked} handleCheckbox={handleCheckAll} isMasterCheck={true} identifier={`header-checkbox`} name={`custom-checkbox`}/>
                </div> 
                {
                    columnHeaders.map((columnType,index) => {
                        return (
                            <div key={uuid()} className="th-cell">
                                {columnType['svgComponent']} {columnType['label']}
                            </div>
                        );
                    })
                }
                <div key={uuid()} className="th-cell">
                    {/* ACCIONES */}
                </div>
                    
            </div>
                
        </div>
    )
}