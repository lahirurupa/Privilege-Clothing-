import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

import api from "../services/api";


function ProductDetails() {

  const {
    id
  } = useParams();


  const [
    product,
    setProduct
  ] = useState(null);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    selectedColor,
    setSelectedColor
  ] = useState("");


  const [
    selectedSize,
    setSelectedSize
  ] = useState("");


  const [
    selectedImage,
    setSelectedImage
  ] = useState("");


  useEffect(() => {

    async function loadProduct() {

      try {

        const response =
          await api.get(
            `/products/${id}`
          );


        const data =
          response.data.product;


        setProduct(data);


        const images =
          [
            ...(data.images || [])
          ].sort(
            (a, b) =>
              a.display_order -
              b.display_order
          );


        if (
          images.length
        ) {

          setSelectedImage(
            images[0].public_url
          );

        }


        if (
          data.variants?.length
        ) {

          setSelectedColor(
            data.variants[0]
              .color_name
          );

        }


      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }


    loadProduct();

  }, [id]);


  const colors =
    useMemo(() => {

      if (!product) {
        return [];
      }


      const map =
        new Map();


      for (
        const variant of
        product.variants || []
      ) {

        if (
          !map.has(
            variant.color_name
          )
        ) {

          map.set(
            variant.color_name,
            {
              name:
                variant.color_name,

              hex:
                variant.color_hex
            }
          );

        }

      }


      return Array.from(
        map.values()
      );

    }, [product]);


  const sizes =
    useMemo(() => {

      if (
        !product ||
        !selectedColor
      ) {

        return [];

      }


      return product.variants.filter(
        variant =>
          variant.color_name ===
          selectedColor
      );

    }, [
      product,
      selectedColor
    ]);


  const selectedVariant =
    useMemo(() => {

      if (
        !product ||
        !selectedColor ||
        !selectedSize
      ) {

        return null;

      }


      return product.variants.find(
        variant =>
          variant.color_name ===
            selectedColor &&
          variant.size ===
            selectedSize
      );

    }, [
      product,
      selectedColor,
      selectedSize
    ]);


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


  if (loading) {

    return (
      <div
        className="store-section"
      >
        Loading product...
      </div>
    );

  }


  if (!product) {

    return (
      <div
        className="store-section"
      >
        Product not found.
      </div>
    );

  }


  const images =
    [
      ...(product.images || [])
    ].sort(
      (a, b) =>
        a.display_order -
        b.display_order
    );


  return (

    <section
      className="store-section"
    >

      <div
        className="product-details-layout"
      >

        {/* IMAGES */}

        <div
          className="product-gallery"
        >

          <div
            className="main-product-image"
          >

            {
              selectedImage
                ? (

                  <img
                    src={
                      selectedImage
                    }
                    alt={
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

          </div>


          <div
            className="product-thumbnails"
          >

            {
              images.map(
                image => (

                  <button
                    key={
                      image.id
                    }
                    onClick={() =>
                      setSelectedImage(
                        image.public_url
                      )
                    }
                    className={
                      selectedImage ===
                      image.public_url
                        ? "thumbnail active"
                        : "thumbnail"
                    }
                  >

                    <img
                      src={
                        image.public_url
                      }
                      alt={
                        image.alt_text ||
                        product.name
                      }
                    />

                  </button>

                )
              )
            }

          </div>

        </div>


        {/* DETAILS */}

        <div
          className="product-detail-info"
        >

          <span
            className="product-category"
          >
            {
              product.category?.name
            }
          </span>


          <h1>
            {product.name}
          </h1>


          <div
            className="product-detail-price"
          >
            {
              formatPrice(
                product.price
              )
            }
          </div>


          <p
            className="product-description"
          >
            {
              product.description
            }
          </p>


          {/* COLOR */}

          <div
            className="product-option"
          >

            <label>
              Color
            </label>


            <div
              className="color-options"
            >

              {
                colors.map(
                  color => (

                    <button
                      key={
                        color.name
                      }
                      className={
                        selectedColor ===
                        color.name
                          ? "color-option selected"
                          : "color-option"
                      }
                      onClick={() => {

                        setSelectedColor(
                          color.name
                        );

                        setSelectedSize("");

                      }}
                    >

                      <span
                        style={{
                          background:
                            color.hex ||
                            "#ddd"
                        }}
                      />

                      {color.name}

                    </button>

                  )
                )
              }

            </div>

          </div>


          {/* SIZE */}

          <div
            className="product-option"
          >

            <label>
              Size
            </label>


            <div
              className="size-options"
            >

              {
                sizes.map(
                  variant => (

                    <button
                      key={
                        variant.id
                      }
                      disabled={
                        Number(
                          variant.quantity
                        ) === 0
                      }
                      className={
                        selectedSize ===
                        variant.size
                          ? "size-option selected"
                          : "size-option"
                      }
                      onClick={() =>
                        setSelectedSize(
                          variant.size
                        )
                      }
                    >

                      {
                        variant.size
                      }

                    </button>

                  )
                )
              }

            </div>

          </div>


          {
            selectedVariant && (

              <div
                className="stock-message"
              >

                {
                  Number(
                    selectedVariant.quantity
                  ) > 5
                    ? `${selectedVariant.quantity} available`
                    : Number(
                        selectedVariant.quantity
                      ) > 0
                      ? `Only ${selectedVariant.quantity} left`
                      : "Out of stock"
                }

              </div>

            )
          }


          <button
            className="add-cart-button"
            disabled={
              !selectedVariant ||
              Number(
                selectedVariant.quantity
              ) === 0
            }
            onClick={() => {

              alert(
                "Cart will be added in the next step."
              );

            }}
          >

            {
              selectedVariant
                ? "Add to Cart"
                : "Select a Size"
            }

          </button>

        </div>

      </div>

    </section>

  );

}


export default ProductDetails;