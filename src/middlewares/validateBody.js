import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    if (req.file) {
      return next();
    }

    await schema.validateAsync(req.body, {
      abortEarly: false,
    });

    next();
  } catch (err) {
    const error = createHttpError(400, `${err.message}`);
    next(error);
  }
};
