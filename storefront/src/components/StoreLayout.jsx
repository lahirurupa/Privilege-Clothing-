import {
  Outlet
} from "react-router-dom";

import Navbar
  from "./Navbar";

import Footer
  from "./Footer";


function StoreLayout() {

  return (

    <div
      className="store-app"
    >

      <Navbar />


      <main
        className="store-main"
      >

        <Outlet />

      </main>


      <Footer />

    </div>

  );

}


export default StoreLayout;