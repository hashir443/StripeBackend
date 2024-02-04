import { ZodError, z } from "zod";
import HttpStatusCode from "../utils/HttpStatusCode";
import { NextFunction, Request, Response } from "express";
import { singleton } from "tsyringe";

const extractZodError = (error: ZodError, res: Response): Response => {
    const errorMessages = error.errors.map((err) => {
        return {
            field: err.path.join("."),
            message:
                err.message === "Required"
                    ? `The field ${err.path.join(".")} is required.`
                    : err.message,
        };
    });
    return res.status(HttpStatusCode.FORBIDDEN).json({
        message: "Validation failed",
        errors: errorMessages,
    });
};

@singleton()
export default class Validation {
    private schemaHandler = (
        schema: any,
        data: any,
        res: Response,
        next: NextFunction
    ) => {
        try {
            schema.parse(data);
            return next();
        } catch (error) {
            if (error instanceof ZodError) return extractZodError(error, res);
            return res.status(HttpStatusCode.FORBIDDEN).json({
                message: "Internal Server Error!",
            });
        }
    };
    public readonly paymentIntentValidator = (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const songSchema = z.object({
            email: z.string(),
            name: z.string(),
            currency: z.string(),
            amount: z.number(),
        });
        const song = req.body;
        this.schemaHandler(songSchema, song, res, next);
    };
}
