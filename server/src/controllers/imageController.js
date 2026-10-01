import crypto from "node:crypto";

import {
  supabase
} from "../config/supabase.js";


const BUCKET_NAME =
  "product-images";


/*
|--------------------------------------------------------------------------
| Extension helper
|--------------------------------------------------------------------------
*/

function getExtension(
  mimetype
) {

  switch (mimetype) {

    case "image/jpeg":
      return "jpg";

    case "image/png":
      return "png";

    case "image/webp":
      return "webp";

    default:
      return null;

  }

}


/*
|--------------------------------------------------------------------------
| UPLOAD PRODUCT IMAGES
|--------------------------------------------------------------------------
*/

export async function uploadImages(
  req,
  res
) {

  try {

    const productId =
      req.params.productId;


    /*
    |--------------------------------------------------------------------------
    | Check files
    |--------------------------------------------------------------------------
    */

    if (
      !req.files ||
      req.files.length === 0
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Please select at least one image"
      });

    }


    /*
    |--------------------------------------------------------------------------
    | Check product exists
    |--------------------------------------------------------------------------
    */

    const {
      data: product,
      error: productError
    } = await supabase
      .from("products")
      .select(
        "id, name"
      )
      .eq(
        "id",
        productId
      )
      .maybeSingle();


    if (productError) {

      console.error(
        "PRODUCT CHECK ERROR:",
        productError
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to check product"
      });

    }


    if (!product) {

      return res.status(404).json({
        success: false,
        message:
          "Product not found"
      });

    }


    /*
    |--------------------------------------------------------------------------
    | Get current images
    |--------------------------------------------------------------------------
    */

    const {
      data: existingImages,
      error: imageQueryError
    } = await supabase
      .from("product_images")
      .select(
        "id, display_order"
      )
      .eq(
        "product_id",
        productId
      );


    if (imageQueryError) {

      console.error(
        imageQueryError
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to check product images"
      });

    }


    /*
    |--------------------------------------------------------------------------
    | Maximum 5
    |--------------------------------------------------------------------------
    */

    if (
      existingImages.length +
      req.files.length >
      5
    ) {

      return res.status(400).json({

        success: false,

        message:
          `A product can have a maximum of 5 images. This product already has ${existingImages.length}.`

      });

    }


    /*
    |--------------------------------------------------------------------------
    | Find available display positions
    |--------------------------------------------------------------------------
    */

    const usedPositions =
      new Set(
        existingImages.map(
          image =>
            image.display_order
        )
      );


    const availablePositions = [];


    for (
      let position = 1;
      position <= 5;
      position++
    ) {

      if (
        !usedPositions.has(
          position
        )
      ) {

        availablePositions.push(
          position
        );

      }

    }


    /*
    |--------------------------------------------------------------------------
    | Keep track for cleanup
    |--------------------------------------------------------------------------
    */

    const uploadedPaths = [];

    const databaseRows = [];


    /*
    |--------------------------------------------------------------------------
    | Upload each image
    |--------------------------------------------------------------------------
    */

    for (
      let index = 0;
      index < req.files.length;
      index++
    ) {

      const file =
        req.files[index];


      const extension =
        getExtension(
          file.mimetype
        );


      if (!extension) {

        throw new Error(
          "Unsupported image type"
        );

      }


      /*
      |--------------------------------------------------------------------------
      | Random file name
      |--------------------------------------------------------------------------
      */

      const fileName =
        `${crypto.randomUUID()}.${extension}`;


      const storagePath =
        `products/${productId}/${fileName}`;


      /*
      |--------------------------------------------------------------------------
      | Upload to Supabase Storage
      |--------------------------------------------------------------------------
      */

      const {
        data: uploadData,
        error: uploadError
      } = await supabase
        .storage
        .from(
          BUCKET_NAME
        )
        .upload(
          storagePath,
          file.buffer,
          {

            contentType:
              file.mimetype,

            cacheControl:
              "3600",

            upsert:
              false

          }
        );


      if (uploadError) {

        console.error(
          "STORAGE UPLOAD ERROR:",
          uploadError
        );


        /*
        |--------------------------------------------------------------------------
        | Remove any images uploaded earlier
        |--------------------------------------------------------------------------
        */

        if (
          uploadedPaths.length >
          0
        ) {

          await supabase
            .storage
            .from(
              BUCKET_NAME
            )
            .remove(
              uploadedPaths
            );

        }


        return res.status(500).json({
          success: false,
          message:
            "Unable to upload product image"
        });

      }


      uploadedPaths.push(
        uploadData.path
      );


      /*
      |--------------------------------------------------------------------------
      | Get public URL
      |--------------------------------------------------------------------------
      */

      const {
        data: publicUrlData
      } = supabase
        .storage
        .from(
          BUCKET_NAME
        )
        .getPublicUrl(
          uploadData.path
        );


      /*
      |--------------------------------------------------------------------------
      | Prepare DB row
      |--------------------------------------------------------------------------
      */

      const displayOrder =
        availablePositions[index];


      databaseRows.push({

        product_id:
          productId,

        storage_path:
          uploadData.path,

        public_url:
          publicUrlData.publicUrl,

        alt_text:
          `${product.name} image ${displayOrder}`,

        display_order:
          displayOrder

      });

    }


    /*
    |--------------------------------------------------------------------------
    | Insert image metadata
    |--------------------------------------------------------------------------
    */

    const {
      data: images,
      error: databaseError
    } = await supabase
      .from(
        "product_images"
      )
      .insert(
        databaseRows
      )
      .select();


    if (databaseError) {

      console.error(
        "IMAGE DATABASE ERROR:",
        databaseError
      );


      /*
      |--------------------------------------------------------------------------
      | Roll back Storage uploads
      |--------------------------------------------------------------------------
      */

      await supabase
        .storage
        .from(
          BUCKET_NAME
        )
        .remove(
          uploadedPaths
        );


      return res.status(500).json({
        success: false,
        message:
          "Unable to save image information"
      });

    }


    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({

      success: true,

      message:
        "Images uploaded successfully",

      images

    });


  } catch (error) {

    console.error(
      "IMAGE UPLOAD ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Server error while uploading images"

    });

  }

}


