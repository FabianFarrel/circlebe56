import Joi from 'joi';

export const followUserSchema = Joi.object({
    userId: Joi.number().integer().positive().required(), 
});

export const userSchema = Joi.object({
    id: Joi.number().integer().required(),
    email: Joi.string().email().required(),
    fullName: Joi.string().optional(),
    userName: Joi.string().optional(),
    image: Joi.string().uri().optional(),
});

export const followingResponseSchema = Joi.array().items(userSchema); 

export const followersResponseSchema = Joi.array().items(userSchema); 

export const schemas = {
    followUserSchema,
    followingResponseSchema,
    followersResponseSchema,
};
