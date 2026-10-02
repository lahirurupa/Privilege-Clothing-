import {
  Link
} from "react-router-dom";


function ProductCard({
  product
}) {

  const images =
    [
      ...(product.images || [])
    ].sort(
      (a, b) =>
        a.display_order -
        b.display_order
    );


  const image =
    images[0];


  const variants =
    product.variants ||
    [];


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


  function formatPrice(
    price
  ) {

    return new Intl.NumberFormat(
      "en-LK",
      {
        style: "currency",
        currency: "LKR"
      }
    ).format(
      Number(price)
    );

  }


  return (

    <Link
      to={`/product/${product.id}`}
      className="product-card"
    >

      <div
        className="product-card-image"
      >

        {
          image
            ? (

              <img
                src={
                  image.public_url
                }
                alt={
                  image.alt_text ||
                  product.name
                }
              />

            )
            : (

              <div
                className="product-placeholder"
              >
                No image
              </div>

            )
        }


        {
          totalStock === 0 && (

            <span
              className="sold-out-badge"
            >
              Sold Out
            </span>

          )
        }

      </div>


      <div
        className="product-card-info"
      >

        <span
          className="product-category"
        >
          {
            product.category?.name ||
            "Clothing"
          }
        </span>


        <h3>
          {product.name}
        </h3>


        <strong>
          {
            formatPrice(
              product.price
            )
          }
        </strong>

      </div>

    </Link>

  );

}


export default ProductCard;