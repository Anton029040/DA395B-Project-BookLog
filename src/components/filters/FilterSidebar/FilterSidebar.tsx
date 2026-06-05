import { Accordion, Button, Form } from "react-bootstrap";

import "./FilterSidebar.css";

/** 
 * Type definition for the props passed to the FilterSidebar component. 
 * It includes available authors and genres, current filter states, and functions to update those states.
 * 
 * This type definition ensures that the component receives the correct props and helps with type checking and autocompletion in TypeScript.
 */
type FilterSidebarReturn = {
    loadingBooks: boolean;                                              // GUI related message display for user info
    bookError: string;                                                  // GUI related message display for user info
    booksCount: number;                                                 // GUI related message display for user info

    availableAuthors: string[];                                         // all author names ie. ["J.R.R. Tolkien", "J.K. Rowling"]
    availableGenres: string[];                                          // all available genres

    // React.Dispatch = updates state, React.SetStateAction = allows both values and callback functions
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
};

/**
 * A React component that renders a sidebar with various filters for books, including author search, 
 * genre selection, rating selection, and publish year range.
 * The component uses Bootstrap's Accordion for collapsible filter sections and Form components for user input.
 * It also handles loading states and error messages for the author filter, as well as infinite scrolling for the author list.
 * 
 * @param {FilterSidebarReturn} props - The properties passed to the FilterSidebar component, including available authors and genres, current filter states, and functions to update those states.
 * @returns {JSX.Element} The rendered FilterSidebar component.
 * 
 * Note: This component is designed to be used within a larger application, such as a book listing page, where it interacts with the parent component (HomePage) to manage the state of the filters and update the displayed books accordingly.
 */
const FilterSidebar = ({
    // display messages:
    loadingBooks,
    bookError,
    booksCount,

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

}: FilterSidebarReturn) => {     // <- end of parameters & start of component

    return (
        <div className = "filter-sidebar"> {/* used for sidebars/secondary content */}
            <h2>Filters</h2>
            {loadingBooks && <p>Loading books...</p>}

            {!loadingBooks && bookError && ( <p role="alert">{bookError}</p> )}

            {!loadingBooks && !bookError && ( <p>{booksCount} books found.</p> )}

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
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <Form.Check
                                key = {rating}                                  
                                type = "checkbox" 
                                id = {`rating-${rating}`}                              
                                label = {"⭐".repeat(rating)}                                
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
                variant = "secondary"
                className = "mt-3"
                onClick = {clearFilters}
            >
                Clear filters
            </Button>
        </div>
    );
};
export default FilterSidebar;