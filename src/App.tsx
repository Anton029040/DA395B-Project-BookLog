import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from "./components/layout/Header";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import TBRPage from "./pages/TBRPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import ReadPage from "./pages/ReadPage";


// The main application shell -> should NOT contain business logic
const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Navbar />

      <Routes>
        <Route path= "/"     element= {<HomePage />} />
        <Route path= "/tbr"  element= {<TBRPage />} />
        <Route path= "/read" element= {<ReadPage />} />
        <Route path="/books/:bookId" element= {<BookDetailsPage />} />
      </Routes>

    </BrowserRouter>
  );
};

export default App;
