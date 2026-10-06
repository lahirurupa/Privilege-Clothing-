// import {
//   useEffect,
//   useMemo,
//   useState
// } from "react";

// import api from "../services/api";

// import {
//   useAuth
// } from "../context/AuthContext";


// function Users() {

//   const {
//     user: currentAdmin
//   } = useAuth();


//   const [
//     users,
//     setUsers
//   ] = useState([]);


//   const [
//     loading,
//     setLoading
//   ] = useState(true);


//   const [
//     error,
//     setError
//   ] = useState("");


//   const [
//     search,
//     setSearch
//   ] = useState("");


//   const [
//     roleFilter,
//     setRoleFilter
//   ] = useState("all");


//   const [
//     statusFilter,
//     setStatusFilter
//   ] = useState("all");


//   const [
//     updatingId,
//     setUpdatingId
//   ] = useState(null);


//   /*
//   |--------------------------------------------------------------------------
//   | Load Users
//   |--------------------------------------------------------------------------
//   */

//   async function loadUsers() {

//     try {

//       setLoading(true);

//       setError("");


//       const response =
//         await api.get(
//           "/admin/users"
//         );


//       setUsers(
//         response.data.users ||
//         []
//       );


//     } catch (error) {

//       console.error(error);


//       setError(
//         error.response
//           ?.data
//           ?.message ||
//         "Unable to load users."
//       );


//     } finally {

//       setLoading(false);

//     }

//   }


//   useEffect(() => {

//     loadUsers();

//   }, []);


//   /*
//   |--------------------------------------------------------------------------
//   | Filter
//   |--------------------------------------------------------------------------
//   */

//   const filteredUsers =
//     useMemo(() => {

//       const query =
//         search
//           .trim()
//           .toLowerCase();


//       return users.filter(
//         user => {

//           const matchesSearch =
//             !query ||
//             user.name
//               ?.toLowerCase()
//               .includes(query) ||
//             user.email
//               ?.toLowerCase()
//               .includes(query);


//           const matchesRole =
//             roleFilter === "all" ||
//             user.role ===
//               roleFilter;


//           let matchesStatus =
//             true;


//           if (
//             statusFilter ===
//             "active"
//           ) {

//             matchesStatus =
//               user.is_active;

//           }


//           if (
//             statusFilter ===
//             "disabled"
//           ) {

//             matchesStatus =
//               !user.is_active;

//           }


//           return (
//             matchesSearch &&
//             matchesRole &&
//             matchesStatus
//           );

//         }
//       );

//     }, [
//       users,
//       search,
//       roleFilter,
//       statusFilter
//     ]);


//   /*
//   |--------------------------------------------------------------------------
//   | Stats
//   |--------------------------------------------------------------------------
//   */

//   const customers =
//     users.filter(
//       user =>
//         user.role ===
//         "customer"
//     ).length;


//   const admins =
//     users.filter(
//       user =>
//         user.role ===
//         "admin"
//     ).length;


//   const activeUsers =
//     users.filter(
//       user =>
//         user.is_active
//     ).length;


//   const disabledUsers =
//     users.filter(
//       user =>
//         !user.is_active
//     ).length;


//   /*
//   |--------------------------------------------------------------------------
//   | Status Toggle
//   |--------------------------------------------------------------------------
//   */

//   async function toggleUserStatus(
//     user
//   ) {

//     const newStatus =
//       !user.is_active;


//     const action =
//       newStatus
//         ? "enable"
//         : "disable";


//     const confirmed =
//       window.confirm(
//         `${action === "disable" ? "Disable" : "Enable"} ${user.name}?`
//       );


//     if (!confirmed) {

//       return;

//     }


//     try {

//       setUpdatingId(
//         user.id
//       );


//       const response =
//         await api.patch(
//           `/admin/users/${user.id}/status`,
//           {
//             is_active:
//               newStatus
//           }
//         );


//       const updatedUser =
//         response.data.user;


//       setUsers(
//         current =>
//           current.map(
//             item =>
//               item.id ===
//               updatedUser.id
//                 ? updatedUser
//                 : item
//           )
//       );


//     } catch (error) {

//       console.error(error);


