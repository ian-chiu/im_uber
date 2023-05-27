import "./style.css";

import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Spinner from "~/common/components/Spinner";

import Home from './pages/Home';
import Auth from './pages/Auth';
import Map from "./pages/Map";
import CreateRide from "./pages/CreateRide";
import Header from "./common/components/Header";
import { useSelector } from 'react-redux';

function App() {
  const isAuth = useSelector(state => state.auth.isAuthenticated)
	const [isLoading, setIsLoading] = useState(false)
  return (
    <>
    {isAuth ? 
      <>
        <Header/>
        <Routes>
          <Route path='*' element={<Home />} />
          <Route path="ride/:id" element={<Map />} />
          <Route path="create-ride" element={<CreateRide />} />
        </Routes>
      </>
      : 
      <Auth />
    }
    <ToastContainer />
    <Spinner isLoading={isLoading} message={"loading"}/>
    </>
  );
}

export default App;
