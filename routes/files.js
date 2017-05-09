var express = require('express');
var multer = require('multer');
var router = express.Router();

var saveWithName = 'Noname' 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {

    saveWithName = file.fieldname + '-' + Date.now() + ".pdf";
    cb(null, saveWithName)
  }
});


var upload = multer({ storage: storage }).single('uploadedFile');

router.post('/', function (req, res) {
  upload(req, res, function (err) {
    
    if (err) {

      return res.json({success: false, msg: "Error while uploading file", name: 'no file was uploaded'});
    }
    // Everything went fine
    res.json({success: true, msg: "File Uploaded!", name: saveWithName});
    console.log(req.files);
  })
});

module.exports = router;