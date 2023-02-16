import axios from "axios";
import React, { useEffect, useState } from "react";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatState } from "../../Context/ChatProvider";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupChatModal from "../Others/GroupChatModal";
import MyChatItem from "../Others/MyChatItem";

function MyChats({fetchAgain}) {
  const [loggedUser, setLoggedUser] = useState({});
  const { selectedChat, chats, setChats } =
    ChatState();

  const fetchChats = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          "access-token": token,
        },
      };

      const { data } = await axios.get("https://cool-chat-server.onrender.com/chat", config);
      
      setChats(data);
    } catch (error) {
      toast("Error Occured");
    }
  };

  useEffect(() => {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(userInfo.user);
    fetchChats();
  }, [fetchAgain]);

  return (
    <div
      className={
        selectedChat
          ? "my-chats-selected flex-column me-2"
          : "rounded border-primary flex-column align-items-center my-chats me-2"
      }
    >
     
      <div className="p-2 fs-2 w-100 d-flex align-items-center justify-content-between">
        My Chats
        <GroupChatModal>
        <button className="btn btn-dark">
          <GroupAddIcon />
        </button>
        </GroupChatModal>
      </div>
      <div className="d-flex flex-colum w-100 h-100 rounded overflow-y-hidden">
        {chats.length!==0 ? (
          <div className="overflow-y-scroll w-100 p-2">
            { chats.map((chat) => (
              <MyChatItem loggedUser={loggedUser} chat={chat} key={chat._id}/>
            ))}
          </div>
        ) : (
          <h3>Loading</h3>
        )}
      </div>
    </div>
  );
}

export default MyChats;
