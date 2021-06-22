import React from "react"
import io from "socket.io-client"
export const SocketContext = React.createContext();
export const getSocket = (currentId) => {
    let URL = "http://localhost:5000/";
    return io.connect(URL, {
        query: {
            id: currentId
        }
    })
}

