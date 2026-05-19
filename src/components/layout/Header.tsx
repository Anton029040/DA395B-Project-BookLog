import SearchBar from "../ui/SearchBar";
import "./Header.css";

// This is for the page Header, it includes a logo and a searchfield
const Header = () => {
    return(
        <div className = "header">
            <div className = "inner-header">
                <div className="logo-block">
                    <img src="../../assets/book-logo.svg" className="logo"/>
                    <h1 className="title">Booklog</h1>
                </div>
                <div className="searchbar-wrapper">
                    <SearchBar></SearchBar>
                </div>
            </div>
        </div>
    );
};

export default Header;