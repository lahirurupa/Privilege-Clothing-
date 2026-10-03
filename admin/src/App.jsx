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

import AddProduct
  from "./pages/AddProduct";

import EditProduct
  from "./pages/EditProduct";

import Inventory
  from "./pages/Inventory";

import Users
  from "./pages/Users";

import Orders
  from "./pages/Orders";


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

        <Route
          path="products/new"
          element={
            <AddProduct />
          }
        />

        <Route
          path="products/:id/edit"
          element={
            <EditProduct />
          }
        />

        <Route
          path="inventory"
          element={
            <Inventory />
          }
        />

        <Route
          path="users"
          element={
            <Users />
          }
        />

        <Route
          path="orders"
          element={
            <Orders />
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