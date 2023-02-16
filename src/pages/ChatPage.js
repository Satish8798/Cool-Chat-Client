import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/chats/ChatBox";
import MyChats from "../components/chats/MyChats";
import SideDrawer from "../components/Others/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

function ChatPage() {
  const { user } = ChatState();
  const navigateTo = useNavigate();

  const [fetchAgain, setFetchAgain] = useState();

  useEffect(()=>{
    if(!user){
      navigateTo('/');
    }
  },[]);
  return (
    <div style={{ width: "100%" }}>
      { user && <SideDrawer />}
        <div className="d-flex flex-row justify-content-between w-100 p-1" style={{height: "91.5vh", padding: '10px'}}>
          { user && <MyChats fetchAgain ={fetchAgain} />}
          { user && <ChatBox fetchAgain ={fetchAgain} setFetchAgain = {setFetchAgain} />}
        </div>
    </div>
  );
}

export default ChatPage;
