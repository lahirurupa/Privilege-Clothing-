import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  headers: {
    "Content-Type": "application/json"
  }
});


/*
|--------------------------------------------------------------------------
| Attach JWT automatically
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  (config) => {

    const token =
      sessionStorage.getItem(
        "adminToken"
      );


    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    return config;

  },

  (error) =>
    Promise.reject(error)
);


/*
|--------------------------------------------------------------------------
| Handle expired / invalid JWT
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(

  (response) =>
    response,

  (error) => {

    if (
      error.response?.status === 401
    ) {

      const token =
        sessionStorage.getItem(
          "adminToken"
        );


      if (token) {

        sessionStorage.removeItem(
          "adminToken"
        );

        sessionStorage.removeItem(
          "adminUser"
        );


        if (
          window.location.pathname !==
          "/login"
        ) {

          window.location.replace(
            "/login"
          );

        }

      }

    }


    return Promise.reject(error);

  }

);


export default api;