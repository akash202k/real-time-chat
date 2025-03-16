import jwt from "jsonwebtoken";
import * as http from "http";


export const auth = (request: http.IncomingMessage) => {
    try {
        const token: string = request && request.headers.cookie?.split(";")[0].split("=")[1] as string;
        // console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        return { decoded };
    } catch (error) {
        console.error("Invalid Token")
        return null;
    }
}