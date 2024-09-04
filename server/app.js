require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const http = require("http");
const setupSocket = require("./socket");

const authRoutes = require("./middleware/auth");
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const messageRoutes = require("./routes/message");

const app = express();
const server = http.createServer(app);

const MONGODB_URL =
  "mongodb+srv://mobtfx20699:4Xl3crxpYiPgeD0N@cluster0.jwejjpq.mongodb.net/nodeapp";

app.use(express.json());

// Configure session
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
    // secure: true,
    store: MongoStore.create({
      mongoUrl: MONGODB_URL,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // Session expiry time (7 days)
    },
  })
);
// Cors policy
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow only 4 kinds of requests
    credentials: true, // Allow cookies to be sent along with requests
  })
);

// Middleware for serving static files
app.use("/data", express.static(path.join(__dirname, "data")));

// Middleware for parsing JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configure Multer for file uploads
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array("images", 5)
);

// ROUTEs
app.use("/api/auth", authRoutes);

app.use("/api/shop", shopRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/message", messageRoutes);

// Handling 404
app.use((req, res, next) => {
  res.status(404).send("Page not found");
});

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    // Starting the server
    setupSocket(server);

    // Start the server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
