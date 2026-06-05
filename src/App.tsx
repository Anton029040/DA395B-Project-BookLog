import { BrowserRouter, Routes, Route} from 'react-router-dom';

import Header from "./components/layout/Header/Header";
import Navbar from "./components/layout/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import TBRPage from "./pages/TBRPage/TBRPage";
import BookDetailsPage from "./pages/BookDetailsPage/BookDetailsPage";
import ReadPage from "./pages/ReadPage/ReadPage";

import './index.css'

// The main application shell -> should NOT contain business logic
const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Navbar />

      <Routes>
        <Route path= "/"              element= {<HomePage />} />
        <Route path= "/tbr"           element= {<TBRPage />} />
        <Route path= "/read"          element= {<ReadPage />} />
        <Route path="/books/:bookId"  element= {<BookDetailsPage />} />
      </Routes>

    </BrowserRouter>
  );
};

export default App;
