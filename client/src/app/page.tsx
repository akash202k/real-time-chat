"use client";
import { useEffect, useRef, useState } from "react";




export default function Home() {

  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [latestMessage, setLatestMessage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      console.log("Connected.");
      setSocket(socket);
    }

    socket.onmessage = (message) => {
      console.log(`Received ${message}`);
      setLatestMessage(message.data);
    }


    return () => {
      socket.close()
    }

  }, []);

  if (!socket) {
    return (
      <div>Loading ...</div>
    )
  }


  return (
    <div className="p-4">
      <input className="bg-amber-100 mx-10 rounded-2xl p-4" type="text" onChange={(e) => {
        setMessage(e.target.value);
      }} />
      <button className="bg-blue-500 p-4 rounded-2xl hover:bg-blue-800" onClick={() => {
        socket.send(message);
      }}>SEND</button>
      <div className="p-4">
        {latestMessage}
      </div>
    </div>
  );
}
