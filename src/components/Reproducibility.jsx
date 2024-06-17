import "../style-sheets/Reproducibility.css"
import { useState} from "react";
import { DemoLine } from "./DemoLine";
import { N } from "./svg_components/NSvg";
import { D1D2 } from "./svg_components/D1D2Svg";
import DID2 from "../resources/svg/d1_d2.svg";
import { D1AndD2 } from "./svg_components/D1AndD2Svg";
import { DateSvg } from "./svg_components/DateSvg";
import { SearchSvg } from "./svg_components/SearchSvg";
import { InputRow } from "./table_components/InputRow";
import { v4 as uuid } from "uuid";
import { AddSvg } from "./svg_components/AddSvg";
import { InstitutionSvg } from "./svg_components/InstitutionSvg";
import { ComponentSvg } from "./svg_components/ComponentSvg";
import { PatternSvg } from "./svg_components/PatternSvg";
import { EquipmentSvg } from "./svg_components/EquipmentSvg";
import { MethodSvg } from "./svg_components/MethodSvg";
import { TemperatureSvg } from "./svg_components/TemperatureSvg";
import { ConcentrationSvg } from "./svg_components/ConcentrationSvg";
import { DownloadCsvSvg } from "./svg_components/DownloadCsvSvg";
import { PrintSvg } from "./svg_components/PrintSvg";
import { SerumSvg } from "./svg_components/SerumSvg";
import { ConcentrationSerumSvg } from "./svg_components/ConcentrationSerumSvg";


let dataRows = {};
let actualRow = "";
let tempDataPlot = {}; 

