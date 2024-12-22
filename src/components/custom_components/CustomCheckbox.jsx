import { useRef } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const CustomCheckbox = ({ checked,handleCheckbox,identifier,name,isMasterCheck = false }) => {
    let masterCheck = useRef(undefined);
    const dispatch = useDispatch();

    useEffect(() => {
        if(checked)
            masterCheck.current.checked = checked
    },[checked])

    return(
        <input ref={masterCheck} type="checkbox" onChange={handleCheckbox} name={name} className={`${isMasterCheck ? "custom-master-checkbox" : "custom-normal-checkbox"} custom-checkbox ${ identifier } ${ name }`} />
    );
}