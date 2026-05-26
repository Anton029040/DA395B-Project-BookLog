// This is the page connected to the endpoint "/"
import { useEffect} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchBooks } from "../api/bigBookApi";

const HomePage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    

    useEffect(() => {
        if(query) {
            console.log(query + " This is query");
            searchBooks({query}).then((result) => {
                console.log(result)
            })
        }
    }, [query]);

    return(
        <main>
            <p>You are in Home page</p>
        </main>
    );
};

export default HomePage;