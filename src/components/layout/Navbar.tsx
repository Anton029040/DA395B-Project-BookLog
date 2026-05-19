import { NavLink } from "react-router-dom";

const Navbar = () => {
    return(
        <nav>
            <NavLink to="/">
                Home
            </NavLink>

            <NavLink to="/tbr">
                TBR
            </NavLink>
        </nav>
    );
};

export default Navbar;