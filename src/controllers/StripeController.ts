import { NextFunction, Request, Response } from "express";
import { singleton } from "tsyringe";
import { StripeConfig } from "../config/StripeConfig";
import { CustomError } from "../exception/CustomError";
import HttpStatusCode from "../utils/HttpStatusCode";

@singleton()
export class StripeController {

    public async generatePaymentIntent(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = req.body;

            const params = {
                email: data.email,
                name: data.name,
            };

            const customer = await StripeConfig.stripe.customers.create(params);
            console.log(customer.id);

            const ephemeralKey = await StripeConfig.stripe.ephemeralKeys.create(
                { customer: customer.id },
                { apiVersion: "2020-08-27" }
            );

            const paymentIntent =
                await StripeConfig.stripe.paymentIntents.create({
                    amount: parseInt(data.amount),
                    currency: data.currency,
                    customer: customer.id,
                    automatic_payment_methods: {
                        enabled: true,
                    },
                });
            const response = {
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id,
            };
            return res.status(200).send(response);
        } catch (e) {
            console.log(e);
            next(
                new CustomError(
                    "Stripe Not Working",
                    HttpStatusCode.FAILED_DEPENDENCY
                )
            );
        }
    }

}
