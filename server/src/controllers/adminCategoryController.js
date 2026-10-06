import {
  randomUUID
} from "crypto";

import {
  supabase
} from "../config/supabase.js";

import {
  createCategorySchema,
  updateCategorySchema
} from "../validators/categoryValidator.js";


/*
|--------------------------------------------------------------------------
| Create Slug
|--------------------------------------------------------------------------
*/

function slugify(
  value
) {

  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );

}


/*
|--------------------------------------------------------------------------
| Generate Unique Category Slug
|--------------------------------------------------------------------------
*/

async function generateUniqueSlug(
  name,
  excludeId = null
) {

  let baseSlug =
    slugify(name);


  if (!baseSlug) {

    baseSlug =
      `category-${randomUUID().slice(0, 6)}`;

  }


  let query =
    supabase
      .from("categories")
      .select("id")
      .eq(
        "slug",
        baseSlug
      );


  if (excludeId) {

    query =
      query.neq(
        "id",
        excludeId
      );

  }


  const {
    data,
    error
  } =
    await query
      .maybeSingle();


  if (error) {

    throw error;

  }


  if (!data) {

    return baseSlug;

  }


  return (
    `${baseSlug}-${randomUUID().slice(0, 6)}`
  );

}


/*
|--------------------------------------------------------------------------
| GET ALL CATEGORIES
|--------------------------------------------------------------------------
|
| GET /api/admin/categories
|
*/

export async function getAdminCategories(
  req,
  res
) {

  try {

    const {
      data,
      error
    } = await supabase
      .from("categories")
      .select(`
        id,
        name,
        slug,
        is_active,
        created_at,
        updated_at
      `)
      .order(
        "created_at",
        {
          ascending: false
        }
      );


    if (error) {

      console.error(
        "GET ADMIN CATEGORIES ERROR:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to retrieve categories"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Add Product Count
    |--------------------------------------------------------------------------
    */

    const categoriesWithCounts =
      await Promise.all(

        (data || []).map(
          async category => {

            const {
              count,
              error:
                countError
            } =
              await supabase
                .from("products")
                .select(
                  "id",
                  {
                    count:
                      "exact",

                    head:
                      true
                  }
                )
                .eq(
                  "category_id",
                  category.id
                );


            if (countError) {

              console.error(
                "CATEGORY PRODUCT COUNT ERROR:",
                countError
              );

            }


            return {

              ...category,

              product_count:
                count || 0

            };

          }
        )

      );


    return res
      .status(200)
      .json({

        success: true,

        count:
          categoriesWithCounts.length,

        categories:
          categoriesWithCounts

      });


  } catch (error) {

    console.error(
      "GET ADMIN CATEGORIES ERROR:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Server error while retrieving categories"

      });

  }

}


/*
|--------------------------------------------------------------------------
| GET ONE CATEGORY
|--------------------------------------------------------------------------
|
| GET /api/admin/categories/:id
|
*/

export async function getAdminCategory(
  req,
  res
) {

  try {

    const {
      data: category,
      error
    } = await supabase
      .from("categories")
      .select(`
        id,
        name,
        slug,
        is_active,
        created_at,
        updated_at
      `)
      .eq(
        "id",
        req.params.id
      )
      .maybeSingle();


    if (error) {

      console.error(
        "GET ADMIN CATEGORY ERROR:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to retrieve category"

        });

    }


    if (!category) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            "Category not found"

        });

    }


    const {
      count
    } = await supabase
      .from("products")
      .select(
        "id",
        {
          count: "exact",
          head: true
        }
      )
      .eq(
        "category_id",
        category.id
      );


    return res.json({

      success: true,

      category: {

        ...category,

        product_count:
          count || 0

      }

    });


  } catch (error) {

    console.error(
      "GET ADMIN CATEGORY ERROR:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Server error"

      });

  }

}


/*
|--------------------------------------------------------------------------
| CREATE CATEGORY
|--------------------------------------------------------------------------
|
| POST /api/admin/categories
|
*/

export async function createAdminCategory(
  req,
  res
) {

  try {

    const validation =
      createCategorySchema.safeParse(
        req.body
      );


    if (
      !validation.success
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "Validation failed",

          errors:
            validation
              .error
              .issues

        });

    }


    const {
      name,
      is_active
    } = validation.data;


    /*
    |--------------------------------------------------------------------------
    | Check Name
    |--------------------------------------------------------------------------
    */

    const {
      data: existing,
      error:
        existingError
    } =
      await supabase
        .from("categories")
        .select(`
          id,
          name
        `)
        .eq(
          "name",
          name
        )
        .maybeSingle();


    if (existingError) {

      throw existingError;

    }


    if (existing) {

      return res
        .status(409)
        .json({

          success: false,

          message:
            "A category with this name already exists"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Generate Slug
    |--------------------------------------------------------------------------
    */

    const slug =
      await generateUniqueSlug(
        name
      );


    /*
    |--------------------------------------------------------------------------
    | Insert
    |--------------------------------------------------------------------------
    */

    const {
      data: category,
      error
    } = await supabase
      .from("categories")
      .insert({

        name,

        slug,

        is_active

      })
      .select(`
        id,
        name,
        slug,
        is_active,
        created_at,
        updated_at
      `)
      .single();


    if (error) {

      console.error(
        "CREATE CATEGORY ERROR:",
        error
      );


      if (
        error.code ===
        "23505"
      ) {

        return res
          .status(409)
          .json({

            success: false,

            message:
              "Category already exists"

          });

      }


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to create category"

        });

    }


    return res
      .status(201)
      .json({

        success: true,

        message:
          "Category created successfully",

        category: {

          ...category,

          product_count: 0

        }

      });


  } catch (error) {

    console.error(
      "CREATE CATEGORY ERROR:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Server error while creating category"

      });

  }

}


