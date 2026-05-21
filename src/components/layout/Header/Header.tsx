import SearchBar from "../../ui/SearchBar/SearchBar";
import siteLogo from "../../../assets/images/book-logo.svg"; // needs to be imported otherwise the filepath doesn't work
import "./Header.css";

/**
 * Component for the header. Includes both a log and a Searchbar
 */
const Header = () => {
    return(
        <div className = "header">
            <div className = "inner-header">
                {/* Div that holds the elements for the logo*/}
                <div className="logo-block">
                    <img src={siteLogo} className="logo"/>
                    <h1 className="title">Booklog</h1>
                </div>

                {/* Div that holds the searchbar*/}
                <div className="searchbar-wrapper">
                    <SearchBar></SearchBar>
                </div>
            </div>
        </div>
    );
};

export default Header;