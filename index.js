import express from "express";
import initApp from "./src/index.router.js";
import dotenv from 'dotenv'
const app = express();
const port = process.env.PORT || 5000;
dotenv.config();

initApp(app, express);

app.listen(port, () => console.log(`Server Is On Listening ...... ${port}`));
