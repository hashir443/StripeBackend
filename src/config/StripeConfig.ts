import Stripe from "stripe";
import { singleton } from "tsyringe";

@singleton()
export class StripeConfig {
    static readonly stripe: Stripe = new Stripe(
        "secret-key"
    );
}
