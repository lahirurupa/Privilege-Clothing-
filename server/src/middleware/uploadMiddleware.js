import multer from "multer";


const storage =
  multer.memoryStorage();


const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp"
];


function fileFilter(
  req,
  file,
  callback
) {

  if (
    !allowedMimeTypes.includes(
      file.mimetype
    )
  ) {

    const error =
      new Error(
        "Only JPG, PNG and WebP images are allowed"
      );

    error.status = 400;

    return callback(
      error,
      false
    );

  }


  callback(
    null,
    true
  );

}


export const uploadProductImages =
  multer({

    storage,

    limits: {

      fileSize:
        3 * 1024 * 1024,

      files: 5

    },

    fileFilter

  });