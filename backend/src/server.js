const dotenv = require("dotenv");
// Load env vars
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./configs/database");
const routes = require("./routes/index");
const { errorHandler } = require("./middlewares/error.middleware");

// Connect to database
// Connect to database
connectDB().then(async () => {
  const createSuperAdmin = require("./utils/seeder");
  await createSuperAdmin();
  const seedCategories = require("./utils/seed_categories");
  await seedCategories();
});

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Headers",
      "Origin",
      "Accept",
      "X-Requested-With",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
      "Access-Control-Allow-Credentials",
      "delay",
    ],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 204,
  }),
);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "frame-ancestors": ["'self'", process.env.FRONTEND_URL],
      },
    },
    frameguard: false, // Disables X-Frame-Options
  }),
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1", routes);

// Base route
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to Sharing Document API",
    version: "1.0.0",
  });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
