export const CustomLabel = ({ identifier,name,value }) => {

    return(
        <label  name={name} className={`full-width blue-border medium-height custom-label ${ identifier } ${ name }`}>
            {value}
        </label>
    );
}