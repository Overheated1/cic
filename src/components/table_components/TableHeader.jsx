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

export const TableHeader = ({setActualRows,table_id,dataRows,dataRowsToMap,setDataRowsToMap,columnHeaders,tableTitle,handleDelete,deleteOptionsObject}) => {
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
        setActualRows();
        let dataObjectArray = Object.keys(dataRowsToMap);

        let filteredElements = {};
         
        for(let i = 0;i < dataObjectArray.length;i++){
            let dataRow = dataObjectArray[i];
            let dataObject = dataRowsToMap[dataRow];

            if(Object.values(dataObject).includes(e.target.value)) filteredElements[dataRow] = dataObject;
        }

        setDataRowsToMap(filteredElements);
    }

    useEffect((e) => {
        console.log(searchInput.current);
        if(searchInput.current)
            searchInput.current.focus();
    },[isVisibleSearching]);

    return (
        <div className = "thead flex-container flex-column left-alignment full-width no-padding">

            <div className="left-alignment full-width flex-container flex-column no-padding">
                <div className={`actions-container full-width extra-gap no-margin ${selectedRowCount > 0 ? "deleting-header" : ""}`}>
                {
                    selectedRowCount === 0 ? 
                    <>
                        <div className="table-left-part flex-container left-alignment full-width">
                            { 
                                isVisibleSearching ?
                                    <div className="flex-container bottom-alignment no-padding search">
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
                        
                        <div className="flex-container right-alignment extra-gap action-icons-container">
                            <div className="parent-svg" onClick={ () => setIsVisibleSearching(!isVisibleSearching ) }>
                                <SearchSvg/>
                            </div>
                            <div className="parent-svg" onClick={(e) => exportTableToExcel(e,dataRows,columnHeaders,tableTitle)}>
                                <DownloadCsvSvg/>
                            </div>
                            <div className="parent-svg">
                                <PrintSvg/>
                            </div>
                        </div>
                    </>   
                    :
                    <>
                        <div className="flex-container selected-rows-text">{ selectedRowCount } fila(s) seleccionada(s)</div>
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
                <div key={uuid()} className="flex-container th-cell full-width no-margin no-padding">
                    Acciones
                </div>
                    
            </div>
                
        </div>
    )
}