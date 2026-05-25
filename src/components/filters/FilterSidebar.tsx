import { Accordion, Button, Form } from "react-bootstrap";

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
        // ratings array for checkbox inputs using .map()
        const ratings = [1, 2, 3, 4, 5];

        return (
            <aside>                                     {/* used for sidebars/secondary content */}
                <h2>Search Filters</h2>
                <Accordion alwaysOpen>        {/* bootstrap accordian, allows multiple sections to be open simultaneously */}

                    {/* =====================================
                                Authors filter section
                        ===================================== */}
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Authors</Accordion.Header>
                        <Accordion.Body>
                            {availableAuthors.map((author) => (
                                <Form.Check
                                    key = {author}
                                    type = "checkbox"
                                    label = {author}
                                    checked = {selectedAuthors.includes(author)}
                                    onChange = {() => toggleAuthor(author)}
                                />
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Accordion Item #2</Accordion.Header>
                        <Accordion.Body>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                        </Accordion.Body>
                    </Accordion.Item>

                </Accordion>
            </aside>
        );
    };
    
    export default FilterSidebar;
