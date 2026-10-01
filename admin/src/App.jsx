import {
  Route,
  Routes
} from "react-router-dom";

import ProtectedRoute
  from "./components/ProtectedRoute";

import AdminLayout
  from "./components/AdminLayout";

import Login
  from "./pages/Login";

import Dashboard
  from "./pages/Dashboard";

import Products
  from "./pages/Products";


function App() {

  return (

    <Routes>

      {/* LOGIN */}

      <Route
        path="/login"
        element={
          <Login />
        }
      />


      {/* PROTECTED ADMIN */}

      <Route
        path="/"
        element={

          <ProtectedRoute>

            <AdminLayout />

          </ProtectedRoute>

        }
      >

        <Route
          index
          element={
            <Dashboard />
          }
        />


        <Route
          path="products"
          element={
            <Products />
          }
        />

      </Route>


      {/* UNKNOWN ROUTE */}

      <Route
        path="*"
        element={
          <div>
            Page not found
          </div>
        }
      />

    </Routes>

  );

}


export default App;