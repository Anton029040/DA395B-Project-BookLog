import { Accordion, Button, Form } from "react-bootstrap";

import "./FilterSidebar.css";

// ======== PROPS(properties) EXPECTED BY FilterSidebar ======== 
// -> FilterSidebar does not fetch books itself!
// -> displays author search results
// -> displays genre, rating, publish year filters
// -> calls toggle/set functions received from HomePage
/*  props = data passed from one React component to another
     think of it as "arguments to a function", beacuse react 
     components are functions and props are "arguments". */
// ============================================================= 
interface FilterSidebarProps{
    availableAuthors: string[];                                         // all author names ie. ["J.R.R. Tolkien", "J.K. Rowling"]
    availableGenres: string[];                                          // all available genres

    // React.Dispatch = updates state
    // React.SetStateAction = allows both values and callback functions
    authorSearch: string;                                               // current USER INPUT text in the author filter text field
    setAuthorSearch: React.Dispatch<React.SetStateAction<string>>;      // setting the author as the user input
    loadAuthors: boolean;                                               // loading state flag            
    authorError: string;                                                // error message for author filtering
    hasMoreAuthors: boolean;                                            // check for if there are more author pages
    handleAuthorScroll: (event: React.UIEvent<HTMLDivElement>) => void; // handles the author scroll list (populating)
    
    selectedAuthors: string[];                                          // currently selected authors
    selectedGenres: string[];                                           // currently selected genres
    selectedRating: number | undefined;                                 // currently selected rating
    selectedEarliestPublishYear: number | undefined;                    // currently selected minimum publish year
    selectedLatestPublishYear: number | undefined;                      // currently selected maximum publish year

    toggleAuthor: (author: string) => void;                             // add or remove an author to filter
    toggleGenre: (genre: string) => void;                               // add or remove a genre to filter
    
    setSelectedRating: React.Dispatch<React.SetStateAction<number | undefined>>;      // set rating filter
    setEarliestPublishYear: React.Dispatch<React.SetStateAction<number | undefined>>; // set earliest publish year filter
    setLatestPublishYear: React.Dispatch<React.SetStateAction<number | undefined>>;   // set latest publish year filter

    clearFilters: () => void;                                           // reset/clear ALL the filters to default
}

// =================== SIDEBAR COMPONENT FOR FILTERING BOOKS ===================
// -> Author input field ONLY updates authorSearch 
//      -> handled by useAvailableAuthors hook
//          -> uses search-author endpoint ONLY.
// -> checking/unchecking author checkbox calls toggleAuthor
//      -> updates selectedAuthors in HomePage
//          -> selectedAuthors are then sent to search-books endpoint as filters
// =============================================================================
const FilterSidebar = ({
    // parameters:
    availableAuthors,
    availableGenres,

    authorSearch,
    setAuthorSearch,
    loadAuthors,
    authorError,
    hasMoreAuthors,
    handleAuthorScroll,
    
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

    return (
        <div className = "filter-sidebar">                          {/* used for sidebars/secondary content */}
            <h2>Filters</h2>
            <Accordion alwaysOpen>                                  {/* bootstrap accordian, allows multiple sections to be open simultaneously */}

                {/* ============= Authors ============= */}
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Authors</Accordion.Header>    {/* clickable accordian title (expand/collapse) */}
                    <Accordion.Body>                                {/* content inside the accordian */}

                        {/* user input field: text box */}
                        <Form.Control
                            type = "text"
                            placeholder = "Search authors..."
                            value = {authorSearch}
                            onChange = {(event) => setAuthorSearch(event.target.value)}
                            className = "mb-3"
                        />

                        {loadAuthors && (<p>Loading authors...</p>)}

                        {!loadAuthors && authorError && (<p role = "alert" >{authorError}</p>)}

                        {/* alphabetical list of authors with checkboxes */}
                        <div 
                            className = "author-filter-list" 
                            onScroll = {handleAuthorScroll}
                        >                                
                            {availableAuthors.map((author) => (                     
                                <Form.Check                                         
                                    key = {author}                                  
                                    type = "checkbox" 
                                    id = {`author-${author}`}                              
                                    label = {author}                                
                                    checked = {selectedAuthors.includes(author)}   
                                    onChange = {() => toggleAuthor(author)}        
                                />
                            ))}

                            {!loadAuthors && !authorError && availableAuthors.length === 0 && (
                                <p>No authors to display.</p>
                            )}

                            {!loadAuthors && hasMoreAuthors && authorSearch.trim() === "" && (
                                <p>Scroll to load more authors...</p>
                            )}
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                
                {/* ============= Genres ============= */}
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Genres</Accordion.Header>
                    <Accordion.Body>
                        <div className = "genre-filter-list">
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
                        </div>
                    </Accordion.Body>
                </Accordion.Item>

                {/* ============= Rating ============= */}
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

                {/* ============= Publish year ============= */}
                <Accordion.Item eventKey = "3">
                    <Accordion.Header>Publish Year</Accordion.Header>
                    <Accordion.Body>

                        <Form.Group>
                            <Form.Label>From:</Form.Label>
                            <Form.Control                                 
                                type = "number" 
                                placeholder = "ex. 1882"
                                value = {selectedEarliestPublishYear ?? ""}  
                                onChange = {(event) => setEarliestPublishYear(
                                    event.target.value === "" ? undefined : Number(event.target.value))
                                } 
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>To:</Form.Label>
                            <Form.Control                                 
                                type = "number" 
                                placeholder = "ex. 2026"
                                value = {selectedLatestPublishYear ?? ""}  
                                onChange = {(event) => setLatestPublishYear(
                                    event.target.value === "" ? undefined : Number(event.target.value))
                                } 
                            />
                        </Form.Group>
                    </Accordion.Body>
                </Accordion.Item>

            </Accordion>

            <Button
                type = "button"
                varian = "secondary"
                className = "mt-3"
                onClick = {clearFilters}
            >
                Clear filters
            </Button>
        </div>
    );
};

export default FilterSidebar;