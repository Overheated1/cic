export const CustomLabel = ({ name,value }) => {

    return(
        <label  name={name} className={`full-width blue-border custom-label ${ name }`}>
            {value}
        </label>
    );
}