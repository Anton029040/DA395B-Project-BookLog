import SearchBar from "../ui/SearchBar";
import "./Header.css";

const Header = () => {
    return(
        <div className = "header">
            <div className = "inner-header">
                {/* Div that holds the elements for the logo*/}
                <div className="logo-block">
                    <img src="../../assets/book-logo.svg" className="logo"/>
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