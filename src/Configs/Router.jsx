import React, { useEffect } from "react";
import { createBrowserRouter, useLocation } from "react-router-dom";
import Notfoundpage from "./notfound/404Notfound";
import Home from "../Views/Home/Home.jsx";
import Login from "../Views/AuthPages/Login.jsx";
import Register from "../Views/AuthPages/Register.jsx";
import CreateUpdateOrg from "../Views/AuthPages/CreateUpdateOrg.jsx";
import Organisations from "../Views/AuthPages/Organisations.jsx";
import { ProtectedRouteForUser } from "./AuthRoutes.jsx";
import ForgetPassword from "../Views/AuthPages/ForgetPassword.jsx";
import ChangePassword from "../Views/AuthPages/ChangePassword.jsx";
import VerifyEmail from "../Views/AuthPages/VerifyEmail.jsx";
import Settings from "../Views/Settings/Settings.jsx";
import Organizations from "../Views/Settings/Organizations/Organizations.jsx";
import CreateANewOrganization from "../Views/Settings/Organizations/CreateANewOrganization.jsx";
import Users from "../Views/Settings/Organizations/Users.jsx";
import InviteUser from "../Views/Settings/Organizations/InviteUser.jsx";
import EditQuotation from "../Views/Sales/EditQuotation.jsx";
import EditSalesOrder from "../Views/Sales/EditSalesOrder.jsx";
import EditInvoices from "../Views/Sales/EditInvoices.jsx";
import WareHouse from "../Views/Settings/WareHouse/WareHouse.jsx";
import CreateWareHouse from "../Views/Settings/WareHouse/CreateWareHouse.jsx";
import Roles from "../Views/Settings/UsersAndRoles/Roles.jsx";
import AcceptInvitation from "../Views/Settings/Organizations/AcceptInvitation.jsx";
import CreateRoles from "../Views/Settings/UsersAndRoles/CreateRoles.jsx";
import UpdateJournal from "../Views/Accountant/Journal/UpdateJournal.jsx";
import UpdateCreditNotes from "../Views/Sales/CreditNotes/UpdateCreditNotes.jsx";
// import Test from "../../test/Test.jsx";
import NewField from "../Views/Settings/NewField/NewField.jsx";
import Compoent1 from "../../test/Compoent1.jsx";
import MainPresentSec from "../Views/Home/MainPresentSec.jsx";
import AllProductsOfDvts from "../Views/Home/AllProductsOfDvts.jsx";
import GenerateIdPopup from "../Views/Home/GenerateIdPopup.jsx";

// Define a higher-order component to scroll to the top
const ScrollToTopOnMount = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Your router configuration  
const routerConfig = [
  {
    path: "/",
    element: <ProtectedRouteForUser><Home /></ProtectedRouteForUser>,
    errorElement: <Notfoundpage />,
  },

  {
    path: "/home_nakshatravels",
    element: <AllProductsOfDvts />,
    // errorElement: <Notfoundpage />,
  },

  {
    path: "/home_present_megamarket",
    element: <ProtectedRouteForUser><MainPresentSec /></ProtectedRouteForUser>,
    errorElement: <Notfoundpage />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },

  {
    path: "/change-password",
    element: <ChangePassword />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verifymail/:token",
    element: <VerifyEmail />,
  },
  // {
  //   path: "/invitation-mail/:token",
  //   element: <AcceptInvitation />,
  // },






  // {
  //   path: "/create-organisation",
  //   element: <CreateUpdateOrg />,
  // },
  // {
  //   path: "/organisations",
  //   element: <Organisations />,
  // },



];

// Apply the higher-order component to each route
const wrappedRoutes = routerConfig.map((route) => ({
  ...route,
  element: (
    <>
      <ScrollToTopOnMount />
      {route.element}
    </>
  ),
}));

const router = createBrowserRouter(wrappedRoutes);

export default router;
