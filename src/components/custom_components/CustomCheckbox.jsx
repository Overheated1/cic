import { useRef } from "react";
import { useEffect } from "react";

export const CustomCheckbox = ({ checked,handleCheckbox,identifier,name,isMasterCheck = false }) => {
    let masterCheck = useRef(undefined);

    const handleCheckFunc = (e) => {
        if(isMasterCheck) handleCheckbox(e);
        else handleCheckbox("update",identifier.split(" ")[0],e);    
    }

    useEffect(() => {
        if(checked)
            masterCheck.current.checked = checked
    },[checked])
    return(
        <input ref={masterCheck} type="checkbox" onChange={handleCheckFunc} name={name} className={`${isMasterCheck ? "custom-master-checkbox" : "custom-normal-checkbox"} custom-checkbox ${ identifier } ${ name }`} />
    );
}