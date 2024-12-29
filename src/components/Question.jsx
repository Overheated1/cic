import { useState } from "react";
import { CustomArrowSvgComponent } from "./custom_components/custom_select_component/CustomArrowSvgComponent"

const Question = ({title,paragraphToShow}) => {
    const [needRotate,setNeedRotate] = useState(false);

    const handleHideDropdown = (e) => {
        if(!e.target.classList.contains("content-to-show")) setNeedRotate(!needRotate);
    }
    return(
        <div onClick={handleHideDropdown} className={`dropdown-content-container title="${ title }" ${needRotate ? 'container-question-show' : ''}`}>
            <div className="content-question">
                <div className="question-container">{ title }</div>
                <div className="arrow-container">
                    <CustomArrowSvgComponent needRotate={needRotate}/>
                </div>
            </div>
            <div className={`grid-container-question ${needRotate ? 'grid-container-question-show' : ''}`}>
                <span className='content-to-show' dangerouslySetInnerHTML={{ __html: paragraphToShow }}></span>
            </div>
        </div>
        
    )
}
export default Question;