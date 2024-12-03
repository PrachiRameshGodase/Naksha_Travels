import React, { Fragment } from "react";
import { Navigate, useLocation } from 'react-router-dom';

// export const ProtectedRouteForAuthSlash = ({ children }) => {
//   const authToken = getAuthTokenFromCookie();
//   if (authToken) {
//     return <Navigate to={"/"} replace={true}></Navigate>;
//   }
//   return children;
// };



// export const ProtectedRouteForUser = ({ children }) => {
//   const storedUserData = localStorage.getItem('AccessToken');


//   if (!storedUserData) {
//       return <Navigate to="/login" replace={true} />;
//   }

//   return children;
// };


export const ProtectedRouteForUser = ({ children }) => {
  const location = useLocation();
  const storedAccessToken = localStorage.getItem('AccessToken');

  // Parse URL parameters
  const searchParams = new URLSearchParams(location.search);
  const urlAccessToken = searchParams.get('AccessToken');

  // Check if either the stored access token or URL access token exists
  if (!storedAccessToken && !urlAccessToken) {
    return <Navigate to="/login" replace={true} />;
  } else {
    return <Navigate to="/home_nakshatravels" replace={true} />;
  }

  return children;
};