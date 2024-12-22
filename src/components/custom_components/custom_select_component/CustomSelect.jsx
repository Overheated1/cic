import { useEffect, useRef, useState } from "react";
import { CustomArrowSvgComponent } from "./CustomArrowSvgComponent";
import "./resources/style-sheets/CustomSelect.css";
import { v4 as uuid } from "uuid"

export const CustomSelect = ({ customClassName,onChange,identifier,name,selectedValue,placeholder,noOPtions,noResults,searchable,data,placeholderSearchBar }) => {
    const[dropdownVisible,setDropdownVisible] = useState(false);
    const ID = uuid();
    const placeholderRef = useRef(null);
    const customSelectMainRef = useRef(null);
    const noResultsRef = useRef(null);
    const customSelectDropdownRef = useRef(null);
    var selectedValueText = "";
    var classes = "";


    if(customClassName){
        if(typeof(customClassName) == "object" && customClassName?.length){
            for(let i = 0;i < customClassName.length;i++){
                classes += customClassName[i] + " ";
            }
        }
        if(typeof(customClassName) == "string"){
                classes += customClassName;
        }
    } 

    const setAllOptionsVisible = () => {
        let options = document.getElementsByClassName("custom-select-dropdown-option");

        for(let i = 0;i < options.length;i++){
            if(!options[i].classList.contains("no-results"))
                options[i].style.display = "block";
        }
    }
    
    const handleSearch = (e) =>  {
        let value = e.target.value;
        let options = document.getElementsByClassName("custom-select-dropdown-option");

        let hiddenElements = 0;
        let visibleElements = 0;
        for(let i =0;i < options.length;i++){
            if(options[i].innerText.toLowerCase().includes(value.toLowerCase())){
                options[i].style.display = "flex";
                visibleElements++;
            }else{
                options[i].style.display = "none";
                hiddenElements++;
            }
        }

        //RECALCULATE THE MIN HEIGHT
        customSelectDropdownRef.current.style.minHeight=visibleElements > 6 ? "15em" : visibleElements + "em";

        if(hiddenElements === options.length && noResultsRef.current)
            noResultsRef.current.style.display = "flex";
        else if(noResultsRef.current)
            noResultsRef.current.style.display = "none";    
        
    }
    const handleOptionClick = (e) => {
        let value = e.target.innerText;
        let optionEventCopy = e;
        let placeholderElement = placeholderRef.current;
        
        if(placeholderElement.innerText === value){
            placeholderElement.innerText = placeholder; 
            placeholderElement.value = placeholder;
            optionEventCopy.target.value = " ";
        }else{
            placeholderElement.innerText = value;
            placeholderElement.value = value;
        }

        setDropdownVisible(!dropdownVisible);
        setAllOptionsVisible();

        if(onChange)
            onChange(optionEventCopy);
    }

    const handleDropdownVisibility = () => {
        setDropdownVisible(!dropdownVisible)
        
        let search_bar = document.getElementById(`search-bar${ID}`);
        if(search_bar)
            search_bar.value= "";

        if(!dropdownVisible && document.querySelector(`#no-results${ID}`)) document.querySelector(`#no-results${ID}`).style.display = "none";
        
        let custom_select_header = customSelectMainRef.current;
        let custom_select_dropdown = customSelectDropdownRef.current;
        
        if(custom_select_header && custom_select_dropdown)
            custom_select_dropdown.style.width = (custom_select_header.getBoundingClientRect().width) + "px";

        //need optimize with the scroll listener
        if(custom_select_header.getBoundingClientRect().y < 750 && custom_select_header.getBoundingClientRect().y > 400){
            custom_select_dropdown.style.flexDirection = "column-reverse";
            custom_select_dropdown.style.transform = "translateY(-130%)";
        }else{
            custom_select_dropdown.style.flexDirection = "column";
            custom_select_dropdown.style.transform = "translateY(0)";
        }

        //RECALCULATE THE MIN HEIGHT
        customSelectDropdownRef.current.style.minHeight=Object.keys(data).length > 6 ? "15vw" : Object.keys(data).length + "vw";
    }
    document.addEventListener("scroll",(e) => {

        let custom_select_header = customSelectMainRef.current;
        let custom_select_dropdown = customSelectDropdownRef.current;

        if(custom_select_header && custom_select_dropdown){
            if(custom_select_header.getBoundingClientRect().y < 750 && custom_select_header.getBoundingClientRect().y > 400){
                custom_select_dropdown.style.flexDirection = "column-reverse";
                custom_select_dropdown.style.transform = "translateY(-130%)";
            }else{
                custom_select_dropdown.style.flexDirection = "column";
                custom_select_dropdown.style.transform = "translateY(0)";
            }
        }
    })

    useEffect(() => {
        if(selectedValueText !== "" && selectedValueText !== undefined)
            placeholderRef.current.innerText = selectedValueText;

    },[selectedValueText])
    
    return(
        <div className={`custom-select-container ${classes}`}>
            <div name={name} ref={ customSelectMainRef } id={`custom-select${ID}`} onClick={handleDropdownVisibility} className={`small-width custom-select ${ identifier !== undefined ? identifier : "" } ${ name !== undefined ? name : "" }`}>
                <div className="custom-select-flex-header-content" >
                    <span ref={ placeholderRef } className="custom-select-placeholder" id={`custom-select-placeholder${ID}`} value={placeholder}>{placeholder}</span>
                    <CustomArrowSvgComponent needRotate={dropdownVisible}/>
                </div>
            </div>
            <ul id={`custom-select-dropdown${ID}`} ref={ customSelectDropdownRef } className={`custom-select-dropdown-content ${dropdownVisible ? "dropdown-visible" : ""}`}>
                {
                searchable &&
                <li className="custom-select-search-bar-container">
                    <input onInput={handleSearch} className="search-bar" id={`search-bar${ID}`} type="text" placeholder={placeholderSearchBar}/>
                </li>
                }
                {data.length > 0 ? 
                <div className="dropdown-content-overflow">
                    {
                    data.map((d) => {
                        if(d.value === selectedValue)
                            selectedValueText = d.text;

                    return (
                        <li name={name} key={uuid()} value={d.value} className="custom-select-dropdown-option" onClick={handleOptionClick}>
                            {d.text}
                        </li>
                        )
                    })
                    }
                    <li id={`no-results${ID}`} ref={ noResultsRef } className="custom-select-dropdown-option no-results">{noResults}</li>
                </div> :
                <li className="custom-select-dropdown-option no-options">{noOPtions}</li>
                }
            </ul>
        </div>
    );
}