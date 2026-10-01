import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import api from "../services/api";


function createId() {

  return crypto.randomUUID();

}


function createSizeRow() {

  return {
    id: createId(),
    size: "",
    quantity: 0,
    sku: ""
  };

}


function createColorGroup() {

  return {
    id: createId(),
    colorName: "",
    colorHex: "#000000",
    sizes: [
      createSizeRow()
    ]
  };

}


function AddProduct() {

  const navigate =
    useNavigate();


  /*
  |--------------------------------------------------------------------------
  | Basic Product
  |--------------------------------------------------------------------------
  */

  const [name, setName] =
    useState("");

  const [
    description,
    setDescription
  ] = useState("");

  const [price, setPrice] =
    useState("");

  const [
    categoryId,
    setCategoryId
  ] = useState("");

  const [
    isActive,
    setIsActive
  ] = useState(true);


  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const [
    categories,
    setCategories
  ] = useState([]);


  /*
  |--------------------------------------------------------------------------
  | Colors / Sizes
  |--------------------------------------------------------------------------
  */

  const [
    colors,
    setColors
  ] = useState([
    createColorGroup()
  ]);


  /*
  |--------------------------------------------------------------------------
  | Images
  |--------------------------------------------------------------------------
  */

  const [
    images,
    setImages
  ] = useState([]);


  /*
  |--------------------------------------------------------------------------
  | UI State
  |--------------------------------------------------------------------------
  */

  const [
    submitting,
    setSubmitting
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");

  const [
    success,
    setSuccess
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Load Categories
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    async function loadCategories() {

      try {

        const response =
          await api.get(
            "/categories"
          );


        setCategories(
          response.data.categories ||
          []
        );

      } catch (error) {

        console.error(error);

        setError(
          "Unable to load categories."
        );

      }

    }


    loadCategories();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Color
  |--------------------------------------------------------------------------
  */

  function addColor() {

    setColors(
      current => [
        ...current,
        createColorGroup()
      ]
    );

  }


  function removeColor(
    colorId
  ) {

    if (
      colors.length === 1
    ) {

      alert(
        "A product must have at least one color."
      );

      return;

    }


    setColors(
      current =>
        current.filter(
          color =>
            color.id !== colorId
        )
    );

  }


  function updateColor(
    colorId,
    field,
    value
  ) {

    setColors(
      current =>
        current.map(
          color => {

            if (
              color.id !== colorId
            ) {

              return color;

            }


            return {
              ...color,
              [field]: value
            };

          }
        )
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Size
  |--------------------------------------------------------------------------
  */

  function addSize(
    colorId
  ) {

    setColors(
      current =>
        current.map(
          color => {

            if (
              color.id !== colorId
            ) {

              return color;

            }


            return {

              ...color,

              sizes: [
                ...color.sizes,
                createSizeRow()
              ]

            };

          }
        )
    );

  }


  function removeSize(
    colorId,
    sizeId
  ) {

    setColors(
      current =>
        current.map(
          color => {

            if (
              color.id !== colorId
            ) {

              return color;

            }


            if (
              color.sizes.length === 1
            ) {

              alert(
                "Each color must contain at least one size."
              );

              return color;

            }


            return {

              ...color,

              sizes:
                color.sizes.filter(
                  size =>
                    size.id !==
                    sizeId
                )

            };

          }
        )
    );

  }


  function updateSize(
    colorId,
    sizeId,
    field,
    value
  ) {

    setColors(
      current =>
        current.map(
          color => {

            if (
              color.id !==
              colorId
            ) {

              return color;

            }


            return {

              ...color,

              sizes:
                color.sizes.map(
                  size => {

                    if (
                      size.id !==
                      sizeId
                    ) {

                      return size;

                    }


                    return {
                      ...size,
                      [field]: value
                    };

                  }
                )

            };

          }
        )
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Auto Generate SKU
  |--------------------------------------------------------------------------
  */

  function generateSku(
    colorName,
    size
  ) {

    const productPart =
      name
        .trim()
        .toUpperCase()
        .split(/\s+/)
        .map(
          word =>
            word[0]
        )
        .join("")
        .slice(0, 4) ||
      "PRV";


    const colorPart =
      colorName
        .trim()
        .toUpperCase()
        .replace(
          /[^A-Z0-9]/g,
          ""
        )
        .slice(0, 3) ||
      "CLR";


    const sizePart =
      size
        .trim()
        .toUpperCase()
        .replace(
          /[^A-Z0-9]/g,
          ""
        ) ||
      "SIZE";


    const randomPart =
      Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();


    return (
      `${productPart}-${colorPart}-${sizePart}-${randomPart}`
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Generate missing SKUs
  |--------------------------------------------------------------------------
  */

  function generateMissingSkus() {

    setColors(
      current =>
        current.map(
          color => ({

            ...color,

            sizes:
              color.sizes.map(
                size => ({

                  ...size,

                  sku:
                    size.sku ||
                    generateSku(
                      color.colorName,
                      size.size
                    )

                })
              )

          })
        )
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Images
  |--------------------------------------------------------------------------
  */

  function handleImages(
    event
  ) {

    const selectedFiles =
      Array.from(
        event.target.files
      );


    if (
      selectedFiles.length >
      5
    ) {

      alert(
        "Maximum 5 images are allowed."
      );

      event.target.value = "";

      return;

    }


    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];


    for (
      const file of
      selectedFiles
    ) {

      if (
        !allowedTypes.includes(
          file.type
        )
      ) {

        alert(
          `${file.name} is not a supported image type.`
        );

        event.target.value = "";

        return;

      }


      if (
        file.size >
        3 * 1024 * 1024
      ) {

        alert(
          `${file.name} is larger than 3 MB.`
        );

        event.target.value = "";

        return;

      }

    }


    setImages(
      selectedFiles
    );

  }


  function removeImage(
    index
  ) {

    setImages(
      current =>
        current.filter(
          (_, currentIndex) =>
            currentIndex !==
            index
        )
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Convert UI to API variants
  |--------------------------------------------------------------------------
  */

  function buildVariants() {

    return colors.flatMap(
      color => {

        return color.sizes.map(
          size => ({

            sku:
              size.sku
                .trim()
                .toUpperCase(),

            color_name:
              color.colorName.trim(),

            color_hex:
              color.colorHex,

            size:
              size.size
                .trim()
                .toUpperCase(),

            quantity:
              Number(
                size.quantity
              ),

            is_active:
              true

          })
        );

      }
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Client Validation
  |--------------------------------------------------------------------------
  */

  function validateForm() {

    if (
      name.trim().length < 2
    ) {

      return (
        "Please enter a product name."
      );

    }


    if (!categoryId) {

      return (
        "Please select a category."
      );

    }


    if (
      price === "" ||
      Number(price) < 0
    ) {

      return (
        "Please enter a valid price."
      );

    }


    for (
      const color of colors
    ) {

      if (
        !color.colorName.trim()
      ) {

        return (
          "Every color must have a name."
        );

      }


      for (
        const size of
        color.sizes
      ) {

        if (
          !size.size.trim()
        ) {

          return (
            `Please select a size for ${color.colorName}.`
          );

        }


        if (
          Number(
            size.quantity
          ) < 0
        ) {

          return (
            "Quantity cannot be negative."
          );

        }


        if (
          !size.sku.trim()
        ) {

          return (
            "Every variant must have a SKU. You can use Generate Missing SKUs."
          );

        }

      }

    }


    /*
    |--------------------------------------------------------------------------
    | Detect duplicate color + size
    |--------------------------------------------------------------------------
    */

    const combinations =
      new Set();


    for (
      const color of colors
    ) {

      for (
        const size of
        color.sizes
      ) {

        const key =
          `${color.colorName
            .trim()
            .toLowerCase()}-${size.size
            .trim()
            .toLowerCase()}`;


        if (
          combinations.has(key)
        ) {

          return (
            `Duplicate variant found: ${color.colorName} / ${size.size}`
          );

        }


        combinations.add(
          key
        );

      }

    }


    /*
    |--------------------------------------------------------------------------
    | Detect duplicate SKUs
    |--------------------------------------------------------------------------
    */

    const skuSet =
      new Set();


    for (
      const color of colors
    ) {

      for (
        const size of
        color.sizes
      ) {

        const sku =
          size.sku
            .trim()
            .toUpperCase();


        if (
          skuSet.has(sku)
        ) {

          return (
            `Duplicate SKU found: ${sku}`
          );

        }


        skuSet.add(
          sku
        );

      }

    }


    return null;

  }


  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(
    event
  ) {

    event.preventDefault();


    setError("");
    setSuccess("");


    const validationError =
      validateForm();


    if (validationError) {

      setError(
        validationError
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      return;

    }


    try {

      setSubmitting(true);


      /*
      |--------------------------------------------------------------------------
      | STEP 1 - Create Product
      |--------------------------------------------------------------------------
      */

      const variants =
        buildVariants();


      const productResponse =
        await api.post(
          "/admin/products",
          {

            name:
              name.trim(),

            description:
              description.trim(),

            category_id:
              categoryId,

            price:
              Number(price),

            is_active:
              isActive,

            variants

          }
        );


      const createdProduct =
        productResponse.data.product;


      const productId =
        createdProduct.id;


      /*
      |--------------------------------------------------------------------------
      | STEP 2 - Upload Images
      |--------------------------------------------------------------------------
      */

      if (
        images.length > 0
      ) {

        const formData =
          new FormData();


        images.forEach(
          file => {

            formData.append(
              "images",
              file
            );

          }
        );


        try {

          await api.post(
            `/admin/products/${productId}/images`,
            formData
          );

        } catch (
          imageError
        ) {

          console.error(
            imageError
          );


          setSuccess(
            "Product was created successfully, but one or more images could not be uploaded."
          );


          setTimeout(
            () => {

              navigate(
                "/products"
              );

            },
            1800
          );


          return;

        }

      }


      /*
      |--------------------------------------------------------------------------
      | Complete
      |--------------------------------------------------------------------------
      */

      setSuccess(
        "Product created successfully."
      );


      setTimeout(
        () => {

          navigate(
            "/products"
          );

        },
        1000
      );


    } catch (error) {

      console.error(
        error
      );


      const response =
        error.response?.data;


      if (
        response?.errors
      ) {

        const messages =
          response.errors
            .map(
              item =>
                item.message
            )
            .join(" ");


        setError(
          messages ||
          response.message
        );

      } else {

        setError(
          response?.message ||
          "Unable to create product."
        );

      }


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });


    } finally {

      setSubmitting(false);

    }

  }


  return (

    <div>

      {/* PAGE TITLE */}

      <div
        className="page-heading"
      >

        <div>

          <h2>
            Add Product
          </h2>

          <p>
            Create a new clothing item and configure its inventory.
          </p>

        </div>


        <button
          type="button"
          className="small-button"
          onClick={() =>
            navigate(
              "/products"
            )
          }
        >
          Back to Products
        </button>

      </div>


      {error && (

        <div
          className="error-message"
        >
          {error}
        </div>

      )}


      {success && (

        <div
          className="success-message"
        >
          {success}
        </div>

      )}


      <form
        onSubmit={
          handleSubmit
        }
      >

        {/* PRODUCT DETAILS */}

        <section
          className="form-card"
        >

          <div
            className="section-heading"
          >

            <h3>
              Product Details
            </h3>

            <p>
              Basic information shown on the clothing website.
            </p>

          </div>


          <div
            className="form-grid"
          >

            <div
              className="form-group"
            >

              <label>
                Product Name *
              </label>

              <input
                type="text"
                value={name}
                onChange={
                  event =>
                    setName(
                      event.target.value
                    )
                }
                placeholder="Privilege Oversized T-Shirt"
              />

            </div>


            <div
              className="form-group"
            >

              <label>
                Category *
              </label>

              <select
                value={
                  categoryId
                }
                onChange={
                  event =>
                    setCategoryId(
                      event.target.value
                    )
                }
              >

                <option value="">
                  Select category
                </option>

                {
                  categories.map(
                    category => (

                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >
                        {category.name}
                      </option>

                    )
                  )
                }

              </select>

            </div>


            <div
              className="form-group"
            >

              <label>
                Price (LKR) *
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={
                  event =>
                    setPrice(
                      event.target.value
                    )
                }
                placeholder="4500"
              />

            </div>


            <div
              className="form-group"
            >

              <label>
                Product Status
              </label>

              <select
                value={
                  isActive
                    ? "active"
                    : "inactive"
                }
                onChange={
                  event =>
                    setIsActive(
                      event.target.value ===
                      "active"
                    )
                }
              >

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>

              </select>

            </div>


            <div
              className="form-group form-full"
            >

              <label>
                Description
              </label>

              <textarea
                rows="6"
                value={
                  description
                }
                onChange={
                  event =>
                    setDescription(
                      event.target.value
                    )
                }
                placeholder="Describe the material, fit, style and other important product details..."
              />

            </div>

          </div>

        </section>


        {/* INVENTORY */}

        <section
          className="form-card"
        >

          <div
            className="section-heading inventory-heading"
          >

            <div>

              <h3>
                Colors, Sizes & Inventory
              </h3>

              <p>
                Every color and size combination has its own stock quantity and SKU.
              </p>

            </div>


            <button
              type="button"
              className="small-button"
              onClick={
                generateMissingSkus
              }
            >
              Generate Missing SKUs
            </button>

          </div>


          {
            colors.map(
              (
                color,
                colorIndex
              ) => (

                <div
                  className="color-card"
                  key={
                    color.id
                  }
                >

                  <div
                    className="color-header"
                  >

                    <h4>
                      Color {colorIndex + 1}
                    </h4>


                    {
                      colors.length >
                      1 && (

                        <button
                          type="button"
                          className="text-danger-button"
                          onClick={() =>
                            removeColor(
                              color.id
                            )
                          }
                        >
                          Remove Color
                        </button>

                      )
                    }

                  </div>


                  <div
                    className="color-details-grid"
                  >

                    <div
                      className="form-group"
                    >

                      <label>
                        Color Name *
                      </label>

                      <input
                        type="text"
                        value={
                          color.colorName
                        }
                        onChange={
                          event =>
                            updateColor(
                              color.id,
                              "colorName",
                              event.target.value
                            )
                        }
                        placeholder="Black"
                      />

                    </div>


                    <div
                      className="form-group"
                    >

                      <label>
                        Color
                      </label>

                      <div
                        className="color-picker-row"
                      >

                        <input
                          className="color-picker"
                          type="color"
                          value={
                            color.colorHex
                          }
                          onChange={
                            event =>
                              updateColor(
                                color.id,
                                "colorHex",
                                event.target.value
                              )
                          }
                        />

                        <input
                          type="text"
                          value={
                            color.colorHex
                          }
                          onChange={
                            event =>
                              updateColor(
                                color.id,
                                "colorHex",
                                event.target.value
                              )
                          }
                          placeholder="#000000"
                        />

                      </div>

                    </div>

                  </div>


                  <div
                    className="variant-table-wrapper"
                  >

                    <table
                      className="variant-table"
                    >

                      <thead>

                        <tr>

                          <th>
                            Size
                          </th>

                          <th>
                            Quantity
                          </th>

                          <th>
                            SKU
                          </th>

                          <th>
                            Action
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {
                          color.sizes.map(
                            size => (

                              <tr
                                key={
                                  size.id
                                }
                              >

                                <td>

                                  <input
                                    type="text"
                                    value={
                                      size.size
                                    }
                                    onChange={
                                      event =>
                                        updateSize(
                                          color.id,
                                          size.id,
                                          "size",
                                          event.target.value
                                        )
                                    }
                                    placeholder="S / M / L"
                                  />

                                </td>


                                <td>

                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={
                                      size.quantity
                                    }
                                    onChange={
                                      event =>
                                        updateSize(
                                          color.id,
                                          size.id,
                                          "quantity",
                                          event.target.value
                                        )
                                    }
                                  />

                                </td>


                                <td>

                                  <input
                                    type="text"
                                    value={
                                      size.sku
                                    }
                                    onChange={
                                      event =>
                                        updateSize(
                                          color.id,
                                          size.id,
                                          "sku",
                                          event.target.value
                                        )
                                    }
                                    placeholder="PRV-BLK-M"
                                  />

                                </td>


                                <td>

                                  <button
                                    type="button"
                                    className="text-danger-button"
                                    onClick={() =>
                                      removeSize(
                                        color.id,
                                        size.id
                                      )
                                    }
                                  >
                                    Remove
                                  </button>

                                </td>

                              </tr>

                            )
                          )
                        }

                      </tbody>

                    </table>

                  </div>


                  <button
                    type="button"
                    className="small-button add-size-button"
                    onClick={() =>
                      addSize(
                        color.id
                      )
                    }
                  >
                    + Add Size
                  </button>

                </div>

              )
            )
          }


          <button
            type="button"
            className="secondary-button"
            onClick={
              addColor
            }
          >
            + Add Another Color
          </button>

        </section>


        {/* IMAGES */}

        <section
          className="form-card"
        >

          <div
            className="section-heading"
          >

            <h3>
              Product Images
            </h3>

            <p>
              Upload up to five JPG, PNG or WebP images. Maximum 3 MB each.
            </p>

          </div>


          <div
            className="image-upload-box"
          >

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={
                handleImages
              }
            />

          </div>


          {
            images.length >
            0 && (

              <div
                className="image-preview-grid"
              >

                {
                  images.map(
                    (
                      file,
                      index
                    ) => (

                      <ImagePreview
                        key={
                          `${file.name}-${index}`
                        }
                        file={
                          file
                        }
                        index={
                          index
                        }
                        onRemove={
                          removeImage
                        }
                      />

                    )
                  )
                }

              </div>

            )
          }

        </section>


        {/* SUBMIT */}

        <div
          className="product-form-actions"
        >

          <button
            type="button"
            className="cancel-button"
            onClick={() =>
              navigate(
                "/products"
              )
            }
            disabled={
              submitting
            }
          >
            Cancel
          </button>


          <button
            type="submit"
            className="primary-button save-product-button"
            disabled={
              submitting
            }
          >

            {
              submitting
                ? "Creating Product..."
                : "Create Product"
            }

          </button>

        </div>

      </form>

    </div>

  );

}


/*
|--------------------------------------------------------------------------
| Image Preview
|--------------------------------------------------------------------------
*/

function ImagePreview({
  file,
  index,
  onRemove
}) {

  const [
    preview,
    setPreview
  ] = useState("");


  useEffect(() => {

    const objectUrl =
      URL.createObjectURL(
        file
      );


    setPreview(
      objectUrl
    );


    return () => {

      URL.revokeObjectURL(
        objectUrl
      );

    };

  }, [file]);


  return (

    <div
      className="image-preview-card"
    >

      <img
        src={preview}
        alt={
          `Preview ${index + 1}`
        }
      />


      <div
        className="image-preview-info"
      >

        <span>
          Image {index + 1}
        </span>

        <small>
          {
            (
              file.size /
              1024 /
              1024
            ).toFixed(2)
          }{" "}
          MB
        </small>

      </div>


      <button
        type="button"
        onClick={() =>
          onRemove(
            index
          )
        }
      >
        ×
      </button>

    </div>

  );

}


export default AddProduct;