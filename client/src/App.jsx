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
  const role = useSelector(state => state.auth.role)
	const [isLoading, setIsLoading] = useState(false)
  return (
    <>
    {isAuth ? 
    <Routes>
      {role == "driver" ? 
        <>
          <Route path='*' element={<Home driver={true}/>}/>
          <Route path="driver/ride/:id" element={<Map />} />
          <Route path="driver/create-ride" element={<CreateRide/>} />
        </>
      :
          <>
            <Route path='*' element={<Home />} />
            <Route path="ride/:id" element={<Map />} />
          </>
      }
    </Routes>
    :
    <Auth/>
    }
    <ToastContainer />
    <Spinner isLoading={isLoading} message={"loading"}/>
    </>
  );
}

export default App;
