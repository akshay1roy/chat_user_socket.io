import { useEffect, useMemo, useState } from "react";

import { io } from "socket.io-client";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Box, Stack, TextField, Typography } from "@mui/material";

function App() {
  // const socket = io("http://localhost:3000");

  const socket = useMemo(() => io("http://localhost:3000",{
    withCredentials:true,
  }), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");

  const [socketID, setSocketID] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const JoinRoomHandler=(e)=>{
    e.preventDefault();
    socket.emit("join-room",roomName)
    setRoomName("")
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("welcome", (w) => {
      console.log(w);
    });

    socket.on("recevieMessage", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 300 }} />
      {/* <Button variant="contained">Hello world</Button> */}
      <Typography variant="h3" component="div" gutterBottom>
        Welcome to Socket.io
      </Typography>

      <Typography variant="h5" component="div" gutterBottom>
        {socketID}
      </Typography>

      <form onSubmit={JoinRoomHandler}>
        <h5>Join Room</h5>

        <TextField
          value={roomName}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
          onChange={(e) => setRoomName(e.target.value)}
        />

        <Button type="submit" variant="contained" color="primary">
          send
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          id="outlined-basic"
          label="Message"
          variant="outlined"
          onChange={(e) => setMessage(e.target.value)}
        />

        <TextField
          value={room}
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          send
        </Button>
      </form>

      <Stack>
        {messages.map((m, i) => {
          return (
            <Typography key={i} variant="h6" component="div" gutterBottom>
              {m}
            </Typography>
          );
        })}
      </Stack>
    </Container>
  );
}

export default App;