//       alert(
//         error.response
//           ?.data
//           ?.message ||
//         "Unable to update user."
//       );


//     } finally {

//       setUpdatingId(
//         null
//       );

//     }

//   }


//   /*
//   |--------------------------------------------------------------------------
//   | Date
//   |--------------------------------------------------------------------------
//   */

//   function formatDate(
//     date
//   ) {

//     if (!date) {
//       return "-";
//     }


//     return new Intl.DateTimeFormat(
//       "en-LK",
//       {
//         year: "numeric",
//         month: "short",
//         day: "2-digit"
//       }
//     ).format(
//       new Date(date)
//     );

//   }


//   if (loading) {

//     return (
//       <div>
//         Loading users...
//       </div>
//     );

//   }


//   return (

//     <div className="users-page">

//       {/* HEADER */}

//       <div
//         className="users-page-header"
//       >

//         <div>

//           <span
//             className="page-eyebrow"
//           >
//             CUSTOMER MANAGEMENT
//           </span>

//           <h2>
//             Users
//           </h2>

//           <p>
//             Manage customers and administrator accounts.
//           </p>

//         </div>

//       </div>


//       {
//         error && (

//           <div
//             className="error-message"
//           >
//             {error}
//           </div>

//         )
//       }


//       {/* STATS */}

//       <div
//         className="users-stat-grid"
//       >

//         <UserStat
//           title="Total Users"
//           value={
//             users.length
//           }
//         />

//         <UserStat
//           title="Customers"
//           value={
//             customers
//           }
//         />

//         <UserStat
//           title="Active"
//           value={
//             activeUsers
//           }
//         />

//         <UserStat
//           title="Disabled"
//           value={
//             disabledUsers
//           }
//         />

//       </div>


//       {/* FILTER */}

//       <div
//         className="users-controls"
//       >

//         <input
//           className="users-search"
//           placeholder="Search name or email..."
//           value={
//             search
//           }
//           onChange={
//             event =>
//               setSearch(
//                 event.target.value
//               )
//           }
//         />


//         <select
//           className="users-filter"
//           value={
//             roleFilter
//           }
//           onChange={
//             event =>
//               setRoleFilter(
//                 event.target.value
//               )
//           }
//         >

//           <option value="all">
//             All Roles
//           </option>

//           <option value="customer">
//             Customers
//           </option>

//           <option value="admin">
//             Administrators
//           </option>

//         </select>


//         <select
//           className="users-filter"
//           value={
//             statusFilter
//           }
//           onChange={
//             event =>
//               setStatusFilter(
//                 event.target.value
//               )
//           }
//         >

//           <option value="all">
//             All Status
//           </option>

//           <option value="active">
//             Active
//           </option>

//           <option value="disabled">
//             Disabled
//           </option>

//         </select>

//       </div>


//       {/* TABLE */}

//       <div
//         className="users-card"
//       >

//         <div
//           className="table-wrapper"
//         >

//           <table
//             className="users-table"
//           >

//             <thead>

//               <tr>

//                 <th>
//                   User
//                 </th>

//                 <th>
//                   Email
//                 </th>

//                 <th>
//                   Role
//                 </th>

//                 <th>
//                   Joined
//                 </th>

//                 <th>
//                   Status
//                 </th>

//                 <th>
//                   Action
//                 </th>

//               </tr>

//             </thead>


//             <tbody>

//               {
//                 filteredUsers.length ===
//                 0
//                   ? (

//                     <tr>

//                       <td
//                         colSpan="6"
//                         className="empty-table"
//                       >
//                         No users found.
//                       </td>

//                     </tr>

//                   )
//                   : filteredUsers.map(
//                     user => {

//                       const isCurrentAdmin =
//                         currentAdmin?.id ===
//                         user.id;


//                       return (

//                         <tr
//                           key={
//                             user.id
//                           }
//                         >

//                           <td>

//                             <div
//                               className="user-name-cell"
//                             >

//                               <div
//                                 className="user-avatar"
//                               >
//                                 {
//                                   user.name
//                                     ?.charAt(0)
//                                     ?.toUpperCase() ||
//                                   "U"
//                                 }
//                               </div>


//                               <div>

