import express from "express";
import routes from "./src/routes/stripeRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 4242;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true })); // Body parse for server
app.use(bodyParser.json());

routes(app);

// app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));
app.listen(PORT);