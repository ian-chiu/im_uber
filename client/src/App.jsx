import "./style.css";

import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Spinner from "~/common/components/Spinner";

import Map from "./pages/Map";
import CreateRide from "./pages/CreateRide";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <Routes>
        <Route path="map" element={<Map />} />
        <Route path="create-ride" element={<CreateRide />} />
        <Route path="ride/:id" element={<Map />} />
      </Routes>
      <ToastContainer />
      <Spinner isLoading={isLoading} message={"loading"} />
    </>
  );
}

export default App;