export const Reproducibility = () => {
    const [days,setDays] = useState([]);
    const [dataPlot,setDataPlot] = useState([]);
    const [isCommercial,setIsCommercial] = useState(false);
    const [dataRowsComponent,setDataRowsComponent] = useState([]);
    
    const generateDays = (init,end,arrow) => {
        let objectDate = new Date();
        let actualDay = objectDate.getDate()
        let temp = [];
        for(let i = init;i <= end;i++){
            let classNameDay = "day-container";
            if(i === actualDay){
                classNameDay += " active-day";
            }
            temp.push(
                <div key={uuid()} className={ classNameDay }>
                    {i}
                </div>
            );
        }
        switch(arrow){
            case "forward":
                temp.push(
                    <div key={uuid()} className="steps-forward" onClick={handleStepsForward}>
                        <p>{'>'}</p>
                    </div>
                );      
                break;
            case "backward":
                temp.unshift(
                    <div key={uuid()} className="steps-backward" onClick={handleStepsBackward}>
                        <p>{'<'}</p>
                    </div>
                );
                break;
            default:
                break;
        }
        return temp;
    }
    
    const handleStepsBackward = () =>{
        setDays(generateDays(1,22,"forward"));
    }

    const handleStepsForward = (e) => {
        let objectDate = new Date();
        setDays(generateDays(22,new Date(objectDate.getFullYear(), objectDate.getMonth() + 1, 0).getDate(),"backward"));
    }
    if (!days.length) setDays(generateDays(1,22,"forward"))

    const handleChange = (e) => {
        let rowNumber = e.target.classList[2];
        dataRows[rowNumber][e.target.name] = e.target.value;
        let d1 = dataRows[rowNumber]['d1'];
        let d2 = dataRows[rowNumber]['d2'];
        let date = dataRows[rowNumber]['date'];
        if(d1 !== "" && d2 !== ""){
            document.querySelector(`input.${ rowNumber }.d1_d2`).value = parseInt(d1) - parseInt(d2);
        }
        if(date !== "" && d1 !== "" && d2 !== ""){
            let number = rowNumber.split("row")[1];
            tempDataPlot[number] = {"index":rowNumber.split("row")[1],"date":date,"|d1 - d2|":document.querySelector(`input.${ rowNumber }.d1_d2`).value};   
            document.querySelector(`.error${rowNumber.split("row")[1]}`).style.display = "none"
        }
        console.log(dataPlot)
    }
    const addRow = (e) => {e.stopPropagation()
        e.preventDefault()
        let rowNumber = Object.keys(dataRows).length;
        let prevRowNumber = rowNumber - 1;
        actualRow = `row${rowNumber}`;
        let insert = true;
        let id = uuid(); 
        let container = e.target.parentNode;

        if(prevRowNumber !== -1){
            // console.log(container.classList[2]);
            prevRowNumber = `row${prevRowNumber}`;
            let keysRow = Object.keys(dataRows[prevRowNumber]);
            for(let i = 0;i < keysRow.length;i++){
                if(dataRows[prevRowNumber][keysRow[i]] === ""){
                    insert = false;
                    document.querySelector(`.error${rowNumber - 1}`).style.display = "table-cell"
                    return;
                }
            };
            document.querySelector(`.error${rowNumber - 1}`).style.display = "none"
            container.firstElementChild.style.display = "none";
        }
        dataRows[actualRow] = 
            {
                "N":rowNumber + 1,
                "d1":"",
                "d2":"",
                "date":""
            };
        
        if(insert){
            setDataRowsComponent(prevDataRowsComponent => [
                ...prevDataRowsComponent,
                <InputRow key={id} id={id} rowNumber={rowNumber} plotData={plotData} handleChange={handleChange} addRow={addRow} deleteRow={deleteRow}/>
            ]);
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
        delete dataRows[rowKey];
        let index = rowKey.split("row")[1];
        
        let prevIndex = index-1;
        if(prevIndex >= 0){
            document.getElementsByClassName(`containerRow${prevIndex}`)[0].firstElementChild.style.display = "flex";
        }
        delete tempDataPlot[index];
        setDataPlot(Object.values(tempDataPlot));
            
        
    }


    const plotData = (e) => {
        console.log(tempDataPlot);
        setDataPlot(Object.values(tempDataPlot));
        console.log(dataPlot)
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
    
    const handleCommercialStatus = (e) => {
        setIsCommercial(!isCommercial);
    }

    return (
        <section className="TableContainer">
            <form className="side-form">
            <div className="ContInpPlaceholder">
                    <InstitutionSvg/>
                    <input className="extra-width blue-border left-alignment" name="institution" type="text" required/>
                    <label className="placeholder" htmlFor="institution">Institución</label>
                </div>
                <div className="ContInpPlaceholder">
                    <ComponentSvg/>
                    <input className="extra-width blue-border left-alignment" name="components" type="text" required/>
                    <label className="placeholder" htmlFor="component">Determinación</label>
                </div>
                <div className="ContInpPlaceholder">
                    <EquipmentSvg/>
                    <input className="extra-width blue-border left-alignment" name="equipment" type="text" required/>
                    <label className="placeholder" htmlFor="equipment">Equipo</label>
                </div>
                <div className="ContInpPlaceholder">
                    <PatternSvg/>
                    <input className="extra-width blue-border left-alignment" name="method" type="text" required/>
                    <label className="placeholder" htmlFor="method">Método analítico</label>
                </div>
                <div className="ContInpPlaceholder">
                    <MethodSvg/>
                    <input className="extra-width blue-border left-alignment" name="method" type="text" required/>
                    <label className="placeholder" htmlFor="method">Técnica analítica</label>
                </div>
                <div className="ContInpPlaceholder">
                    <ConcentrationSvg/>
                    <input className="extra-width blue-border left-alignment" name="concentration" type="text" required/>
                    <label className="placeholder" htmlFor="concentration">Concentración controlador</label>
                </div>
                <div className="ContInpPlaceholder">
                    <TemperatureSvg/>
                    <input className="extra-width blue-border left-alignment" name="temperature" type="text" required/>
                    <label className="placeholder" htmlFor="temperature">Temperatura</label>
                </div>
                <div className="ContInpPlaceholder">
                    <ConcentrationSerumSvg/>
                    <input className="extra-width blue-border left-alignment" name="pattern" type="text" required/>
                    <label className="placeholder" htmlFor="pattern">Controlador</label>
                </div>
                {isCommercial &&
                <div className="ContInpPlaceholder">
                    <SerumSvg/>
                    <input className="extra-width blue-border left-alignment" name="pattern" type="text" required/>
                    <label className="placeholder" htmlFor="pattern">Marca Comercial</label>
                </div>
                }
                <div className="ContInpCheckbox">
                    <input className="blue-border left-alignment" name="commercial_check" onClick={handleCommercialStatus} type="checkbox" required/>
                    <label className="placeholder" htmlFor="commercial_check">Es un suero comercial</label>
                </div>
                <input type="submit" className="extra-width blue-border" id="submitFormButton" value="Guardar"/>
                
            </form>
            <div className="flex-column">
                <div className="container-steps">
                        <div className="current-date">{new Date().toLocaleDateString("es-MX",{ weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>
                        <div className="days-steps">
                            {
                                days.map((data) => {
                                    return data
                                })
                            }
                        </div>
                </div>
                <table id="table-repeatability">
                    <thead>
                        <tr>
                            <td>
                                <div className="flex-container extra-gap no-margin">
                                    <div className="parent-svg">
                                        <DownloadCsvSvg/>
                                    </div>
                                    <div className="parent-svg">
                                        <PrintSvg/>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={6}>
                                <div className="flex-container search">
                                    <SearchSvg/>
                                    <input id="search" onInput={search} className="blue-border" placeholder="Buscar..."/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <div className="flex-container">
                                    <N/> N
                                </div>
                            </th>
                            <th>
                                <div className="flex-container">
                                    <DateSvg/>Fecha
                                </div>
                            </th>
                            <th>
                                <div className="flex-container">
                                    <D1D2/>
                                    <span>Valor
                                        <sub>(Xi)</sub>
                                    </span>
                                </div>
                            </th>
                            <th>
                                <div className="flex-container">
                                    <D1D2/>
                                    <span>
                                        <sub>(Xi-X)</sub>
                                    </span>
                                </div>
                            </th>
                            <th>
                                <div className="flex-container">
                                    <D1AndD2/>
                                    <span>(Xi-X)
                                        <sup>2</sup>
                                    </span>
                                </div>
                            </th>
                            <th></th>
                        </tr>
                        
                    </thead>
                    <tbody id="data-container" className="data-container">
                        {dataRowsComponent.length === 0 ? <tr>
                            <td colSpan={5} className="no-data-column">
                                <div className="flex-container no-margin-top">
                                    <p>No hay datos por el momento</p> <div onClick={addRow} className="update-data-icons add-row">
                                        <AddSvg/>
                                    </div>
                                </div>
                            </td>
                        </tr> :
                        dataRowsComponent.map((data) => {
                            return (
                                data
                            );
                        })
                        }
                    </tbody>
                </table>    
            </div>
            {Object.keys(dataPlot).length > 0 && <DemoLine data={dataPlot}/>}            
        </section>
    );
}