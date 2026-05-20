// This is the page connected to the endpoint "/tbr"
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const TBRPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("search");

    useEffect(() => {
        if(query) {
            console.log(query);
            // todo Search for books that is in TBR list
        }
    }, [query])

    return(
        <main>
            <p>You are in tbr page</p>
        </main>
    );
};

export default TBRPage;