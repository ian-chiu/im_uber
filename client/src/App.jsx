import './style.css';

import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import Header from "~/common/components/Header";
import Spinner from "~/common/components/Spinner";

import Map from './pages/Map';

function App() {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <>
      <Header />
      <Routes>
        <Route path="map" element={<Map />} />
      </Routes>
      <ToastContainer />
      <Spinner isLoading={isLoading} message={"loading"} />
    </>
  )
}

export default App
