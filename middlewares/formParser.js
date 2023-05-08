const formidable = require("formidable");
const { file } = require("googleapis/build/src/apis/file");
const { ValidationError } = require("../controllers/errors");

const formParser = async (req, res, next) => {
  const form = formidable({ multiples: true });
  const acceptedFormats = new Set(["image/jpeg", "image/jpg", "image/png"]);
  const parsedReq = await form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({
        error: { msg: "Couldn't parse the form. Try again later" },
      });
    }

    Object.keys(files).forEach((fileName) => {
      const file = files[fileName];
      if (file.type) {
        if (!acceptedFormats.has(file.type)) {
          return next(
            new ValidationError("id card", "Unacceptable file format")
          );
        }
      } else {
        delete files[fileName];
      }
    });

    req.body = { ...files, ...fields, ...req.body };
    next();
  });
  if (parsedReq.type == "json") {
    next();
  }
};

module.exports = formParser;
