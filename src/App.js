import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { selectCurrentLocation, updateLocation } from './utils/locationSlice';
import { selectLoggedIn, updateIsLoggedIn } from './featuers/Authentication/authSlice';
import { ROUTE } from './config/constants';
import Register from './featuers/Authentication/SignUpPage/Register';
import LogIn from './featuers/Authentication/LoginPage/LogIn';
import HomePage from './featuers/Home/HomePage';
import Wraper from './featuers/Home/Wraper';
import { isAuthenticated } from './config/Session';

const App = () => {
  const dispatch = useDispatch();
  const location = useSelector(selectCurrentLocation);

  const getLocationParams = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const { latitude, longitude } = position.coords;
        getExactLocation(latitude, longitude);
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const getExactLocation = async (latitude, longitude) => {
    try {
      const api_key = process.env.REACT_APP_GEO_LOC_API_KEY;
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${api_key}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const { country, state, name } = data[0] || {};
      dispatch(updateLocation({ country, state, city: name }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(()=>{
    // getLocationParams();
    const res = isAuthenticated();
    dispatch(updateIsLoggedIn(res));
  },[])

  return (
    <Routes>
      <Route path={ROUTE.register} element={<Register />} />
      <Route path={ROUTE.login} element={<LogIn />} />
      <Route path={ROUTE.base} element={ isAuthenticated() ? <HomePage /> : <LogIn/>} />
    </Routes>
  );
};

export default App;
