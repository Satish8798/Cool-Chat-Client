import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "./ProfileModal";
import Person2Icon from "@mui/icons-material/Person2";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UpdateGroupChat from "./UpdateGroupChat";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { toast } from "react-toastify";
import ScrollableChat from "../chats/ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "https://cool-chat-server.onrender.com";
let socket, selectedChatCompare;

function SingleChat({ setFetchAgain, fetchAgain }) {
  const { user, selectedChat, setSelectedChat ,notification, setNotification} = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping,setIsTyping] = useState(false);
  const [typing,setTyping] = useState(false);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    /* Typing indictator  */
    if(!socketConnected) return;

    if(!typing){
      setTyping(true);
      socket.emit('typing',selectedChat._id)
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(()=>{
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if(timeDiff >= timerLength && typing){
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    },timerLength)
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    socket.emit('stop typing',selectedChat._id);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          "access-token": token,
        },
      };
      setNewMessage("");

      const { data } = await axios.post(
        "https://cool-chat-server.onrender.com/message",
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        config
      );

      socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (error) {
      toast("failed to send a message");
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.token;
      const config = {
        headers: {
          "access-token": token,
        },
      };

      const { data } = await axios.get(
        "https://cool-chat-server.onrender.com/message/" + selectedChat._id,
        config
      );

      setMessages(data);

      setLoading(false);
      socket.emit("join chat", selectedChat._id);
      
    } catch (error) {
      toast("failed to load messages");
      setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        selectedChatCompare===undefined ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if(!notification.includes(newMessageRecieved)){
          console.log("hi")
          setNotification([newMessageRecieved,...notification]);
          console.log(notification);
          setFetchAgain(!fetchAgain);
        }
      } else {
        console.log('hi')
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <div
            className="d-flex flex-row justify-content-between align-items-center"
            style={{ height: "5%" }}
          >
            <ArrowCircleLeftIcon
              className="d-block d-md-none"
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <h2>{getSender(user, selectedChat.users).toUpperCase()}</h2>
                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                  <Person2Icon sx={{ cursor: "pointer" }} />
                </ProfileModal>
              </>
            ) : (
              <>
                <h2>{selectedChat.chatName.toUpperCase()}</h2>
                <UpdateGroupChat
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                >
                  <MoreVertIcon />
                </UpdateGroupChat>
              </>
            )}
          </div>
          <div
            className="d-flex flex-column justify-content-end w-100 "
            style={{ backgroundColor: " #ffffff7a", height: "95%" }}
          >
            {loading ? (
              <div className="w-100 h-100 d-flex flex-row justify-content-center align-items-center">
                <div className="spinner-border text-secondary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="messages p-3">
                <ScrollableChat messages={messages} />
              </div>
            )}
            { isTyping?  <div>Loading ...</div>: <></> }
            <form
              onSubmit={sendMessage}
              className="d-flex align-items-center mt-4"
            >
              <input
                className="ms-1"
                placeholder="type your message here"
                type="text"
                value={newMessage}
                onChange={typingHandler}
                style={{
                  width: "90%",
                  height: "40px",
                  border: "0px",
                  borderRadius: "10px",
                  backgroundColor: "#ffffff7a",
                }}
              />
              <button className="ms-1 btn btn-success" type="submit">
                <SendIcon />
              </button>
            </form>
          </div>
        </>
      ) : (
        <div>
          <h3>Click on a chat</h3>
        </div>
      )}
    </>
  );
}

export default SingleChat;
