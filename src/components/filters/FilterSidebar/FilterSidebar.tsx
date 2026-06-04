import { Accordion, Button, Form } from "react-bootstrap";

import "./FilterSidebar.css";

/** 
 * Props for the FilterSidebar component.
 * This interface defines the expected properties that the FilterSidebar component will receive from its parent component (HomePage).
 * It includes data for available authors and genres, the current state of the filters, and functions to update those states.
 * The FilterSidebar component uses these props to render the filter options and handle user interactions for filtering books based on 
 * authors, genres, ratings, and publish years.
 * 
 * @interface FilterSidebarProps
 * @property {string[]} availableAuthors - An array of all author names available for filtering.
 * @property {string[]} availableGenres - An array of all available genres for filtering.
 * 
 * @property {string} authorSearch - The current user input text in the author filter text field.
 * @property {React.Dispatch<React.SetStateAction<string>>} setAuthorSearch - A function to update the authorSearch state based on user input.
 * @property {boolean} loadAuthors - A flag indicating whether the authors are currently being loaded (used for displaying loading state).
 * @property {string} authorError - An error message for author filtering, displayed if there is an issue loading authors.
 * @property {boolean} hasMoreAuthors - A flag to check if there are more author pages available for loading (used for infinite scrolling).
 * @property {(event: React.UIEvent<HTMLDivElement>) => void} handleAuthorScroll - A function to handle the scroll event for the author list, 
 *           used to load more authors when scrolling.
 * 
 * @property {string[]} selectedAuthors - An array of currently selected authors for filtering.
 * @property {string[]} selectedGenres - An array of currently selected genres for filtering.
 * 
 * @property {number | undefined} selectedRating - The currently selected minimum rating for filtering (undefined if no rating is selected).
 * @property {number | undefined} selectedEarliestPublishYear - The currently selected minimum publish year for filtering (undefined if no year is selected).
 * @property {number | undefined} selectedLatestPublishYear - The currently selected maximum publish year for filtering (undefined if no year is selected).
 * 
 * @property {(author: string) => void} toggleAuthor - A function to add or remove an author from the selectedAuthors array when a user 
 *           checks/unchecks an author checkbox.
 * @property {(genre: string) => void} toggleGenre - A function to add or remove a genre from the selectedGenres array when a user 
 *           checks/unchecks a genre checkbox.
 * 
 * @property {React.Dispatch<React.SetStateAction<number | undefined>>} setSelectedRating - A function to set the selected minimum rating for filtering.
 * @property {React.Dispatch<React.SetStateAction<number | undefined>>} setEarliestPublishYear - A function to set the selected minimum publish year 
 *           for filtering.
 * @property {React.Dispatch<React.SetStateAction<number | undefined>>} setLatestPublishYear - A function to set the selected maximum publish year 
 *           for filtering.
 * @property {() => void} clearFilters - A function to reset/clear all the filters to their default state.
 */
interface FilterSidebarProps{
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
}

// =================== SIDEBAR COMPONENT FOR FILTERING BOOKS ===================
// -> Author input field ONLY updates authorSearch 
//      -> handled by useAvailableAuthors hook
//          -> uses search-author endpoint ONLY.
// -> checking/unchecking author checkbox calls toggleAuthor
//      -> updates selectedAuthors in HomePage
//          -> selectedAuthors are then sent to search-books endpoint as filters
// =============================================================================

/**
 * A React component that renders a sidebar with various filters for books, including author search, 
 * genre selection, rating selection, and publish year range.
 * The component uses Bootstrap's Accordion for collapsible filter sections and Form components for user input.
 * It also handles loading states and error messages for the author filter, as well as infinite scrolling for the author list.
 * 
 * @param props - The properties passed to the FilterSidebar component, including available authors and genres, current filter states, 
 *          and functions to update those states.
 * @returns {JSX.Element} - The rendered FilterSidebar component with all the filter options and functionality.
 */
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
        <div className = "filter-sidebar"> {/* used for sidebars/secondary content */}
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