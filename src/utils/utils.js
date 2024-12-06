export const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
            return value;
        }
    }
    return null;
}



export const getDataFlow = (number) =>{
    return parseInt(number) > 0 ? "increase" : (parseInt(number) === 0 ? "constant" : "decrease")
}


export const getDataFlowColorClassName = (number,mode = "normal") =>{
switch(mode){
    case "normal":
        return parseInt(number) > 0 ? "increase-text" : (parseInt(number) === 0 ? "constant-text" : "decrease-text");
    default:
        return parseInt(number) < 0 ? "increase-text" : (parseInt(number) === 0 ? "constant-text" : "decrease-text");
}
}


export const handleResponse = async (response) => {
    try {
        let jsonData = await response.json();

        if(jsonData.code === 200){
            return jsonData.result;
        }else{
            console.group("Response warnings");
            console.warn(`Response status: ${response.status}`);
            console.warn(`Response code: ${response.code}`);
            console.warn(`Response message: ${response.message}`);
            console.groupEnd();
            return [];
        }   
    } catch (error) {
        console.error(`Fired from handleResponse: ${error}`);
        return [];
    }
} 