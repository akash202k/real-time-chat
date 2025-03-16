import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const getEncryptedPassword = async (password: string) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds)
    const encryptedPassword = await bcrypt.hash(password, salt);
    return encryptedPassword
}


export const getToken = (id: string) => {
    const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        id
    },
        process.env.JWT_SECRET as string);

    // const token = `Bearer ${jwtToken}`;
    return token;

}

export const verifyPassword = async (payloadPassword: string, dbPassword: string) => {
    return await bcrypt.compare(payloadPassword, dbPassword);
}
