import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import StoreLayout
  from "./components/StoreLayout";

import CustomerProtectedRoute
  from "./components/CustomerProtectedRoute";

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

import Cart
  from "./pages/Cart";

import Checkout
  from "./pages/Checkout";

import MyOrders
  from "./pages/MyOrders";

function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={
          <StoreLayout />
        }
      >

        {/* =====================================================
            PUBLIC
        ====================================================== */}

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


        {/* =====================================================
            CUSTOMER ONLY
        ====================================================== */}

        <Route
          path="cart"
          element={

            <CustomerProtectedRoute>

              <Cart />

            </CustomerProtectedRoute>

          }
        />


        <Route
          path="checkout"
          element={

            <CustomerProtectedRoute>

              <Checkout />

            </CustomerProtectedRoute>

          }
        />


        <Route
          path="orders"
          element={

            <CustomerProtectedRoute>

              <MyOrders />

            </CustomerProtectedRoute>

          }
        />

      </Route>


      {/* FALLBACK */}

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