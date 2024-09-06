/*
    OBTAINING DATA FROM A MULTI-PART FORM USING MULTER

    1. What is Multipart formdata?
      Multipart form-data is an encoding used in forms which handle multiple types of data such as files, texts, binary data etc. The `Content-Type` header for a multipart formdata is usuallly given to be "multipart/form-data".

    2. What is Multer and how does it handle multipart/form-data?
      - Multer is a NodeJS middleware that is used to handle data (both textual and files) from a form that is encoded as `multipart/form-data`. 
      - It extracts the files/text from the form and gives a `req.file` or `req.files` object to the HTTP req object for access. 
      - After extracting the files, Multer stores the files either in the memory of the disk-storage (with unique filenames) depending upon the configuration set by the backend developer.
*/

import multer from "multer";

// Storage configuration of multer middleware
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/temp"); // store the files in the "public/temp" directory
  },
  filename: (req, file, callback) => {
    const customFileName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}`; // custom file name to avoid naming conflicts (BTW, Multer by default avoids naming conflicts by giving unique names to the files)
    callback(null, customFileName);
  },
});

const upload = multer({ storage });

// Middleware of uploading using Multer along with handling errors
const multerUpload = (req, res, next) => {
  upload.fields([
    {
      name: "product_images",
      maxCount: 3,
    },
  ])(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        statusCode: 400,
        message: "MULTER UPLOAD ERROR || ONLY 3 FILES CAN BE UPLOADED",
        errors: error.errors,
        success: false,
      });
    } else if (error) {
      return res.status(500).json({
        statusCode: 500,
        message: "MULTER UPLOAD ERROR || SOME UNKNOWN ERROR OCCURED AT OUR END",
        errors: error.errors,
        success: false,
      });
    }
    next();// Pass control to the next middleware
  });
};

export default multerUpload;
