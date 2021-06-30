const multer = require('multer');  // used for image upload
const path = require('path');

// For Image upload
const storage = multer.diskStorage({
  destination: './public/uploads', // Destination to store image 
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
  }
});

// upload is middleware
exports.productImgUpload = multer({
  storage: storage,
  limits: {
      fileSize: 1000000 // This is Bytes (1 MB)
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {  // For a single extension -> !file.originalname.endsWith('.jpg')
          return cb(new Error('Please upload a Image'))
      }
      cb(undefined, true)
      // cb(new Error('File must be a JPG'));
  }
}).single('product_img');
