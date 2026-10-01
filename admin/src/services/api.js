import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});


/*
|--------------------------------------------------------------------------
| Attach JWT
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


    /*
    |--------------------------------------------------------------------------
    | Important for file uploads
    |--------------------------------------------------------------------------
    |
    | Let the browser automatically generate:
    |
    | multipart/form-data; boundary=.....
    |
    */

    if (
      config.data instanceof FormData
    ) {

      delete config.headers[
        "Content-Type"
      ];

    } else {

      config.headers[
        "Content-Type"
      ] = "application/json";

    }


    return config;

  },

  (error) =>
    Promise.reject(error)
);


/*
|--------------------------------------------------------------------------
| Handle invalid / expired JWT
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