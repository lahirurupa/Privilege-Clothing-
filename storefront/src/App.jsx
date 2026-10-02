import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import StoreLayout
  from "./components/StoreLayout";

import Home
  from "./pages/Home";

import Shop
  from "./pages/Shop";

import ProductDetails
  from "./pages/ProductDetails";

import Login
  from "./pages/Login";

import Register
  from "./pages/Register";


function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={
          <StoreLayout />
        }
      >

        <Route
          index
          element={
            <Home />
          }
        />


        <Route
          path="shop"
          element={
            <Shop />
          }
        />


        <Route
          path="product/:id"
          element={
            <ProductDetails />
          }
        />


        <Route
          path="login"
          element={
            <Login />
          }
        />


        <Route
          path="register"
          element={
            <Register />
          }
        />

      </Route>


      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>

  );

}


export default App;