import { v4 as uuid } from "uuid";
import "./resources/style-sheets/Alert.css";
import error from "./resources/images/error.svg"
import info from "./resources/images/info.svg"
import success from "./resources/images/success.svg"
import warning from "./resources/images/warning.svg"
import question from "./resources/images/question.svg"

export const Alert = {
    "icons": {
        "error" : error,
        "info" : info,
        "success" : success,
        "warning" : warning,
        "question" : question,
    },
    "ID":uuid(),
    close : () => {
        if(document.getElementById(`alert${Alert.ID}`)) {
            document.getElementById(`alert${Alert.ID}`).classList.remove("starting");
            setTimeout(() => {
                if(document.getElementById(`alert${Alert.ID}`)){
                    document.getElementById(`alert${Alert.ID}`).remove();
                }
            },700);
        }
    },
    fire: ({text, duration = 3000,type}) => {
        let elements = document.getElementsByTagName("body");
        
        const alertHtml = `
            <div id="alert${Alert.ID}" class="alert alert-${type}">
                <div class="alert-content-container">
                <img class="alert-icon alert-${type}" src='${Alert.icons[type]}' alt="${type}-alert-image">
                    ${text}
                </div>
                <div id="alert-progress-bar" class="alert-${type}"></div>
            </div>
        `

        function progressBarStart() {
            let timePassed = 0;
            let UpdateInterval = 10;
            var elem = document.getElementById("alert-progress-bar");
            
            
            function UpdateProgress() {
                timePassed += UpdateInterval;
                const progress = Math.floor((timePassed / duration) * 100);
        
                elem.style.width = progress + "%";
        
                if (timePassed < duration) {
                    setTimeout(UpdateProgress, UpdateInterval);
                } else {
                    //finish   
                    Alert.close();
                }
            }
        
            setTimeout(UpdateProgress, UpdateInterval);
        }
        

        if(elements != null){
            let body = elements[0];
            if(document.getElementById(`alert${Alert.ID}`) == null) 
                body.insertAdjacentHTML("beforeend",alertHtml);
            setTimeout(() => {
                document.getElementById(`alert${Alert.ID}`).classList.add("starting");
                progressBarStart();
            },5)

        }
    }
};
