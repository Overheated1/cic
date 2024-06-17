
import { About1Svg } from "../svg_components/About1Svg";
import { AddSvg } from "../svg_components/AddSvg";
import { TrashSvg } from "../svg_components/TrashSvg";
import { InputColumn } from "./InputColumn";
export const InputRow = ({ id,rowNumber,addRow,deleteRow,plotData,handleChange }) => {
    return (
        <>
        <tr id={id}>
            <InputColumn handleChange={handleChange} rowNumber={rowNumber} name="N"/>
            <InputColumn handleChange={handleChange} rowNumber={rowNumber} name="date"/>
            <InputColumn handleChange={handleChange} rowNumber={rowNumber} name="d1"/>
            <InputColumn handleChange={handleChange} rowNumber={rowNumber} name="d2"/>
            <InputColumn handleChange={handleChange} rowNumber={rowNumber} name="d1_d2"/>
            <td className={`row${rowNumber}`}>
                <div className={`flex-container left-alignment containerRow${rowNumber}`}>
                <div onClick={plotData} className="update-data-icons plot-data">
                        <About1Svg/>
                    </div>
                    <div onClick={addRow} className="update-data-icons add-row">
                        <AddSvg/>
                    </div>
                    <div onClick={deleteRow} className="update-data-icons delete-row">
                        <TrashSvg/>
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <td className={`error error${rowNumber}`} colSpan={6}>No puede haber ninguna entrada vacía</td>
        </tr>
        </>
    );
}