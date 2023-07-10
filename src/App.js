import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import TicketBuy from './components/TicketBuy';
import Search from './components/Search';
import Navbar from './components/Navbar';
import { Footer } from './components/Footer';
import Favorite from './components/Favorite';
import MyCreate from './components/MyCreate';


const App = () => {
  return (
    <div>      
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />        
        <Route path="/event/:searchItem" element={<Search />} />        
        <Route path="/ticket/:eventID" element={<TicketBuy />} />
        <Route path="/takip/" element={<Favorite />} />
        <Route path="/kayıt/" element={<MyCreate/>} />
      </Routes>      
      <Footer/>
    </div>
  );
};

export default App;