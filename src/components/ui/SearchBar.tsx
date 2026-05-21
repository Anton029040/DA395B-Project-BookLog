import "./SearchBar.css"
import { useNavigate } from "react-router-dom";
import { useState } from "react";


/**
 * Component for a searchbar. The search bar includes a searchfield for typing and 
 * a button for submit. Can also sumbit via enter. The value of the searchfield is stored
 * in the URI for global access.
 */
const SearchBar = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    function handleSearch() {
        if (!query.trim()) {
            alert("THe searchfield is empty");
            return;
        }
        navigate(`?search=${encodeURIComponent(query)}`);
    }


    return (
        <div className = "input-group">
            <input 
                type="text" 
                className="form-control search-input" 
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key == "Enter") {
                        handleSearch();
                    }
                }}
            />

            {/* Button containing the search icon. Search icon fetched from Bootstrap Icons*/}
            <button 
                className="search-button"
                onClick={handleSearch}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="19" 
                    height="19" 
                    fill="currentColor" 
                    className="bi bi-search icon" 
                    viewBox="0 0 16 16"
                >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
            </button>
        </div>
    );
};

export default SearchBar;