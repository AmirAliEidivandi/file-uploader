require("dotenv").config();
require("express-async-errors");
const path = require("path");
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const { PORT, MONGO_URI, CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;
const connectDB = require("./db/connect");
const productRouter = require("./routes/productRoutes");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET,
});
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.get("/", (req, res) => {
    res.send("<h1>File Upload Starter</h1>");
});

app.use("/api/v1/products", productRouter);

// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = PORT || 3000;
const start = async () => {
    try {
        await connectDB(MONGO_URI);
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.log(error);
    }
};

start();
