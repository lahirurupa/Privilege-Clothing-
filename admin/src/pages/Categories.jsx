import {
  useMemo,
  useState,
  useEffect
} from "react";

import api from "../services/api";


function Categories() {

  const [
    categories,
    setCategories
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  const [
    success,
    setSuccess
  ] = useState("");


  const [
    search,
    setSearch
  ] = useState("");


  const [
    statusFilter,
    setStatusFilter
  ] = useState("all");


  const [
    modalOpen,
    setModalOpen
  ] = useState(false);


  const [
    editingCategory,
    setEditingCategory
  ] = useState(null);


  const [
    submitting,
    setSubmitting
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Load Categories
  |--------------------------------------------------------------------------
  */

  async function loadCategories() {

    try {

      setLoading(true);

      setError("");


      const response =
        await api.get(
          "/admin/categories"
        );


      setCategories(
        response.data.categories ||
        []
      );


    } catch (error) {

      console.error(
        "LOAD CATEGORIES ERROR:",
        error
      );


      setError(
        error.response
          ?.data
          ?.message ||
        "Unable to load categories."
      );


    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    loadCategories();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Filter
  |--------------------------------------------------------------------------
  */

  const filteredCategories =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      return categories.filter(
        category => {

          const matchesSearch =
            !query ||

            category.name
              ?.toLowerCase()
              .includes(query) ||

            category.slug
              ?.toLowerCase()
              .includes(query);


          const matchesStatus =
            statusFilter ===
            "all" ||

            (
              statusFilter ===
              "active" &&
              category.is_active
            ) ||

            (
              statusFilter ===
              "inactive" &&
              !category.is_active
            );


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      categories,
      search,
      statusFilter
    ]);


  /*
  |--------------------------------------------------------------------------
  | Stats
  |--------------------------------------------------------------------------
  */

  const totalCategories =
    categories.length;


  const activeCategories =
    categories.filter(
      category =>
        category.is_active
    ).length;


  const inactiveCategories =
    categories.filter(
      category =>
        !category.is_active
    ).length;


  const totalProducts =
    categories.reduce(
      (
        total,
        category
      ) =>
        total +
        Number(
          category.product_count ||
          0
        ),
      0
    );


  /*
  |--------------------------------------------------------------------------
  | Open Create
  |--------------------------------------------------------------------------
  */

  function openCreateModal() {

    setEditingCategory(null);

    setError("");

    setSuccess("");

    setModalOpen(true);

  }


  /*
  |--------------------------------------------------------------------------
  | Open Edit
  |--------------------------------------------------------------------------
  */

  function openEditModal(
    category
  ) {

    setEditingCategory(
      category
    );

    setError("");

    setSuccess("");

    setModalOpen(true);

  }


  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  async function saveCategory(
    formData
  ) {

    try {

      setSubmitting(true);

      setError("");

      setSuccess("");


      let response;


      /*
      |--------------------------------------------------------------------------
      | Edit
      |--------------------------------------------------------------------------
      */

      if (
        editingCategory
      ) {

        response =
          await api.patch(
            `/admin/categories/${editingCategory.id}`,
            formData
          );


        const updated =
          response.data.category;


        setCategories(
          current =>
            current.map(
              category =>
                category.id ===
                updated.id
                  ? updated
                  : category
            )
        );


        setSuccess(
          "Category updated successfully."
        );

      }

      /*
      |--------------------------------------------------------------------------
      | Create
      |--------------------------------------------------------------------------
      */

      else {

        response =
          await api.post(
            "/admin/categories",
            formData
          );


        const created =
          response.data.category;


        setCategories(
          current => [
            created,
            ...current
          ]
        );


        setSuccess(
          "Category created successfully."
        );

      }


      setModalOpen(false);

      setEditingCategory(null);


    } catch (error) {

      console.error(
        "SAVE CATEGORY ERROR:",
        error
      );


      setError(
        error.response
          ?.data
          ?.message ||
        "Unable to save category."
      );


    } finally {

      setSubmitting(false);

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Toggle Active
  |--------------------------------------------------------------------------
  */

  async function toggleStatus(
    category
  ) {

    const newStatus =
      !category.is_active;


    const action =
      newStatus
        ? "activate"
        : "deactivate";


    const confirmed =
      window.confirm(
        `Are you sure you want to ${action} "${category.name}"?`
      );


    if (!confirmed) {

      return;

    }


    try {

      setError("");

      setSuccess("");


      const response =
        await api.patch(
          `/admin/categories/${category.id}`,
          {
            is_active:
              newStatus
          }
        );


      const updated =
        response.data.category;


      setCategories(
        current =>
          current.map(
            item =>
              item.id ===
              updated.id
                ? updated
                : item
          )
      );


      setSuccess(
        newStatus
          ? "Category activated successfully."
          : "Category deactivated successfully."
      );


    } catch (error) {

      console.error(
        "CATEGORY STATUS ERROR:",
        error
      );


      setError(
        error.response
          ?.data
          ?.message ||
        "Unable to change category status."
      );

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  async function deleteCategory(
    category
  ) {

    if (
      Number(
        category.product_count
      ) > 0
    ) {

      setError(
        `"${category.name}" contains products. Deactivate it instead of deleting it.`
      );

      return;

    }


    const confirmed =
      window.confirm(
        `Delete "${category.name}" permanently?\n\nThis action cannot be undone.`
      );


    if (!confirmed) {

      return;

    }


    try {

      setError("");

      setSuccess("");


      await api.delete(
        `/admin/categories/${category.id}`
      );


      setCategories(
        current =>
          current.filter(
            item =>
              item.id !==
              category.id
          )
      );


      setSuccess(
        "Category deleted successfully."
      );


    } catch (error) {

      console.error(
        "DELETE CATEGORY ERROR:",
        error
      );


      setError(
        error.response
          ?.data
          ?.message ||
        "Unable to delete category."
      );

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Date
  |--------------------------------------------------------------------------
  */

  function formatDate(
    value
  ) {

    if (!value) {

      return "-";

    }


    return new Intl.DateTimeFormat(
      "en-LK",
      {
        dateStyle:
          "medium"
      }
    ).format(
      new Date(value)
    );

  }


  return (

    <div
      className="categories-admin-page"
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="categories-header"
      >

        <div>

          <span
            className="page-eyebrow"
          >
            PRODUCT ORGANIZATION
          </span>


          <h2>
            Categories
          </h2>


          <p>
            Create and manage product categories used throughout your store.
          </p>

        </div>


        <button
          type="button"
          className="category-add-button"
          onClick={
            openCreateModal
          }
        >
          + Add Category
        </button>

      </div>


      {/* =====================================================
          MESSAGES
      ====================================================== */}

      {
        error && (

          <div
            className="category-message category-error"
          >
            {error}
          </div>

        )
      }


      {
        success && (

          <div
            className="category-message category-success"
          >
            {success}
          </div>

        )
      }


      {/* =====================================================
          STATS
      ====================================================== */}

      <div
        className="category-stat-grid"
      >

        <CategoryStat
          title="Total Categories"
          value={
            totalCategories
          }
        />


        <CategoryStat
          title="Active"
          value={
            activeCategories
          }
        />


        <CategoryStat
          title="Inactive"
          value={
            inactiveCategories
          }
        />


        <CategoryStat
          title="Assigned Products"
          value={
            totalProducts
          }
        />

      </div>


      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div
        className="category-controls"
      >

        <input
          type="text"
          placeholder="Search category..."
          value={
            search
          }
          onChange={
            event =>
              setSearch(
                event.target.value
              )
          }
        />


        <select
          value={
            statusFilter
          }
          onChange={
            event =>
              setStatusFilter(
                event.target.value
              )
          }
        >

          <option value="all">
            All Categories
          </option>


          <option value="active">
            Active
          </option>


          <option value="inactive">
            Inactive
          </option>

        </select>

      </div>


      {/* =====================================================
          TABLE
      ====================================================== */}

      <div
        className="category-table-card"
      >

        <div
          className="table-wrapper"
        >

          <table
            className="category-table"
          >

            <thead>

              <tr>

                <th>
                  Category
                </th>

                <th>
                  Slug
                </th>

                <th>
                  Products
                </th>

                <th>
                  Status
                </th>

                <th>
                  Created
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {
                loading
                  ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="category-empty"
                      >
                        Loading categories...
                      </td>

                    </tr>

                  )
                  : filteredCategories
                      .length ===
                    0
                    ? (

                      <tr>

                        <td
                          colSpan="6"
                          className="category-empty"
                        >
                          No categories found.
                        </td>

                      </tr>

                    )
                    : filteredCategories.map(
                      category => (

                        <tr
                          key={
                            category.id
                          }
                        >

                          <td>

                            <div
                              className="category-name-cell"
                            >

                              <div
                                className="category-avatar"
                              >
                                {
                                  category.name
                                    ?.charAt(0)
                                    ?.toUpperCase()
                                }
                              </div>


                              <strong>
                                {
                                  category.name
                                }
                              </strong>

                            </div>

                          </td>


                          <td>

                            <code
                              className="category-slug"
                            >
                              {
                                category.slug
                              }
                            </code>

                          </td>


                          <td>

                            <span
                              className="category-product-count"
                            >
                              {
                                category.product_count ||
                                0
                              }
                            </span>

                          </td>


                          <td>

                            <span
                              className={
                                category.is_active
                                  ? "category-status active"
                                  : "category-status inactive"
                              }
                            >

                              {
                                category.is_active
                                  ? "Active"
                                  : "Inactive"
                              }

                            </span>

                          </td>


                          <td>

                            {
                              formatDate(
                                category.created_at
                              )
                            }

                          </td>


                          <td>

                            <div
                              className="category-actions"
                            >

                              <button
                                type="button"
                                className="category-edit-button"
                                onClick={() =>
                                  openEditModal(
                                    category
                                  )
                                }
                              >
                                Edit
                              </button>


                              <button
                                type="button"
                                className={
                                  category.is_active
                                    ? "category-disable-button"
                                    : "category-enable-button"
                                }
                                onClick={() =>
                                  toggleStatus(
                                    category
                                  )
                                }
                              >

                                {
                                  category.is_active
                                    ? "Deactivate"
                                    : "Activate"
                                }

                              </button>


                              <button
                                type="button"
                                className="category-delete-button"
                                disabled={
                                  Number(
                                    category.product_count
                                  ) > 0
                                }
                                title={
                                  Number(
                                    category.product_count
                                  ) > 0
                                    ? "Category has products. Deactivate it instead."
                                    : "Delete category"
                                }
                                onClick={() =>
                                  deleteCategory(
                                    category
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )
              }

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {
        modalOpen && (

          <CategoryModal
            category={
              editingCategory
            }
            submitting={
              submitting
            }
            onSave={
              saveCategory
            }
            onClose={() => {

              if (
                !submitting
              ) {

                setModalOpen(
                  false
                );

                setEditingCategory(
                  null
                );

              }

            }}
          />

        )
      }

    </div>

  );

}


/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

function CategoryStat({
  title,
  value
}) {

  return (

    <div
      className="category-stat-card"
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


/*
|--------------------------------------------------------------------------
| Create / Edit Modal
|--------------------------------------------------------------------------
*/

function CategoryModal({

  category,

  submitting,

  onSave,

  onClose

}) {

  const [
    name,
    setName
  ] = useState(
    category?.name ||
    ""
  );


  const [
    isActive,
    setIsActive
  ] = useState(
    category
      ? category.is_active
      : true
  );


  const [
    validationError,
    setValidationError
  ] = useState("");


  function handleSubmit(
    event
  ) {

    event.preventDefault();


    const cleanName =
      name.trim();


    if (
      cleanName.length <
      2
    ) {

      setValidationError(
        "Category name must contain at least 2 characters."
      );

      return;

    }


    setValidationError("");


    onSave({

      name:
        cleanName,

      is_active:
        isActive

    });

  }


  return (

    <div
      className="category-modal-backdrop"
      onMouseDown={
        event => {

          if (
            event.target ===
            event.currentTarget &&
            !submitting
          ) {

            onClose();

          }

        }
      }
    >

      <div
        className="category-modal"
      >

        <div
          className="category-modal-header"
        >

          <div>

            <span
              className="page-eyebrow"
            >

              {
                category
                  ? "EDIT CATEGORY"
                  : "NEW CATEGORY"
              }

            </span>


            <h3>

              {
                category
                  ? "Update Category"
                  : "Create Category"
              }

            </h3>

          </div>


          <button
            type="button"
            className="category-modal-close"
            onClick={
              onClose
            }
            disabled={
              submitting
            }
          >
            ×
          </button>

        </div>


        <form
          className="category-form"
          onSubmit={
            handleSubmit
          }
        >

          {
            validationError && (

              <div
                className="category-message category-error"
              >
                {
                  validationError
                }
              </div>

            )
          }


          <label>
            Category Name *
          </label>


          <input
            type="text"
            value={
              name
            }
            onChange={
              event =>
                setName(
                  event.target.value
                )
            }
            placeholder="Example: Jackets"
            maxLength="100"
            autoFocus
            required
          />


          <small
            className="category-help"
          >
            The category slug is generated automatically.
          </small>


          <label
            className="category-active-toggle"
          >

            <input
              type="checkbox"
              checked={
                isActive
              }
              onChange={
                event =>
                  setIsActive(
                    event.target.checked
                  )
              }
            />


            <div>

              <strong>
                Active Category
              </strong>

              <span>
                Active categories are available when creating products.
              </span>

            </div>

          </label>


          <div
            className="category-form-actions"
          >

            <button
              type="button"
              className="category-cancel-button"
              onClick={
                onClose
              }
              disabled={
                submitting
              }
            >
              Cancel
            </button>


            <button
              type="submit"
              className="category-save-button"
              disabled={
                submitting
              }
            >

              {
                submitting
                  ? "Saving..."
                  : category
                    ? "Save Changes"
                    : "Create Category"
              }

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}


export default Categories;