import "./style.css";

import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Spinner from "~/common/components/Spinner";
import { getUserData } from "./pages/Auth/authSlice";
import Home from './pages/Home';
import Auth from './pages/Auth';
import Map from "./pages/Map";
import CreateRide from "./pages/Map/CreateRide";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import handleError from '~/utils/error';

function App() {
  const dispatch = useDispatch()
  const isAuth = useSelector(state => state.auth.isAuthenticated)
  const role = useSelector(state => state.auth.role)
  useEffect(() => {
    dispatch(getUserData(handleError))
  }, [])
	const [isLoading, setIsLoading] = useState(false)
  return (
    <>
    <Routes>
    {isAuth ? <>
        <Route path="driver/ride/:id" element={<Map />} />
        <Route path="driver/create-ride" element={<CreateRide/>} />
        <Route path="ride/:id/tickets/:ticket_id" element={<Map />} />
        <Route path="ride/:id" element={<Map />} />
        <Route path='*' element={<Home/>} />
      </>:
      <Route path='*' element={<Auth />} />
    }
    </Routes>
    <ToastContainer />
    <Spinner isLoading={isLoading} message={"loading"}/>
    </>
  );
}

export default App;
