import {
  useEffect,
  useState
} from "react";

import api from "../services/api";


function Dashboard() {

  const [
    products,
    setProducts
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  useEffect(() => {

    async function loadDashboard() {

      try {

        const response =
          await api.get(
            "/admin/products"
          );


        setProducts(
          response.data.products ||
          []
        );

      } catch (error) {

        console.error(error);

        setError(
          "Unable to load dashboard information."
        );

      } finally {

        setLoading(false);

      }

    }


    loadDashboard();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const variants =
    products.flatMap(
      product =>
        product.variants || []
    );


  const totalStock =
    variants.reduce(
      (
        total,
        variant
      ) =>
        total +
        Number(
          variant.quantity || 0
        ),
      0
    );


  const lowStock =
    variants.filter(
      variant =>
        Number(
          variant.quantity
        ) > 0 &&
        Number(
          variant.quantity
        ) <= 5
    ).length;


  const outOfStock =
    variants.filter(
      variant =>
        Number(
          variant.quantity
        ) === 0
    ).length;


  const activeProducts =
    products.filter(
      product =>
        product.is_active
    ).length;


  if (loading) {

    return (
      <div>
        Loading dashboard...
      </div>
    );

  }


  return (

    <div>

      <div
        className="page-heading"
      >

        <div>

          <h2>
            Dashboard
          </h2>

          <p>
            Overview of your clothing inventory.
          </p>

        </div>

      </div>


      {error && (

        <div
          className="error-message"
        >
          {error}
        </div>

      )}


      <div
        className="stat-grid"
      >

        <StatCard
          title="Products"
          value={
            products.length
          }
        />

        <StatCard
          title="Active Products"
          value={
            activeProducts
          }
        />

        <StatCard
          title="Total Stock"
          value={
            totalStock
          }
        />

        <StatCard
          title="Low Stock Variants"
          value={
            lowStock
          }
        />

        <StatCard
          title="Out of Stock"
          value={
            outOfStock
          }
        />

      </div>


      <div
        className="content-card"
      >

        <h3>
          Inventory Summary
        </h3>

        <p>
          You currently have{" "}
          <strong>
            {products.length}
          </strong>{" "}
          products with{" "}
          <strong>
            {variants.length}
          </strong>{" "}
          color/size variants.
        </p>

      </div>

    </div>

  );

}


function StatCard({
  title,
  value
}) {

  return (

    <div
      className="stat-card"
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


export default Dashboard;