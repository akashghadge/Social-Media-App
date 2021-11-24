import React from "react"
import io from "socket.io-client"
export const SocketContext = React.createContext();
export const getSocket = (payload) => {
    let URL = "/";
    return io.connect(URL, {
        query: {
            id: payload.id,
            username: payload.username
        }
    })
}

