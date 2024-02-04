import "reflect-metadata";

import dotenv from "dotenv";
import Middlewares from "./middlewares/Middlewares";
import ErrorMiddleware from "./middlewares/ErrorMiddleware";
import TestRouter from "./routers/TestRouter";
import StripeRouter from "./routers/StripeRouter";

dotenv.config();
const PORT = 3000;

// Middlewares
const app = Middlewares();

// Config

// Routers
app.use("/test/", TestRouter);
app.use("/stripe/", StripeRouter);

// Handle Error After Controller
app.use(ErrorMiddleware);

// Run application
app.listen(PORT, () => {
    console.log("listening to port ", PORT);
});
