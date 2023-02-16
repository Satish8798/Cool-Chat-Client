import React from "react";
import { getSender } from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";

function MyChatItem({chat,loggedUser}) {

    const {selectedChat,setSelectedChat} = ChatState();
  return (
    <div
      className="px-2 py-1 mt-1 rounded w-100"
      style={{
        cursor: "pointer",
        backgroundColor: selectedChat === chat ? "#38B2Ac" : "#E8E8E8",
        color: selectedChat === chat ? "white" : "black",
      }}
      onClick={() => setSelectedChat(chat)}
    >
      <p>
        {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
      </p>
    </div>
  );
}

export default MyChatItem;
