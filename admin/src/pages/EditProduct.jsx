import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../services/api";


function createId() {
  return crypto.randomUUID();
}


function createSizeRow() {

  return {
    localId: createId(),

    id: null,

    size: "",

    quantity: 0,

    sku: "",

    is_active: true
  };

}


function createColorGroup() {

  return {
    localId: createId(),

    colorName: "",

    colorHex: "#000000",

    sizes: [
      createSizeRow()
    ]
  };

}


/*
|--------------------------------------------------------------------------
| Convert API variants into color groups
|--------------------------------------------------------------------------
*/

function groupVariants(
  variants
) {

  const groups =
    new Map();


  for (
    const variant of
    variants
  ) {

    const key =
      `${variant.color_name}|${variant.color_hex || ""}`;


    if (
      !groups.has(key)
    ) {

      groups.set(
        key,
        {
          localId:
            createId(),

          colorName:
            variant.color_name,

          colorHex:
            variant.color_hex ||
            "#000000",

          sizes: []
        }
      );

    }


    groups
      .get(key)
      .sizes
      .push({

        localId:
          createId(),

        id:
          variant.id,

        size:
          variant.size,

        quantity:
          variant.quantity,

        sku:
          variant.sku,

        is_active:
          variant.is_active

      });

  }


  const result =
    Array.from(
      groups.values()
    );


  return result.length
    ? result
    : [
        createColorGroup()
      ];

}


