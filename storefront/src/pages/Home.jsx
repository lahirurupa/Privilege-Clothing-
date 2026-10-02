import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import api from "../services/api";

import ProductCard
  from "../components/ProductCard";


function Home() {

  const [
    products,
    setProducts
  ] = useState([]);


  useEffect(() => {

    async function loadProducts() {

      try {

        const response =
          await api.get(
            "/products?limit=4"
          );


        setProducts(
          response.data.products ||
          []
        );

      } catch (error) {

        console.error(error);

      }

    }


    loadProducts();

  }, []);


  return (

    <>

      {/* HERO */}

      <section
        className="hero-section"
      >

        <div
          className="hero-content"
        >

          <span>
            PRIVILEGE CLOTHING
          </span>


          <h1>
            Wear Your
            <br />
            Privilege.
          </h1>


          <p>
            Modern essentials built around comfort, confidence and clean design.
          </p>


          <Link
            to="/shop"
            className="hero-button"
          >
            Shop Collection
          </Link>

        </div>

      </section>


      {/* FEATURED */}

      <section
        className="store-section"
      >

        <div
          className="section-title-row"
        >

          <div>

            <span
              className="store-eyebrow"
            >
              COLLECTION
            </span>

            <h2>
              Latest Products
            </h2>

          </div>


          <Link
            to="/shop"
          >
            View All
          </Link>

        </div>


        <div
          className="store-product-grid"
        >

          {
            products.map(
              product => (

                <ProductCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                />

              )
            )
          }

        </div>

      </section>

    </>

  );

}


export default Home;