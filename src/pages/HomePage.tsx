// This is the page connected to the endpoint "/"
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchBooks } from "../api/bigBookApi";

const HomePage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("search");

    useEffect(() => {
        if(query) {
            searchBooks(query).then((result) => {
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