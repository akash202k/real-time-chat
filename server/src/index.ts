import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import express from 'express';
import cors from "cors"
import { JwtPayload } from 'jsonwebtoken';


// Local import's
import apiRouter from "./routes/index"
import { auth } from './utils/auth';
import { AuthenticatedWebSocket } from "./types/"

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', apiRouter)


const server = http.createServer(app)

const wss = new WebSocketServer({ noServer: true });



server.on('upgrade', async (request, socket, head) => {
    // Ignore WebSocket logic for HTTP routes
    const pathname = request.url || '';
    if (pathname.startsWith('/api')) {
        socket.destroy();
        return;
    }
    // auth logic
    const decoded: string | JwtPayload | null = auth(request)
    console.log(decoded)

    if (!decoded) {
        console.log("Invalid Token !");
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
        socket.destroy()
        return
    }

    wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
        const WS = ws as AuthenticatedWebSocket;  // Type assertion
        WS.user = decoded;
        wss.emit('connection', WS, request);
    })

});


wss.on('connection', (ws: AuthenticatedWebSocket) => {

    ws.on('error', (error) => {
        console.error(error);
        ws.close()
    })
    console.log("New Client Connected");
    const userId = ws.user?.decoded?.id
    ws.send(JSON.stringify({ userId }));

    ws.on('message', (data, isBinary: false) => {
        wss.clients.forEach((client: AuthenticatedWebSocket) => {
            if (client.readyState === WebSocket.OPEN && client.user.decoded.id != userId) {
                client.send(data, { binary: isBinary })
            }
        })

    })

})



server.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});