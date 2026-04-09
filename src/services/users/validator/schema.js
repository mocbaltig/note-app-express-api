import Joi from 'joi';

export const userPayloadSchema = Joi.object({
  username: Joi.string().required().min(3).max(50),
  password: Joi.string().required().min(6),
  fullname: Joi.string().required(),
});
