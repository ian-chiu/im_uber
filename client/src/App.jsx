import "./style.css";

import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Spinner from "~/common/components/Spinner";

import Home from './pages/Home';
import Auth from './pages/Auth';
import Map from "./pages/Map";
import CreateRide from "./pages/Map/CreateRide";
import { useSelector } from 'react-redux';

function App() {
  const isAuth = useSelector(state => state.auth.isAuthenticated)
	const [isLoading, setIsLoading] = useState(false)
  return (
    <>
    <Routes>
      <Route path="/driver/*" element={isAuth ? 
        <Routes>
          <Route path='*' element={<Home driver={true}/>}/>
          <Route path="ride/:id" element={<Map />} />
          <Route path="/create-ride" element={<CreateRide/>} />
        </Routes>
        : 
        <Auth driver={true}/>
      }/>
      <Route path="*" element={isAuth ? 
        <Routes>
          <Route path='*' element={<Home />} />
          <Route path="ride/:id" element={<Map />} />
        </Routes>
        :
        <Auth/>
      }/>
    </Routes>
    <ToastContainer />
    <Spinner isLoading={isLoading} message={"loading"}/>
    </>
  );
}

export default App;
