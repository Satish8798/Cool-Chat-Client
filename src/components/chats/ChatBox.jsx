import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import SingleChat from '../Others/SingleChat';

function ChatBox({fetchAgain, setFetchAgain}) {

    const {selectedChat} = ChatState();

  return (
    <div
    className={
      selectedChat
        ? "chat-box-selected p-2"
        : "rounded border-primary justify-content-center align-items-center p-2 chat-box"
    }
  >
    <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </div>
  )
}

export default ChatBox