import {
  useEffect,
  useMemo,
  useState
} from "react";

import api from "../services/api";

import {
  useAuth
} from "../context/AuthContext";


function Users() {

  const {
    user: currentAdmin
  } = useAuth();


  const [
    users,
    setUsers
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  const [
    search,
    setSearch
  ] = useState("");


  const [
    roleFilter,
    setRoleFilter
  ] = useState("all");


  const [
    statusFilter,
    setStatusFilter
  ] = useState("all");


  const [
    updatingId,
    setUpdatingId
  ] = useState(null);


  /*
  |--------------------------------------------------------------------------
  | Load Users
  |--------------------------------------------------------------------------
  */

  async function loadUsers() {

    try {

      setLoading(true);

      setError("");


      const response =
        await api.get(
          "/admin/users"
        );


      setUsers(
        response.data.users ||
        []
      );


    } catch (error) {

      console.error(error);


      setError(
        error.response
          ?.data
          ?.message ||
        "Unable to load users."
      );


    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    loadUsers();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Filter
  |--------------------------------------------------------------------------
  */

  const filteredUsers =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      return users.filter(
        user => {

          const matchesSearch =
            !query ||
            user.name
              ?.toLowerCase()
              .includes(query) ||
            user.email
              ?.toLowerCase()
              .includes(query);


          const matchesRole =
            roleFilter === "all" ||
            user.role ===
              roleFilter;


          let matchesStatus =
            true;


          if (
            statusFilter ===
            "active"
          ) {

            matchesStatus =
              user.is_active;

          }


          if (
            statusFilter ===
            "disabled"
          ) {

            matchesStatus =
              !user.is_active;

          }


          return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
          );

        }
      );

    }, [
      users,
      search,
      roleFilter,
      statusFilter
    ]);


  /*
  |--------------------------------------------------------------------------
  | Stats
  |--------------------------------------------------------------------------
  */

  const customers =
    users.filter(
      user =>
        user.role ===
        "customer"
    ).length;


  const admins =
    users.filter(
      user =>
        user.role ===
        "admin"
    ).length;


  const activeUsers =
    users.filter(
      user =>
        user.is_active
    ).length;


  const disabledUsers =
    users.filter(
      user =>
        !user.is_active
    ).length;


  /*
  |--------------------------------------------------------------------------
  | Status Toggle
  |--------------------------------------------------------------------------
  */

  async function toggleUserStatus(
    user
  ) {

    const newStatus =
      !user.is_active;


    const action =
      newStatus
        ? "enable"
        : "disable";


    const confirmed =
      window.confirm(
        `${action === "disable" ? "Disable" : "Enable"} ${user.name}?`
      );


    if (!confirmed) {

      return;

    }


    try {

      setUpdatingId(
        user.id
      );


      const response =
        await api.patch(
          `/admin/users/${user.id}/status`,
          {
            is_active:
              newStatus
          }
        );


      const updatedUser =
        response.data.user;


      setUsers(
        current =>
          current.map(
            item =>
              item.id ===
              updatedUser.id
                ? updatedUser
                : item
          )
      );


    } catch (error) {

      console.error(error);


      alert(
        error.response
          ?.data
          ?.message ||
        "Unable to update user."
      );


    } finally {

      setUpdatingId(
        null
      );

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Date
  |--------------------------------------------------------------------------
  */

  function formatDate(
    date
  ) {

    if (!date) {
      return "-";
    }


    return new Intl.DateTimeFormat(
      "en-LK",
      {
        year: "numeric",
        month: "short",
        day: "2-digit"
      }
    ).format(
      new Date(date)
    );

  }


  if (loading) {

    return (
      <div>
        Loading users...
      </div>
    );

  }


  return (

    <div className="users-page">

      {/* HEADER */}

      <div
        className="users-page-header"
      >

        <div>

          <span
            className="page-eyebrow"
          >
            CUSTOMER MANAGEMENT
          </span>

          <h2>
            Users
          </h2>

          <p>
            Manage customers and administrator accounts.
          </p>

        </div>

      </div>


      {
        error && (

          <div
            className="error-message"
          >
            {error}
          </div>

        )
      }


      {/* STATS */}

      <div
        className="users-stat-grid"
      >

        <UserStat
          title="Total Users"
          value={
            users.length
          }
        />

        <UserStat
          title="Customers"
          value={
            customers
          }
        />

        <UserStat
          title="Active"
          value={
            activeUsers
          }
        />

        <UserStat
          title="Disabled"
          value={
            disabledUsers
          }
        />

      </div>


      {/* FILTER */}

      <div
        className="users-controls"
      >

        <input
          className="users-search"
          placeholder="Search name or email..."
          value={
            search
          }
          onChange={
            event =>
              setSearch(
                event.target.value
              )
          }
        />


        <select
          className="users-filter"
          value={
            roleFilter
          }
          onChange={
            event =>
              setRoleFilter(
                event.target.value
              )
          }
        >

          <option value="all">
            All Roles
          </option>

          <option value="customer">
            Customers
          </option>

          <option value="admin">
            Administrators
          </option>

        </select>


        <select
          className="users-filter"
          value={
            statusFilter
          }
          onChange={
            event =>
              setStatusFilter(
                event.target.value
              )
          }
        >

          <option value="all">
            All Status
          </option>

          <option value="active">
            Active
          </option>

          <option value="disabled">
            Disabled
          </option>

        </select>

      </div>


      {/* TABLE */}

      <div
        className="users-card"
      >

        <div
          className="table-wrapper"
        >

          <table
            className="users-table"
          >

            <thead>

              <tr>

                <th>
                  User
                </th>

                <th>
                  Email
                </th>

                <th>
                  Role
                </th>

                <th>
                  Joined
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {
                filteredUsers.length ===
                0
                  ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="empty-table"
                      >
                        No users found.
                      </td>

                    </tr>

                  )
                  : filteredUsers.map(
                    user => {

                      const isCurrentAdmin =
                        currentAdmin?.id ===
                        user.id;


                      return (

                        <tr
                          key={
                            user.id
                          }
                        >

                          <td>

                            <div
                              className="user-name-cell"
                            >

                              <div
                                className="user-avatar"
                              >
                                {
                                  user.name
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                  "U"
                                }
                              </div>


                              <div>

                                <strong>
                                  {
                                    user.name
                                  }
                                </strong>


                                {
                                  isCurrentAdmin && (

                                    <small>
                                      You
                                    </small>

                                  )
                                }

                              </div>

                            </div>

                          </td>


                          <td>
                            {
                              user.email
                            }
                          </td>


                          <td>

                            <span
                              className={
                                user.role ===
                                "admin"
                                  ? "role-badge admin-role"
                                  : "role-badge customer-role"
                              }
                            >

                              {
                                user.role ===
                                "admin"
                                  ? "Admin"
                                  : "Customer"
                              }

                            </span>

                          </td>


                          <td>

                            {
                              formatDate(
                                user.created_at
                              )
                            }

                          </td>


                          <td>

                            <span
                              className={
                                user.is_active
                                  ? "user-status user-active"
                                  : "user-status user-disabled"
                              }
                            >

                              {
                                user.is_active
                                  ? "Active"
                                  : "Disabled"
                              }

                            </span>

                          </td>


                          <td>

                            {
                              isCurrentAdmin
                                ? (

                                  <span
                                    className="current-user-label"
                                  >
                                    Current Account
                                  </span>

                                )
                                : (

                                  <button
                                    className={
                                      user.is_active
                                        ? "small-button danger-button"
                                        : "small-button"
                                    }
                                    disabled={
                                      updatingId ===
                                      user.id
                                    }
                                    onClick={() =>
                                      toggleUserStatus(
                                        user
                                      )
                                    }
                                  >

                                    {
                                      updatingId ===
                                        user.id
                                        ? "Updating..."
                                        : user.is_active
                                          ? "Disable"
                                          : "Enable"
                                    }

                                  </button>

                                )
                            }

                          </td>

                        </tr>

                      );

                    }
                  )
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}


function UserStat({
  title,
  value
}) {

  return (

    <div
      className="users-stat-card"
    >

      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>

    </div>

  );

}


export default Users;