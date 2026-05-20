import { NavLink } from "react-router-dom";
import "./Navbar.css";

/**
 * Component for the navbar. Includes links to the different pages
 */
const Navbar = () => {
    return(
        <div className = "navbar">
            <nav className = "links">
                <NavLink to="/">
                    Home
                </NavLink>

                <NavLink to="/tbr">
                    TBR
                </NavLink>

                <NavLink to="/read">
                    Read
                </NavLink>
            </nav>
        </div>
    );
};

export default Navbar;