/*
|--------------------------------------------------------------------------
| DELETE PRODUCT IMAGE
|--------------------------------------------------------------------------
*/

export async function deleteImage(
  req,
  res
) {

  try {

    const {
      productId,
      imageId
    } = req.params;


    /*
    |--------------------------------------------------------------------------
    | Find image
    |--------------------------------------------------------------------------
    */

    const {
      data: image,
      error: findError
    } = await supabase
      .from(
        "product_images"
      )
      .select(`
        id,
        product_id,
        storage_path,
        public_url,
        display_order
      `)
      .eq(
        "id",
        imageId
      )
      .eq(
        "product_id",
        productId
      )
      .maybeSingle();


    if (findError) {

      console.error(
        findError
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to find image"
      });

    }


    if (!image) {

      return res.status(404).json({
        success: false,
        message:
          "Image not found"
      });

    }


    /*
    |--------------------------------------------------------------------------
    | Delete from Storage
    |--------------------------------------------------------------------------
    */

    const {
      error: storageError
    } = await supabase
      .storage
      .from(
        BUCKET_NAME
      )
      .remove([
        image.storage_path
      ]);


    if (storageError) {

      console.error(
        "STORAGE DELETE ERROR:",
        storageError
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete image file"
      });

    }


    /*
    |--------------------------------------------------------------------------
    | Delete DB row
    |--------------------------------------------------------------------------
    */

    const {
      error: databaseError
    } = await supabase
      .from(
        "product_images"
      )
      .delete()
      .eq(
        "id",
        imageId
      );


    if (databaseError) {

      console.error(
        "IMAGE DB DELETE ERROR:",
        databaseError
      );

      return res.status(500).json({
        success: false,
        message:
          "Image file deleted but database cleanup failed"
      });

    }


    return res.status(200).json({

      success: true,

      message:
        "Image deleted successfully"

    });


  } catch (error) {

    console.error(
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Server error"

    });

  }

}