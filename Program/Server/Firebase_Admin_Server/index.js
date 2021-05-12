import express from "express";
import routes from "./src/routes/firebaseRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors(), express.json());

app.use(bodyParser.urlencoded({ extended: true })); // Body parse for server
app.use(bodyParser.json());

routes(app);

// app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));
app.listen(PORT);