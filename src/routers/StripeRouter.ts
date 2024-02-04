import { Router } from "express";
import { container } from "tsyringe";
import { StripeController } from "../controllers/StripeController";
import Validation from "../middlewares/Validation";

const StripeRouter = Router();

// Getting Controller Using
const stripeController = container.resolve(StripeController);
const validator = container.resolve(Validation);

StripeRouter.post(
    "/getPI",
    validator.paymentIntentValidator,
    stripeController.generatePaymentIntent
);

export default StripeRouter;
