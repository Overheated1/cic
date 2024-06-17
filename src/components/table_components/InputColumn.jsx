export const InputColumn = ({ rowNumber,name,handleChange }) => {
    let readonly = name==="N" || name === "d1_d2" ? true : false;
    let value = name==="N" ? rowNumber + 1: undefined;
    return(
    <td>
        <input value={value} readOnly={readonly} name={name} className={`blue-border input-row row${ rowNumber } ${ name }`} onChange={handleChange}/>
    </td>
    );
}