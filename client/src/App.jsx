import './style.css'

import { useState } from "react";
import { Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import Header from "~/common/components/Header";
import Spinner from "~/common/components/Spinner";

function App() {
	const [isLoading, setIsLoading] = useState(false)
  return (
    <>
    <Header />
    <Routes>
    </Routes>
    <ToastContainer />
    <Spinner isLoading={isLoading} message={"loading"}/>
    </>
  )
}

export default App