//                                 <strong>
//                                   {
//                                     user.name
//                                   }
//                                 </strong>


//                                 {
//                                   isCurrentAdmin && (

//                                     <small>
//                                       You
//                                     </small>

//                                   )
//                                 }

//                               </div>

//                             </div>

//                           </td>


//                           <td>
//                             {
//                               user.email
//                             }
//                           </td>


//                           <td>

//                             <span
//                               className={
//                                 user.role ===
//                                 "admin"
//                                   ? "role-badge admin-role"
//                                   : "role-badge customer-role"
//                               }
//                             >

//                               {
//                                 user.role ===
//                                 "admin"
//                                   ? "Admin"
//                                   : "Customer"
//                               }

//                             </span>

//                           </td>


//                           <td>

//                             {
//                               formatDate(
//                                 user.created_at
//                               )
//                             }

//                           </td>


//                           <td>

//                             <span
//                               className={
//                                 user.is_active
//                                   ? "user-status user-active"
//                                   : "user-status user-disabled"
//                               }
//                             >

//                               {
//                                 user.is_active
//                                   ? "Active"
//                                   : "Disabled"
//                               }

//                             </span>

//                           </td>


//                           <td>

//                             {
//                               isCurrentAdmin
//                                 ? (

//                                   <span
//                                     className="current-user-label"
//                                   >
//                                     Current Account
//                                   </span>

//                                 )
//                                 : (

//                                   <button
//                                     className={
//                                       user.is_active
//                                         ? "small-button danger-button"
//                                         : "small-button"
//                                     }
//                                     disabled={
//                                       updatingId ===
//                                       user.id
//                                     }
//                                     onClick={() =>
//                                       toggleUserStatus(
//                                         user
//                                       )
//                                     }
//                                   >

//                                     {
//                                       updatingId ===
//                                         user.id
//                                         ? "Updating..."
//                                         : user.is_active
//                                           ? "Disable"
//                                           : "Enable"
//                                     }

//                                   </button>

//                                 )
//                             }

//                           </td>

//                         </tr>

//                       );

//                     }
//                   )
//               }

//             </tbody>

//           </table>

//         </div>

//       </div>

//     </div>

//   );

// }


// function UserStat({
//   title,
//   value
// }) {

//   return (

//     <div
//       className="users-stat-card"
//     >

//       <span>
//         {title}
//       </span>

//       <strong>
//         {value}
//       </strong>

//     </div>

//   );

// }


