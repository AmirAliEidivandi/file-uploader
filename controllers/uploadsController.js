const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const cloudinary = require("cloudinary").v2;

exports.uploadProductImageLocal = async (req, res) => {
    if (!req.files) {
        throw new CustomError.BadRequestError("No File Uploaded");
    }

    const productImage = req.files.image;
    if (!productImage.mimetype.startsWith("image")) {
        throw new CustomError.BadRequestError("Please Upload image");
    }

    const maxSize = 1024 * 1024;
    if (productImage.size > maxSize) {
        throw new CustomError.BadRequestError("Please Upload image smaller 1KB");
    }

    const imagePath = path.join(__dirname, "../public/uploads/" + `${productImage.name}`);

    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: { src: `/uploads/${productImage.name}` } });
};

exports.uploadProductImage = async (req, res) => {
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        use_filename: true,
        folder: "file-uploader",
    });
    fs.unlinkSync(req.files.image.tempFilePath);

    res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};
