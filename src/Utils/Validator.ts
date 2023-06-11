import { NextFunction } from "express";
import createHttpError from "http-errors";
import Joi from "joi";
import { Error } from "mongoose";

export const validator = async (
  schemaName: Joi.ObjectSchema,
  body: object,
  next: NextFunction
) => {
  const value = await schemaName.validate(body);

  try {
    value.error
      ? next(createHttpError(422, value.error.details[0].message))
      : next();
  } catch (error) {
    console.log(error);
  }
};

export const customError = (error: Error) => {
  const errorMessage: Record<string, string> = {};
  if (error instanceof Error.ValidationError) {
    const messages = Object.values(error.errors);
    for (let i = 0; i < messages.length; i++) {
      const element: Error.ValidatorError | Error.CastError = messages[i];
      errorMessage[element.path] = element.message;
    }
  }
  return errorMessage;
};
