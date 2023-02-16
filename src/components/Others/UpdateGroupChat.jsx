import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";
import LogoutIcon from "@mui/icons-material/Logout";
import { Tooltip } from "@mui/material";
import axios from "axios";

function UpdateGroupChat({ fetchAgain, setFetchAgain, children, fetchMessages }) {
  const { selectedChat, setSelectedChat, user } = ChatState();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 360,
    bgcolor: "background.paper",
    border: "2px solid #000",
    p: 4,
    backgroundColor: "#ffffff5c",
    boxShadow: "2px 2px 2px 2px white, -2px -2px 2px 2px white",
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSearchResult([]);
  };

  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user._id !== user1._id) {
      toast("only admin can do this!");
      return;
    }

    try {
      setRenameLoading(false);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          "access-token": token,
        },
      };

      const { data } = await axios.put(
        "https://cool-chat-server.onrender.com/chat/group/remove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setRenameLoading(false);
    } catch (error) {
      toast("Error");
      setLoading(false);
    }
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!groupChatName) return;

    try {
      setRenameLoading(false);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          "access-token": token,
        },
      };

      const { data } = await axios.put(
        "https://cool-chat-server.onrender.com/chat/group/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast("set rename failed");
      setRenameLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast("user already there");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast("only admin can do this");
      return;
    }

    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          "access-token": token,
        },
      };

      const { data } = await axios.put(
        "https://cool-chat-server.onrender.com/chat/group/add",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast("Error!!");
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          "access-token": token,
        },
      };

      const { data } = await axios.get(
        "https://cool-chat-server.onrender.com/user?search=" + search,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast("Failed to Load the search results");
    }
  };

  return (
    <>
      <ToastContainer />
      <span onClick={handleOpen}>{children}</span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="header d-flex flex-row justify-content-between align-items-center bg-light p-2 rounded">
            <h4>{selectedChat.chatName}</h4>
            <Tooltip title="Exit group">
              <LogoutIcon
                onClick={() => {
                  handleRemove(user);
                }}
              />
            </Tooltip>
          </div>
          <div className="body">
            {selectedChat.users.map((u) => (
              <UserBadgeItem user={u} handleFunction={() => handleRemove(u)} />
            ))}
            <form className="mt-2" onSubmit={handleRename}>
              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Change Name"
                  onChange={(e) => {
                    setGroupChatName(e.target.value);
                  }}
                  required
                />
                <label>Change Name</label>
              </div>
              <button className="btn btn-success" type="submit">
                Update
              </button>
            </form>
            <hr />
            <form onSubmit={handleAddUser}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add users eg: Satish, Sati, Satis"
                  onChange={(e) => handleSearch(e.target.value)}
                  required
                />
                <label>Add Users</label>
              </div>
              {loading ? (
                <div>Loading...</div>
              ) : ( 
                searchResult
                  .slice(0, 4)
                  .map((user) => <UserListItem user={user} key={user._id} handleFunction={()=>{
                    handleAddUser(user)
                  }}/>)
              )}
              <button className="btn btn-success mt-2" type="submit">
                Add
              </button>
            </form>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default UpdateGroupChat;
