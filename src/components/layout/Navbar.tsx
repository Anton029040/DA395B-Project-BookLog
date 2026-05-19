import { NavLink } from "react-router-dom";

// this is for the navigation bar ( our 3 tabs that navigate to new endpoints )
const Navbar = () => {
    return(
        <nav>
            <NavLink to="/">
                Home
            </NavLink>

            <NavLink to="/tbr">
                TBR
            </NavLink>

            {/* other links need to be added, this is for testing purposes - Natalie */}
        </nav>
    );
};

export default Navbar;