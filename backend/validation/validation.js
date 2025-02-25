const { z } = require("zod");

const signin_schema = z.object({
    email: z.string().trim().email("Invalid email"),
    password: z.string().trim().min(3, { message: "Password must be at least 3 characters long" }),
});

const signup_schema = z.object({
    email: z.string().trim().email("Invalid email"),
    password: z.string().trim().min(3, { message: "Password must be at least 3 characters long" }),
});

module.exports = { signin_schema, signup_schema };
