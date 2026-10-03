// import axios from "axios";


// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL
// });


// api.interceptors.request.use(
//   config => {

//     const token =
//       sessionStorage.getItem(
//         "customerToken"
//       );


//     if (token) {

//       config.headers.Authorization =
//         `Bearer ${token}`;

//     }


//     return config;

//   },

//   error =>
//     Promise.reject(error)
// );


// export default api;






import axios from "axios";


const api = axios.create({

  baseURL:
    import.meta.env.VITE_API_URL

});


/*
|--------------------------------------------------------------------------
| Attach Customer JWT
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(

  config => {

    const token =
      sessionStorage.getItem(
        "customerToken"
      );


    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    return config;

  },


  error =>
    Promise.reject(error)

);


/*
|--------------------------------------------------------------------------
| Handle Expired Authentication
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(

  response =>
    response,


  error => {

    if (
      error.response?.status ===
      401
    ) {

      const token =
        sessionStorage.getItem(
          "customerToken"
        );


      if (token) {

        sessionStorage.removeItem(
          "customerToken"
        );


        sessionStorage.removeItem(
          "customerUser"
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


    return Promise.reject(
      error
    );

  }

);


export default api;