function EditProduct() {

  const {
    id: productId
  } = useParams();


  const navigate =
    useNavigate();


  /*
  |--------------------------------------------------------------------------
  | Product
  |--------------------------------------------------------------------------
  */

  const [
    name,
    setName
  ] = useState("");


  const [
    description,
    setDescription
  ] = useState("");


  const [
    price,
    setPrice
  ] = useState("");


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
  | Variants
  |--------------------------------------------------------------------------
  */

  const [
    colors,
    setColors
  ] = useState([]);


  const [
    originalVariantIds,
    setOriginalVariantIds
  ] = useState([]);


  /*
  |--------------------------------------------------------------------------
  | Images
  |--------------------------------------------------------------------------
  */

  const [
    existingImages,
    setExistingImages
  ] = useState([]);


  const [
    deletedImageIds,
    setDeletedImageIds
  ] = useState([]);


  const [
    newImages,
    setNewImages
  ] = useState([]);


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  const [
    loading,
    setLoading
  ] = useState(true);


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
  | Load product + categories
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    async function loadData() {

      try {

        setLoading(true);


        const [
          productResponse,
          categoryResponse
        ] =
          await Promise.all([

            api.get(
              `/admin/products/${productId}`
            ),

            api.get(
              "/categories"
            )

          ]);


        const product =
          productResponse.data.product;


        setName(
          product.name || ""
        );


        setDescription(
          product.description || ""
        );


        setPrice(
          product.price || ""
        );


        setCategoryId(
          product.category?.id ||
          ""
        );


        setIsActive(
          product.is_active
        );


        const variants =
          product.variants || [];


        setColors(
          groupVariants(
            variants
          )
        );


        setOriginalVariantIds(
          variants.map(
            variant =>
              variant.id
          )
        );


        const sortedImages =
          [
            ...(product.images || [])
          ].sort(
            (a, b) =>
              a.display_order -
              b.display_order
          );


        setExistingImages(
          sortedImages
        );


        setCategories(
          categoryResponse
            .data
            .categories ||
          []
        );


      } catch (error) {

        console.error(
          error
        );


        setError(
          error.response
            ?.data
            ?.message ||
          "Unable to load product."
        );

      } finally {

        setLoading(false);

      }

    }


    loadData();

  }, [productId]);


  /*
  |--------------------------------------------------------------------------
  | Color Functions
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
            color.localId !==
            colorId
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
              color.localId !==
              colorId
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
  | Size Functions
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
              color.localId !==
              colorId
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
              color.localId !==
              colorId
            ) {

              return color;

            }


            if (
              color.sizes.length ===
              1
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
                    size.localId !==
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
              color.localId !==
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
                      size.localId !==
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
  | SKU Generator
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


    const random =
      Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();


    return (
      `${productPart}-${colorPart}-${sizePart}-${random}`
    );

  }


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
  | Existing Images
  |--------------------------------------------------------------------------
  */

  function markImageForDeletion(
    imageId
  ) {

    setDeletedImageIds(
      current => [
        ...current,
        imageId
      ]
    );


    setExistingImages(
      current =>
        current.filter(
          image =>
            image.id !==
            imageId
        )
    );

  }


  /*
  |--------------------------------------------------------------------------
  | New Images
  |--------------------------------------------------------------------------
  */

  function handleNewImages(
    event
  ) {

    const files =
      Array.from(
        event.target.files
      );


    const availableSlots =
      5 -
      existingImages.length -
      newImages.length;


    if (
      files.length >
      availableSlots
    ) {

      alert(
        `You can upload only ${availableSlots} more image(s).`
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
      const file of files
    ) {

      if (
        !allowedTypes.includes(
          file.type
        )
      ) {

        alert(
          `${file.name} is not a JPG, PNG or WebP image.`
        );

        event.target.value = "";

        return;

      }


      if (
        file.size >
        3 * 1024 * 1024
      ) {

        alert(
          `${file.name} exceeds 3 MB.`
        );

        event.target.value = "";

        return;

      }

    }


    setNewImages(
      current => [
        ...current,
        ...files
      ]
    );


    event.target.value = "";

  }


  function removeNewImage(
    index
  ) {

    setNewImages(
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
  | Flatten variants
  |--------------------------------------------------------------------------
  */

  function getVariants() {

    return colors.flatMap(
      color =>
        color.sizes.map(
          size => ({

            id:
              size.id,

            sku:
              size.sku
                .trim()
                .toUpperCase(),

            color_name:
              color.colorName
                .trim(),

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
              size.is_active

          })
        )
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  function validateForm() {

    if (
      name.trim().length <
      2
    ) {

      return (
        "Product name is required."
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


    const combinations =
      new Set();


    const skus =
      new Set();


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
            `Size is required for ${color.colorName}.`
          );

        }


        if (
          !size.sku.trim()
        ) {

          return (
            "Every variant requires a SKU."
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


        const combination =
          `${color.colorName
            .trim()
            .toLowerCase()}-${size.size
            .trim()
            .toLowerCase()}`;


        if (
          combinations.has(
            combination
          )
        ) {

          return (
            `Duplicate variant: ${color.colorName} / ${size.size}`
          );

        }


        combinations.add(
          combination
        );


        const sku =
          size.sku
            .trim()
            .toUpperCase();


        if (
          skus.has(sku)
        ) {

          return (
            `Duplicate SKU: ${sku}`
          );

        }


        skus.add(
          sku
        );

      }

    }


    return null;

  }


  /*
  |--------------------------------------------------------------------------
  | Save
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


    if (
      validationError
    ) {

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
      | 1. Update product
      |--------------------------------------------------------------------------
      */

      await api.patch(
        `/admin/products/${productId}`,
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
            isActive
        }
      );


      /*
      |--------------------------------------------------------------------------
      | 2. Work out current variants
      |--------------------------------------------------------------------------
      */

      const variants =
        getVariants();


      const currentExistingIds =
        variants
          .filter(
            variant =>
              variant.id
          )
          .map(
            variant =>
              variant.id
          );


      /*
      |--------------------------------------------------------------------------
      | 3. Delete removed variants
      |--------------------------------------------------------------------------
      */

      const variantIdsToDelete =
        originalVariantIds.filter(
          originalId =>
            !currentExistingIds.includes(
              originalId
            )
        );


      for (
        const variantId of
        variantIdsToDelete
      ) {

        await api.delete(
          `/admin/products/${productId}/variants/${variantId}`
        );

      }


      /*
      |--------------------------------------------------------------------------
      | 4. Update existing / create new
      |--------------------------------------------------------------------------
      */

      for (
        const variant of
        variants
      ) {

        const body = {

          sku:
            variant.sku,

          color_name:
            variant.color_name,

          color_hex:
            variant.color_hex,

          size:
            variant.size,

          quantity:
            variant.quantity,

          is_active:
            variant.is_active

        };


        if (
          variant.id
        ) {

          await api.patch(
            `/admin/products/${productId}/variants/${variant.id}`,
            body
          );

        } else {

          await api.post(
            `/admin/products/${productId}/variants`,
            body
          );

        }

      }


      /*
      |--------------------------------------------------------------------------
      | 5. Delete removed images
      |--------------------------------------------------------------------------
      */

      for (
        const imageId of
        deletedImageIds
      ) {

        await api.delete(
          `/admin/products/${productId}/images/${imageId}`
        );

      }


      /*
      |--------------------------------------------------------------------------
      | 6. Upload new images
      |--------------------------------------------------------------------------
      */

      if (
        newImages.length >
        0
      ) {

        const formData =
          new FormData();


        newImages.forEach(
          file => {

            formData.append(
              "images",
              file
            );

          }
        );


        await api.post(
          `/admin/products/${productId}/images`,
          formData
        );

      }


      setSuccess(
        "Product updated successfully."
      );


      setTimeout(
        () => {

          navigate(
            "/products"
          );

        },
        900
      );


    } catch (error) {

      console.error(
        error
      );


      setError(
        error.response
          ?.data
          ?.message ||
        "Unable to update product."
      );


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });


    } finally {

      setSubmitting(false);

    }

  }


  if (loading) {

    return (
      <div>
        Loading product...
      </div>
    );

  }


  if (
    error &&
    !name
  ) {

    return (
      <div
        className="error-message"
      >
        {error}
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
            Edit Product
          </h2>

          <p>
            Update product information and inventory.
          </p>

        </div>


        <button
          className="small-button"
          type="button"
          onClick={() =>
            navigate(
              "/products"
            )
          }
        >
          Back to Products
        </button>

      </div>


      {
        error && (

          <div
            className="error-message"
          >
            {error}
          </div>

        )
      }


      {
        success && (

          <div
            className="success-message"
          >
            {success}
          </div>

        )
      }


      <form
        onSubmit={
          handleSubmit
        }
      >

        {/* BASIC DETAILS */}

        <section
          className="form-card"
        >

          <div
            className="section-heading"
          >

            <h3>
              Product Details
            </h3>

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
                value={name}
                onChange={
                  event =>
                    setName(
                      event.target.value
                    )
                }
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
                Price (LKR)
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
              />

            </div>


            <div
              className="form-group"
            >

              <label>
                Status
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
                Colors, Sizes & Stock
              </h3>

              <p>
                Edit existing variants or add new ones.
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
                    color.localId
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
                              color.localId
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
                        Color Name
                      </label>

                      <input
                        value={
                          color.colorName
                        }
                        onChange={
                          event =>
                            updateColor(
                              color.localId,
                              "colorName",
                              event.target.value
                            )
                        }
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
                                color.localId,
                                "colorHex",
                                event.target.value
                              )
                          }
                        />


                        <input
                          value={
                            color.colorHex
                          }
                          onChange={
                            event =>
                              updateColor(
                                color.localId,
                                "colorHex",
                                event.target.value
                              )
                          }
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
                            Status
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
                                  size.localId
                                }
                              >

                                <td>

                                  <input
                                    value={
                                      size.size
                                    }
                                    onChange={
                                      event =>
                                        updateSize(
                                          color.localId,
                                          size.localId,
                                          "size",
                                          event.target.value
                                        )
                                    }
                                  />

                                </td>


                                <td>

                                  <input
                                    type="number"
                                    min="0"
                                    value={
                                      size.quantity
                                    }
                                    onChange={
                                      event =>
                                        updateSize(
                                          color.localId,
                                          size.localId,
                                          "quantity",
                                          event.target.value
                                        )
                                    }
                                  />

                                </td>


                                <td>

                                  <input
                                    value={
                                      size.sku
                                    }
                                    onChange={
                                      event =>
                                        updateSize(
                                          color.localId,
                                          size.localId,
                                          "sku",
                                          event.target.value
                                        )
                                    }
                                  />

                                </td>


                                <td>

                                  <select
                                    value={
                                      size.is_active
                                        ? "active"
                                        : "inactive"
                                    }
                                    onChange={
                                      event =>
                                        updateSize(
                                          color.localId,
                                          size.localId,
                                          "is_active",
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

                                </td>


                                <td>

                                  <button
                                    type="button"
                                    className="text-danger-button"
                                    onClick={() =>
                                      removeSize(
                                        color.localId,
                                        size.localId
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
                        color.localId
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
              Maximum five images in total.
            </p>

          </div>


          {
            existingImages.length >
              0 && (

              <>

                <h4>
                  Current Images
                </h4>


                <div
                  className="image-preview-grid"
                >

                  {
                    existingImages.map(
                      image => (

                        <div
                          className="image-preview-card"
                          key={
                            image.id
                          }
                        >

                          <img
                            src={
                              image.public_url
                            }
                            alt={
                              image.alt_text ||
                              name
                            }
                          />


                          <div
                            className="image-preview-info"
                          >

                            <span>
                              Image {
                                image.display_order
                              }
                            </span>

                          </div>


                          <button
                            type="button"
                            onClick={() =>
                              markImageForDeletion(
                                image.id
                              )
                            }
                          >
                            ×
                          </button>

                        </div>

                      )
                    )
                  }

                </div>

              </>

            )
          }


          {
            existingImages.length +
              newImages.length <
              5 && (

              <div
                className="image-upload-box"
                style={{
                  marginTop: "20px"
                }}
              >

                <label>
                  Add More Images
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={
                    handleNewImages
                  }
                />

              </div>

            )
          }


          {
            newImages.length >
              0 && (

              <>

                <h4>
                  New Images
                </h4>


                <div
                  className="image-preview-grid"
                >

                  {
                    newImages.map(
                      (
                        file,
                        index
                      ) => (

                        <NewImagePreview
                          key={
                            `${file.name}-${index}`
                          }
                          file={
                            file
                          }
                          index={
                            index
                          }
                          remove={
                            removeNewImage
                          }
                        />

                      )
                    )
                  }

                </div>

              </>

            )
          }

        </section>


        <div
          className="product-form-actions"
        >

          <button
            type="button"
            className="cancel-button"
            disabled={
              submitting
            }
            onClick={() =>
              navigate(
                "/products"
              )
            }
          >
            Cancel
          </button>


          <button
            className="primary-button save-product-button"
            type="submit"
            disabled={
              submitting
            }
          >

            {
              submitting
                ? "Saving..."
                : "Save Changes"
            }

          </button>

        </div>

      </form>

    </div>

  );

}


/*
|--------------------------------------------------------------------------
| New Image Preview
|--------------------------------------------------------------------------
*/

function NewImagePreview({
  file,
  index,
  remove
}) {

  const [
    preview,
    setPreview
  ] = useState("");


  useEffect(() => {

    const url =
      URL.createObjectURL(
        file
      );


    setPreview(url);


    return () =>
      URL.revokeObjectURL(
        url
      );

  }, [file]);


  return (

    <div
      className="image-preview-card"
    >

      <img
        src={preview}
        alt="New product"
      />


      <div
        className="image-preview-info"
      >

        <span>
          New Image
        </span>

      </div>


      <button
        type="button"
        onClick={() =>
          remove(index)
        }
      >
        ×
      </button>

    </div>

  );

}


export default EditProduct;