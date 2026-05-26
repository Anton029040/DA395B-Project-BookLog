import { Accordion, Button, Form } from "react-bootstrap";

import { useAuthorFilter } from "/src/hooks/useAuthorFilter";
import "./FilterSidebar.css";


/*  Defining the shape and types of ALL the props received by this component:
    - this helps typescript understand what data and functions are passed in.

    props = property : data passed from one React component to another, think of it as
    "arguments to a function", beacuse react components are functions and props are "arguments". */
interface FilterSidebarProps{
    // lists of items to populate the filter component with:
    availableAuthors: string[];                     // all author names ie. ["J.R.R. Tolkien", "J.K. Rowling"]
    availableGenres: string[];                      // all available genres
    
    // lists of the user's currently selected filters:
    selectedAuthors: string[];                              // currently selected authors
    selectedGenres: string[];                               // currently selected genres
    selectedRating: number | undefined;                     // currently selected rating
    selectedEarliestPublishYear: number | undefined;        // currently selected minimum publish year
    selectedLatestPublishYear: number | undefined;          // currently selected maximum publish year

    // functions for the user to toggle(add/remove) filters to their search: 
    toggleAuthor: (author: string) => void;         // add or remove an author
    toggleGenre: (genre: string) => void;           // add or remove a genre

    /* setting states for the user to toggle(add/remove) filters to their search
       -> similar to the functions, except that they are not a list, they are a boolean flag.
       
       - React.Dispatch = updates state
       - React.SetStateAction = allows both values and callback functions */
    setSelectedRating: React.Dispatch<React.SetStateAction<number | undefined>>;      // ratings
    setEarliestPublishYear: React.Dispatch<React.SetStateAction<number | undefined>>; // earliest publish year
    setLatestPublishYear: React.Dispatch<React.SetStateAction<number | undefined>>;   // latest publish year

    // reset/clear ALL the filters to default:
    clearFilters: () => void;
}

    /* Destructuring ALL of the props in the parameters 
        -> avoids repeatedly writing "props.availableAuthors" in the component. */
    const FilterSidebar = ({
        // parameters:
        availableAuthors,
        availableGenres,

        selectedAuthors,
        selectedGenres,
        selectedRating,
        selectedEarliestPublishYear,
        selectedLatestPublishYear,

        toggleAuthor,
        toggleGenre,
        setSelectedRating,
        setEarliestPublishYear,
        setLatestPublishYear,
        clearFilters,

    }: FilterSidebarProps) => {     // <- end of parameters & start of component
        const {
            authorSearch,
            visibleAuthors,
            totalFilteredAuthors,
            updateAuthorSearch,
            handleScroll,
        } = useAuthorFilter({
            availableAuthors,
            selectedAuthors,
        });

        const ratings = [1, 2, 3, 4, 5];


        return (
            <div className = "filter-sidebar"> {/* used for sidebars/secondary content */}
                <h2>Filters</h2>
                <Accordion alwaysOpen> {/* bootstrap accordian, allows multiple sections to be open simultaneously */}

                    {/* =====================================
                                Authors filter section
                        ===================================== */}
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Authors</Accordion.Header> {/* clickable accordian title (expand/collapse) */}

                        <Accordion.Body> {/* content inside the accordian */}

                            {/* user input field: text box */}
                            <Form.Control
                                type = "text"
                                placeholder = "Search authors..."
                                value = {authorSearch}
                                onChange = {(event) => updateAuthorSearch(event.target.value)}
                                className = "mb-3"
                            />
                            
                            {/* alphabetical list of authors with checkboxes */}
                            <div 
                                className = "author-filter-list"
                                onScroll = {handleScroll}
                            >                                
                                {visibleAuthors.map((author) => (                     
                                    <Form.Check                                         
                                        key = {author}                                  
                                        type = "checkbox" 
                                        id = {`author-${author}`}                              
                                        label = {author}                                
                                        checked = {selectedAuthors.includes(author)}   
                                        onChange = {() => toggleAuthor(author)}        
                                    />
                                ))}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    
                    {/* =====================================
                                Genre filter section
                        ===================================== */}
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Genres</Accordion.Header>
                        <Accordion.Body>
                            {availableGenres.map((genre) => (
                                <Form.Check
                                    key = {genre}                                  
                                    type = "checkbox" 
                                    id = {`genre-${genre}`}                              
                                    label = {genre}                                
                                    checked = {selectedGenres.includes(genre)}   
                                    onChange = {() => toggleGenre(genre)} 
                                />
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>

                    {/* =====================================
                                Ratings filter section
                        ===================================== */}
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Minimum Rating</Accordion.Header>
                        <Accordion.Body>
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <Form.Check
                                    key = {rating}                                  
                                    type = "checkbox" 
                                    id = {`rating-${rating}`}                              
                                    label = {`${rating} star${rating > 1 ? "s" : ""}`}                                
                                    checked = {selectedRating === rating}   
                                    onChange = {() => setSelectedRating(
                                        selectedRating === rating ? undefined : rating)
                                    } 
                                />
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>

                    {/* =====================================
                          Publish Year Range filter section
                        ===================================== */}
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>Publish Year</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group>
                                <Form.Label>
                                    From:
                                </Form.Label>

                                <Form.Control                                 
                                    type = "number" 
                                    placeholder = "Earliest year (ex. 1882)"
                                    value = {selectedEarliestPublishYear ?? ""}  
                                    onChange = {(event) => setEarliestPublishYear(
                                        event.target.value === "" ? undefined : Number(event.target.value))
                                    } 
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>
                                    To:
                                </Form.Label>

                                <Form.Control                                 
                                    type = "number" 
                                    placeholder = "Latest year (ex. 1956)"
                                    value = {selectedLatestPublishYear ?? ""}  
                                    onChange = {(event) => setLatestPublishYear(
                                        event.target.value === "" ? undefined : Number(event.target.value))
                                    } 
                                />
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>

                </Accordion>
            </div>
        );
    };
    
    export default FilterSidebar;
