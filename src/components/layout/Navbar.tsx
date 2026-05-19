import { NavLink } from "react-router-dom";
import "./Navbar.css";

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
            </nav>
        </div>
    );
};

export default Navbar;