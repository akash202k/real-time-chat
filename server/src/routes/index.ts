import { Router } from "express";
import { Request, Response } from "express";
import * as zod from "zod";
import cookie, { serialize } from 'cookie';

import { RegisterSchema, LoginSchema } from "../types";
import prisma from "../db";
import { getEncryptedPassword, getToken, verifyPassword } from "../utils";

const router = Router();

router.get('/health', (req: Request, res: Response) => {
    res.send('OK');
});

// register
router.post('/register', async (req: Request, res: Response) => {
    try {
        // input validation check
        const parsedBody = RegisterSchema.safeParse(req.body);
        if (!parsedBody.success) {
            console.error(`[ ${req.route} ] input validation error.`, parsedBody.error);
            res.status(400).json(parsedBody.error);
            return;
        }

        // check user alredy exist or not
        const user = await prisma.user.findFirst({
            where: { mobileNumber: parsedBody.data.mobileNumber }
        })

        if (user) {
            console.log("user", user);
            console.error("This mobile number is already registered . Try loggin instead.");
            return;
        }


        // register user 
        try {
            const encryptedPassword = await getEncryptedPassword(parsedBody.data.password);
            const user = await prisma.user.create({
                data: {
                    email: parsedBody.data.email,
                    username: parsedBody.data.username,
                    mobileNumber: parsedBody.data.mobileNumber,
                    password: encryptedPassword
                }
            })
            console.log("User Created .", user);
            res.json({
                message: "User Created.",
                userid: user.id
            })
            return;
        } catch (error) {
            console.error(req.route + "Something Went Wrong While Creating User !", error);
            res.status(500).json("Internal Server Error")
            return;
        }

    } catch (error) {
        console.error(req.route + "Something Went Wrong !", error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

router.post('/login', async (req: Request, res: Response) => {
    const parsedBody = LoginSchema.safeParse(req.body);
    if (!parsedBody.success) {
        console.error("Login Failed !");
        res.status(400).json(parsedBody.error.message);
        return;
    }

    // check user registered or not
    const user = await prisma.user.findFirst({
        where: { mobileNumber: parsedBody.data.mobileNumber }
    })

    if (!user) {
        console.error("User is not registred");
        res.status(400).json({
            message: "User Not Found"
        })
        return;
    }

    // verify creds
    const validPass = await verifyPassword(parsedBody.data.password, user.password);
    if (!validPass) {
        console.error("Wrong Password");
        res.status(401).json({
            message: "Invalid Password !"
        })
        return;
    }

    try {
        const token = getToken(user.id);
        // console.log("Token", token);
        // res.cookie('token', token, {
        //     httpOnly: true,  // Prevent JavaScript access (protection against XSS)
        //     secure: true,    // Ensures cookie is sent only over HTTPS (ideal for production)
        //     // sameSite: 'Strict', // Protects against CSRF attacks
        //     maxAge: 3600000  // 1 hour expiry
        // });

        res.setHeader('Set-Cookie', serialize('token', token, {
            httpOnly: true,        // Prevents JavaScript access
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',    // Prevents CSRF attacks
            path: '/',             // Accessible across the entire app
            maxAge: 3600           // 1-hour expiry
        }));

        res.json({
            message: "Login Success"
        })
        return;
    } catch (error) {
        console.error("Error while sending cookie", error);
        res.status(500).json("Internal Server Error !");
        return;
    }


})

export default router;