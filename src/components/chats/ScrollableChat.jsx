import { Avatar, Tooltip } from "@mui/material";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";

function ScrollableChat({ messages }) {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip title={m.sender.name}>
                <Avatar
                  alt={m.sender.name}
                  src={m.sender.picture}
                  sx={{ width: 33, height: 33, marginTop: "7px" }}
                />
              </Tooltip>
            )}
             <span style={{backgroundColor: m.sender._id === user._id ? "lightgreen":"skyblue",
            borderRadius: "20px",
            padding: "1px 15px",
            maxWidth: "75%",
            marginLeft: isSameSenderMargin(messages, m , i, user._id),
            marginTop: isSameUser(messages, m , i, user._id) ? 3: 10
        }}>
            {m.chat.isGroupChat && <small style={{fontSize:"10px"}}>{m.sender.name}</small>}
            <p>{m.content}</p>
            </span> 
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
