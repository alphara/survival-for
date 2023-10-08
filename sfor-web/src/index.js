import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// import App from './App';
import Home from './Home'
import Error from './Error'

const root = ReactDOM.createRoot(document.getElementById('root'));
const Index = () => {
  return (
  <>
    <Routes>
      <Route path="/" element={<Home />}/>
      {/*
      <Route path="/terms" element={<Terms />}/>
      <Route path="/privacy" element={<Privacy />}/>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/logout" element={<Logout />}/>
      <Route path="/chat" element={<Chat />}/>
      <Route path='/code' element={<></>}/>
      <Route path='/run' element={<Run />}/>
      <Route path='/profile' element={<Profile />}/>
      */}

      <Route path="*" element={<Error />}/>
    </Routes>
  </>
  )
}
root.render(
  <BrowserRouter>
    <Index/>
  </BrowserRouter>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
