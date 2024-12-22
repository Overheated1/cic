import { useContext } from "react";
import { ApiContext } from "./ApiContext";
import search_svg from "../resources/svg/search.svg";
import { SearchSvg } from "./svg_components/SearchSvg";

const SearchBar = ({title,matchedQuestions,setMatchedQuestions}) => {
    const { QUESTIONS } = useContext(ApiContext);

    const handleSearchBarInput = (e) => {
        let questionKeys = Object.keys(QUESTIONS);
        let temp = matchedQuestions ? matchedQuestions : [];
        let temp1 = [];

        if(e.target.value == "") {
            setMatchedQuestions([]);
            return;
        }
        
        for(let i =0;i < questionKeys.length;i++){

            if(questionKeys[i].toLocaleLowerCase().includes(e.target.value.toLowerCase()) && !temp.hasOwnProperty(questionKeys[i])){
                temp[questionKeys[i]] = QUESTIONS[questionKeys[i]];
                temp1.push({
                    "question" : questionKeys[i],
                    "answer" : QUESTIONS[questionKeys[i]]
                })
            }
        }

        setMatchedQuestions(temp1)
    }

    return (
        <div className="self-center-align no-padding search-bar-container huge-percent-margin-top full-width section-content">
            {
            title ?
            <span className='main-title'>
                { title }
            </span> : ''
            }
            <div className="search-bar-main-body">
                <input type="text" onChange={ handleSearchBarInput } className="search-bar no-padding" />
                <div className="search-bar-icon">
                    <SearchSvg/>
                </div>
            </div>
        </div>
    );
}

export default SearchBar;