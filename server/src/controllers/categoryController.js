import {
  supabase
} from "../config/supabase.js";


export async function getCategories(
  req,
  res
) {

  try {

    const {
      data,
      error
    } = await supabase
      .from("categories")
      .select(
        "id, name, slug"
      )
      .eq(
        "is_active",
        true
      )
      .order(
        "name",
        {
          ascending: true
        }
      );


    if (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Unable to retrieve categories"
      });

    }


    return res.status(200).json({

      success: true,

      categories: data

    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

}