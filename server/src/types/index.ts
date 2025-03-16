import * as zod from "zod";
import { WebSocket } from "ws";

const RegisterSchema = zod.object({
    email: zod.string().email(),
    username: zod.string(),
    mobileNumber: zod.string().length(10),
    password: zod.string().min(6)
})

const LoginSchema = zod.object({
    mobileNumber: zod.string().length(10),
    password: zod.string().min(6)
})

export { RegisterSchema, LoginSchema }



export interface AuthenticatedWebSocket extends WebSocket {
    user?: any;  // Define 'user' property in your interface
}