// export default Users;























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
    user:
      currentAdmin
  } = useAuth();


  /*
  |--------------------------------------------------------------------------
  | Tab
  |--------------------------------------------------------------------------
  */

  const [
    tab,
    setTab
  ] = useState(
    "users"
  );


  /*
  |--------------------------------------------------------------------------
  | Normal Users
  |--------------------------------------------------------------------------
  */

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


  /*
  |--------------------------------------------------------------------------
  | Order Activity
  |--------------------------------------------------------------------------
  */

  const [
    reportCustomers,
    setReportCustomers
  ] = useState([]);


  const [
    reportLoading,
    setReportLoading
  ] = useState(false);


  const [
    reportError,
    setReportError
  ] = useState("");


  const [
    reportSearch,
    setReportSearch
  ] = useState("");


  const [
    minOrders,
    setMinOrders
  ] = useState(1);


  const [
    fromDate,
    setFromDate
  ] = useState("");


  const [
    toDate,
    setToDate
  ] = useState("");


  const [
    reportStats,
    setReportStats
  ] = useState({

    customers: 0,

    orders: 0,

    revenue: 0

  });


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

      console.error(
        "LOAD USERS ERROR:",
        error
      );


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
  | Convert Start Date to ISO
  |--------------------------------------------------------------------------
  */

  function getStartDateISO(
    date
  ) {

    if (!date) {

      return null;

    }


    const value =
      new Date(
        `${date}T00:00:00`
      );


    return value
      .toISOString();

  }


  /*
  |--------------------------------------------------------------------------
  | Convert End Date to Exclusive Next-Day ISO
  |--------------------------------------------------------------------------
  |
  | Example:
  |
  | User chooses:
  | 30 Sep
  |
  | Backend receives:
  | 01 Oct 00:00
  |
  | Therefore ALL of 30 Sep is included.
  |
  */

  function getEndDateISO(
    date
  ) {

    if (!date) {

      return null;

    }


    const value =
      new Date(
        `${date}T00:00:00`
      );


    value.setDate(
      value.getDate() +
      1
    );


    return value
      .toISOString();

  }


  /*
  |--------------------------------------------------------------------------
  | Load Order Activity Report
  |--------------------------------------------------------------------------
  */

  async function loadOrderReport() {

    try {

      setReportLoading(true);

      setReportError("");


      const params = {

        min_orders:
          Number(
            minOrders
          ) || 0

      };


      if (fromDate) {

        params.from =
          getStartDateISO(
            fromDate
          );

      }


      if (toDate) {

        params.to =
          getEndDateISO(
            toDate
          );

      }


      const response =
        await api.get(
          "/admin/users/order-summary",
          {
            params
          }
        );


      setReportCustomers(
        response
          .data
          .customers ||
        []
      );


      setReportStats(
        response
          .data
          .stats || {

          customers: 0,

          orders: 0,

          revenue: 0

        }
      );


    } catch (error) {

      console.error(
        "ORDER REPORT ERROR:",
        error
      );


      setReportError(
        error.response
          ?.data
          ?.message ||
        "Unable to load customer order activity."
      );


    } finally {

      setReportLoading(false);

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Automatically Load Report First Time
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (
      tab ===
        "orders" &&
      reportCustomers.length ===
        0
    ) {

      loadOrderReport();

    }

  }, [tab]);


  /*
  |--------------------------------------------------------------------------
  | Normal User Filter
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
            roleFilter ===
              "all" ||

            user.role ===
              roleFilter;


          const matchesStatus =
            statusFilter ===
              "all" ||

            (
              statusFilter ===
                "active" &&
              user.is_active
            ) ||

            (
              statusFilter ===
                "disabled" &&
              !user.is_active
            );


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
  | Report Search
  |--------------------------------------------------------------------------
  */

  const filteredReportCustomers =
    useMemo(() => {

      const query =
        reportSearch
          .trim()
          .toLowerCase();


      if (!query) {

        return reportCustomers;

      }


      return reportCustomers.filter(
        customer =>

          customer.name
            ?.toLowerCase()
            .includes(query) ||

          customer.email
            ?.toLowerCase()
            .includes(query)

      );

    }, [
      reportCustomers,
      reportSearch
    ]);


  /*
  |--------------------------------------------------------------------------
  | Normal User Statistics
  |--------------------------------------------------------------------------
  */

  const totalUsers =
    users.length;


  const customers =
    users.filter(
      user =>
        user.role ===
        "customer"
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
  | User Status
  |--------------------------------------------------------------------------
  */

  async function toggleUserStatus(
    user
  ) {

    if (
      user.role ===
      "admin"
    ) {

      return;

    }


    const nextStatus =
      !user.is_active;


    const confirmed =
      window.confirm(

        nextStatus

          ? `Enable ${user.name}?`

          : `Disable ${user.name}?`

      );


    if (!confirmed) {

      return;

    }


    try {

      const response =
        await api.patch(
          `/admin/users/${user.id}/status`,
          {

            is_active:
              nextStatus

          }
        );


      const updated =
        response.data.user;


      setUsers(
        current =>
          current.map(
            item =>
              item.id ===
              updated.id
                ? updated
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

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Currency
  |--------------------------------------------------------------------------
  */

  function money(
    value
  ) {

    return new Intl.NumberFormat(
      "en-LK",
      {

        style:
          "currency",

        currency:
          "LKR"

      }
    ).format(
      Number(
        value || 0
      )
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Date
  |--------------------------------------------------------------------------
  */

  function formatDate(
    value
  ) {

    if (!value) {

      return "-";

    }


    return new Intl.DateTimeFormat(
      "en-LK",
      {

        dateStyle:
          "medium",

        timeStyle:
          "short"

      }
    ).format(
      new Date(value)
    );

  }


  return (

    <div
      className="users-page"
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

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
            Manage accounts and analyse customer purchasing activity.
          </p>

        </div>

      </div>


      {/* =====================================================
          TABS
      ====================================================== */}

      <div
        className="user-tabs"
      >

        <button
          type="button"
          className={
            tab === "users"
              ? "user-tab active"
              : "user-tab"
          }
          onClick={() =>
            setTab(
              "users"
            )
          }
        >
          All Users
        </button>


        <button
          type="button"
          className={
            tab === "orders"
              ? "user-tab active"
              : "user-tab"
          }
          onClick={() =>
            setTab(
              "orders"
            )
          }
        >
          Order Activity
        </button>

      </div>


      {/* =====================================================
          ALL USERS
      ====================================================== */}

      {
        tab ===
        "users" && (

          <>

            {
              error && (

                <div
                  className="users-error"
                >
                  {error}
                </div>

              )
            }


            <div
              className="users-stat-grid"
            >

              <UserStat
                title="Total Users"
                value={
                  totalUsers
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


            <div
              className="users-filters"
            >

              <input
                type="text"
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
                  Customer
                </option>

                <option value="admin">
                  Admin
                </option>

              </select>


              <select
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


            <div
              className="users-table-card"
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
                        Role
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Joined
                      </th>

                      <th>
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {
                      loading
                        ? (

                          <tr>

                            <td
                              colSpan="5"
                              className="user-empty-row"
                            >
                              Loading users...
                            </td>

                          </tr>

                        )
                        : filteredUsers.length ===
                          0
                          ? (

                            <tr>

                              <td
                                colSpan="5"
                                className="user-empty-row"
                              >
                                No users found.
                              </td>

                            </tr>

                          )
                          : filteredUsers.map(
                            user => (

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
                                          ?.toUpperCase()
                                      }
                                    </div>


                                    <div>

                                      <strong>
                                        {
                                          user.name
                                        }
                                      </strong>

                                      <small>
                                        {
                                          user.email
                                        }
                                      </small>

                                    </div>

                                  </div>

                                </td>


                                <td>

                                  <span
                                    className={
                                      `user-role user-role-${user.role}`
                                    }
                                  >
                                    {
                                      user.role
                                    }
                                  </span>

                                </td>


                                <td>

                                  <span
                                    className={
                                      user.is_active
                                        ? "user-status active"
                                        : "user-status disabled"
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
                                    formatDate(
                                      user.created_at
                                    )
                                  }
                                </td>


                                <td>

                                  {
                                    currentAdmin
                                      ?.id ===
                                    user.id
                                      ? (

                                        <span
                                          className="current-user-label"
                                        >
                                          Current Account
                                        </span>

                                      )
                                      : user.role ===
                                        "admin"
                                        ? (

                                          <span
                                            className="current-user-label"
                                          >
                                            Protected Account
                                          </span>

                                        )
                                        : (

                                          <button
                                            type="button"
                                            className={
                                              user.is_active
                                                ? "disable-user-button"
                                                : "enable-user-button"
                                            }
                                            onClick={() =>
                                              toggleUserStatus(
                                                user
                                              )
                                            }
                                          >

                                            {
                                              user.is_active
                                                ? "Disable"
                                                : "Enable"
                                            }

                                          </button>

                                        )
                                  }

                                </td>

                              </tr>

                            )
                          )
                    }

                  </tbody>

                </table>

              </div>

            </div>

          </>

        )
      }


      {/* =====================================================
          CUSTOMER ORDER ACTIVITY
      ====================================================== */}

      {
        tab ===
        "orders" && (

          <>

            <div
              className="order-customer-filter-card"
            >

              <div
                className="order-customer-filter-grid"
              >

                {/* MINIMUM ORDERS */}

                <div>

                  <label>
                    Minimum Orders
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      minOrders
                    }
                    onChange={
                      event =>
                        setMinOrders(
                          Math.max(
                            0,
                            Number(
                              event.target.value
                            )
                          )
                        )
                    }
                  />

                </div>


                {/* FROM */}

                <div>

                  <label>
                    From
                  </label>

                  <input
                    type="date"
                    value={
                      fromDate
                    }
                    onChange={
                      event =>
                        setFromDate(
                          event.target.value
                        )
                    }
                  />

                </div>


                {/* TO */}

                <div>

                  <label>
                    To
                  </label>

                  <input
                    type="date"
                    value={
                      toDate
                    }
                    onChange={
                      event =>
                        setToDate(
                          event.target.value
                        )
                    }
                  />

                </div>


                {/* APPLY */}

                <div
                  className="order-report-button-container"
                >

                  <button
                    type="button"
                    onClick={
                      loadOrderReport
                    }
                    disabled={
                      reportLoading
                    }
                  >

                    {
                      reportLoading
                        ? "Loading..."
                        : "Apply Filter"
                    }

                  </button>

                </div>

              </div>


              <p
                className="order-filter-help"
              >
                Cancelled orders are excluded from this report. Leave the dates empty to search all-time customer activity.
              </p>

            </div>


            {
              reportError && (

                <div
                  className="users-error"
                >
                  {reportError}
                </div>

              )
            }


            {/* STATS */}

            <div
              className="users-stat-grid"
            >

              <UserStat
                title="Matching Customers"
                value={
                  reportStats.customers
                }
              />


              <UserStat
                title="Orders"
                value={
                  reportStats.orders
                }
              />


              <UserStat
                title="Revenue"
                value={
                  money(
                    reportStats.revenue
                  )
                }
              />


              <UserStat
                title="Minimum Orders"
                value={
                  minOrders
                }
              />

            </div>


            {/* SEARCH */}

            <div
              className="order-report-search"
            >

              <input
                type="text"
                placeholder="Search customer name or email..."
                value={
                  reportSearch
                }
                onChange={
                  event =>
                    setReportSearch(
                      event.target.value
                    )
                }
              />

            </div>


            {/* REPORT TABLE */}

            <div
              className="users-table-card"
            >

              <div
                className="table-wrapper"
              >

                <table
                  className="users-table order-customer-table"
                >

                  <thead>

                    <tr>

                      <th>
                        Customer
                      </th>

                      <th>
                        Orders
                      </th>

                      <th>
                        Total Spent
                      </th>

                      <th>
                        Last Order
                      </th>

                      <th>
                        Registered
                      </th>

                      <th>
                        Status
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {
                      reportLoading
                        ? (

                          <tr>

                            <td
                              colSpan="6"
                              className="user-empty-row"
                            >
                              Loading customer activity...
                            </td>

                          </tr>

                        )
                        : filteredReportCustomers
                            .length ===
                          0
                          ? (

                            <tr>

                              <td
                                colSpan="6"
                                className="user-empty-row"
                              >
                                No customers matched this order filter.
                              </td>

                            </tr>

                          )
                          : filteredReportCustomers.map(
                            customer => (

                              <tr
                                key={
                                  customer.user_id
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
                                        customer.name
                                          ?.charAt(0)
                                          ?.toUpperCase()
                                      }
                                    </div>


                                    <div>

                                      <strong>
                                        {
                                          customer.name
                                        }
                                      </strong>

                                      <small>
                                        {
                                          customer.email
                                        }
                                      </small>

                                    </div>

                                  </div>

                                </td>


                                <td>

                                  <span
                                    className="order-count-badge"
                                  >
                                    {
                                      customer.order_count
                                    }
                                  </span>

                                </td>


                                <td>

                                  <strong>
                                    {
                                      money(
                                        customer.total_spent
                                      )
                                    }
                                  </strong>

                                </td>


                                <td>

                                  {
                                    formatDate(
                                      customer.last_order_at
                                    )
                                  }

                                </td>


                                <td>

                                  {
                                    formatDate(
                                      customer.registered_at
                                    )
                                  }

                                </td>


                                <td>

                                  <span
                                    className={
                                      customer.is_active
                                        ? "user-status active"
                                        : "user-status disabled"
                                    }
                                  >

                                    {
                                      customer.is_active
                                        ? "Active"
                                        : "Disabled"
                                    }

                                  </span>

                                </td>

                              </tr>

                            )
                          )
                    }

                  </tbody>

                </table>

              </div>

            </div>

          </>

        )
      }

    </div>

  );

}


/*
|--------------------------------------------------------------------------
| Stat
|--------------------------------------------------------------------------
*/

function UserStat({
  title,
  value
}) {

  return (

    <div
      className="user-stat-card"
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