/*
|--------------------------------------------------------------------------
| UPDATE CATEGORY
|--------------------------------------------------------------------------
|
| PATCH /api/admin/categories/:id
|
*/

export async function updateAdminCategory(
  req,
  res
) {

  try {

    const categoryId =
      req.params.id;


    const validation =
      updateCategorySchema.safeParse(
        req.body
      );


    if (
      !validation.success
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "Validation failed",

          errors:
            validation
              .error
              .issues

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Find Existing Category
    |--------------------------------------------------------------------------
    */

    const {
      data: existingCategory,
      error:
        findError
    } =
      await supabase
        .from("categories")
        .select(`
          id,
          name,
          slug,
          is_active
        `)
        .eq(
          "id",
          categoryId
        )
        .maybeSingle();


    if (findError) {

      throw findError;

    }


    if (!existingCategory) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            "Category not found"

        });

    }


    const updates = {};


    /*
    |--------------------------------------------------------------------------
    | Name
    |--------------------------------------------------------------------------
    */

    if (
      validation.data.name !==
      undefined
    ) {

      const newName =
        validation.data.name;


      /*
      |--------------------------------------------------------------------------
      | Check Duplicate Name
      |--------------------------------------------------------------------------
      */

      const {
        data:
          duplicateCategory,
        error:
          duplicateError
      } =
        await supabase
          .from("categories")
          .select("id")
          .eq(
            "name",
            newName
          )
          .neq(
            "id",
            categoryId
          )
          .maybeSingle();


      if (duplicateError) {

        throw duplicateError;

      }


      if (duplicateCategory) {

        return res
          .status(409)
          .json({

            success: false,

            message:
              "A category with this name already exists"

          });

      }


      updates.name =
        newName;


      /*
      |--------------------------------------------------------------------------
      | Update Slug when Name Changes
      |--------------------------------------------------------------------------
      */

      if (
        newName !==
        existingCategory.name
      ) {

        updates.slug =
          await generateUniqueSlug(
            newName,
            categoryId
          );

      }

    }


    /*
    |--------------------------------------------------------------------------
    | Active Status
    |--------------------------------------------------------------------------
    */

    if (
      validation.data
        .is_active !==
      undefined
    ) {

      updates.is_active =
        validation.data
          .is_active;

    }


    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    const {
      data: category,
      error
    } = await supabase
      .from("categories")
      .update(
        updates
      )
      .eq(
        "id",
        categoryId
      )
      .select(`
        id,
        name,
        slug,
        is_active,
        created_at,
        updated_at
      `)
      .single();


    if (error) {

      console.error(
        "UPDATE CATEGORY ERROR:",
        error
      );


      if (
        error.code ===
        "23505"
      ) {

        return res
          .status(409)
          .json({

            success: false,

            message:
              "Category name or slug already exists"

          });

      }


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to update category"

        });

    }


    const {
      count
    } = await supabase
      .from("products")
      .select(
        "id",
        {
          count: "exact",
          head: true
        }
      )
      .eq(
        "category_id",
        categoryId
      );


    return res.json({

      success: true,

      message:
        "Category updated successfully",

      category: {

        ...category,

        product_count:
          count || 0

      }

    });


  } catch (error) {

    console.error(
      "UPDATE CATEGORY ERROR:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Server error while updating category"

      });

  }

}


/*
|--------------------------------------------------------------------------
| DELETE CATEGORY
|--------------------------------------------------------------------------
|
| DELETE /api/admin/categories/:id
|
| Only unused categories can be physically deleted.
|
*/

export async function deleteAdminCategory(
  req,
  res
) {

  try {

    const categoryId =
      req.params.id;


    /*
    |--------------------------------------------------------------------------
    | Find Category
    |--------------------------------------------------------------------------
    */

    const {
      data: category,
      error:
        findError
    } =
      await supabase
        .from("categories")
        .select(`
          id,
          name
        `)
        .eq(
          "id",
          categoryId
        )
        .maybeSingle();


    if (findError) {

      throw findError;

    }


    if (!category) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            "Category not found"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Check Products
    |--------------------------------------------------------------------------
    */

    const {
      count,
      error:
        countError
    } =
      await supabase
        .from("products")
        .select(
          "id",
          {
            count: "exact",
            head: true
          }
        )
        .eq(
          "category_id",
          categoryId
        );


    if (countError) {

      throw countError;

    }


    /*
    |--------------------------------------------------------------------------
    | Prevent Deleting Used Category
    |--------------------------------------------------------------------------
    */

    if (
      Number(
        count || 0
      ) > 0
    ) {

      return res
        .status(409)
        .json({

          success: false,

          message:
            `This category contains ${count} product(s). Deactivate it instead of deleting it.`

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const {
      error
    } = await supabase
      .from("categories")
      .delete()
      .eq(
        "id",
        categoryId
      );


    if (error) {

      console.error(
        "DELETE CATEGORY ERROR:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to delete category"

        });

    }


    return res.json({

      success: true,

      message:
        "Category deleted successfully"

    });


  } catch (error) {

    console.error(
      "DELETE CATEGORY ERROR:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Server error while deleting category"

      });

  }

}