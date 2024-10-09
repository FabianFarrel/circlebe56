import Joi from "joi";
import { LoginDTO, RegisterDTO } from "../../dto/auth-dto";

export const registerSchema = Joi.object<RegisterDTO>({
    fullName: Joi.string().min(5).max(100).required(),
    email: Joi.string().email(),
    password: Joi.string().min(6)
});

export const loginSchema = Joi.object<LoginDTO>({
    userName: Joi.alternatives().try(
        Joi.string().email().messages({
            'string.email': "Please write your email correctly!"
        }),
        Joi.string().min(3).max(30).alphanum().messages({
            'string.base': "Username must be a string",
            'string.empty': "Username cannot be empty",
            'string.min': "Username must be at least 3 characters long",
            'string.max': "Username must be at most 30 characters long",
            'string.alphanum': "Username can only contain alphanumeric characters"
        })
    ).required(),
    password: Joi.string().min(4).required().messages({
        'string.base': "Password must be a string",
        'string.empty': "Password cannot be empty",
        'string.min': "Password must be at least 4 characters long"
    }),
});
