import {
  NavLink,
  Outlet,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";


function AdminLayout() {

  const {
    user,
    logout
  } = useAuth();


  const navigate =
    useNavigate();


  function handleLogout() {

    logout();

    navigate(
      "/login",
      {
        replace: true
      }
    );

  }


  return (

    <div
      className="admin-container"
    >

      {/* SIDEBAR */}

      <aside
        className="sidebar"
      >

        <div
          className="sidebar-brand"
        >

          <h2>
            PRIVILEGE
          </h2>

          <span>
            Clothing Admin
          </span>

        </div>


        <nav
          className="sidebar-nav"
        >

          <NavLink
            to="/"
            end
            className={
              ({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
            }
          >
            Dashboard
          </NavLink>


          <NavLink
            to="/products"
            className={
              ({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
            }
          >
            Products
          </NavLink>


          <NavLink
            to="/inventory"
            className={
                ({ isActive }) =>
                isActive
                    ? "nav-link active"
                    : "nav-link"
            }
          >
            Inventory
          </NavLink>


          <NavLink
            to="/users"
            className={
              ({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
            }
          >
            Users
          </NavLink>


          <NavLink
            to="/orders"
            className={
              ({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
            }
          >
            Orders
          </NavLink>

        </nav>


        <div
          className="sidebar-footer"
        >

          <div
            className="admin-info"
          >

            <strong>
              {user?.name}
            </strong>

            <small>
              {user?.email}
            </small>

          </div>


          <button
            className="logout-button"
            onClick={
              handleLogout
            }
          >
            Logout
          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main
        className="admin-main"
      >

        <header
          className="admin-header"
        >

          <div>

            <h1>
              Privilege Clothing
            </h1>

            <p>
              Administration Panel
            </p>

          </div>


          <div
            className="admin-badge"
          >
            Admin
          </div>

        </header>


        <div
          className="admin-content"
        >

          <Outlet />

        </div>

      </main>

    </div>

  );

}


export default AdminLayout;