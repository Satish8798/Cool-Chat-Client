import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

function GroupChatModal({ children }) {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 360,
    bgcolor: "background.paper",
    border: "2px solid #000",
    p: 4,
    backgroundColor: "#ffffff8a",
    boxShadow: "2px 2px 2px 2px white, -2px -2px 2px 2px white",
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setSearchResult([]);
    setOpen(false);
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
        "http://localhost:8000/user?search=" + search,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast("Failed to Load the search results");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!groupChatName || !selectedUsers ){
      toast("pleas fill all the fields");
return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.token;
      const config = {
        headers: {
          "Content-Type" : "application/json",
          "access-token" : token
        }
      }

      const {data} = await axios.post('http://localhost:8000/chat/group/create',{
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map(u=>u._id))
      },config);
      toast("group created successfully");
      setChats([data,...chats]);
      setOpen(false);
    } catch (error) {
      toast("failed to create a group")
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(
      selectedUsers.filter((sel)=> sel._id !== delUser._id)
    );
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast("user already present");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  return (
    <>
      <span onClick={handleOpen}>{children}</span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-body">
            <p className="d-flex fs-2 justify-content-center">
              Create Group Chat
            </p>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Group Name"
                  onChange={(e) => setGroupChatName(e.target.value)}
                  required
                />
                <label>Group Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add users eg: Satish, Sati, Satis"
                  onChange={(e) => handleSearch(e.target.value)}
                  
                />
                <label>Add Users</label>
              </div>

              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
              {loading ? (
                <div>Loading...</div>
              ) : (
                searchResult
                  .slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      user={user}
                      key={user._id}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
              <button className="btn btn-success mt-2" type="submit">
                Create Group
              </button>
            </form>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default GroupChatModal;
