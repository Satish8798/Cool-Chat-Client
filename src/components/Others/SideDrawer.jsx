import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import UserListItem from "./UserListItem";
import { getSender } from "../../config/ChatLogics";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    user,
    setUser,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigateTo = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigateTo("/");
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          "access-token": token,
        },
      };

      const { data } = await axios.post(
        "https://cool-chat-server.onrender.com/chat",
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      toast("Error fetching the data");
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast("please enter something to search");
      return;
    }

    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.token;
      const config = {
        headers: {
          "access-token": token,
        },
      };

      const { data } = await axios.get(
        "https://cool-chat-server.onrender.com/user?search=" + search,
        config
      );
      setLoading(false);
      setSearchResult(data);
      setSearch("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-body-tertiary ps-2 pe-2 pt-1 pb-1 bg-info-subtle d-flex justify-content-between align-items-center ">
      <button
        className="btn btn-light-subtle"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasExample"
        aria-controls="offcanvasExample"
      >
        <SearchIcon /> <span className="d-none d-md-inline">Search Users</span>
      </button>

      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">
            Search Users
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="d-flex">
          <TextField
            className="ms-5"
            value={search}
            id="filled-basic"
            label="Name or Email"
            variant="filled"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <button className="btn btn-primary ms-3" onClick={handleSearch}>
            <SearchIcon />
          </button>
        </div>
        <small className="ms-5">results</small>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center w-100 h-100">
            <div className="spinner-border text-dark ms-5 mt-5" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          searchResult.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => accessChat(user._id)}
            />
          ))
        )}
      </div>
      <h2>Cool-Chat</h2>
      <div className="d-flex">
        <div className="btn-group me-2">
          <button
            type="button"
            className="btn btn-danger dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {notification.length!==0 && (
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {notification.length}
                <span class="visually-hidden">unread messages</span>
              </span>
            )}
            <NotificationsIcon />
          </button>
          <ul className="dropdown-menu">
            {!notification.length && (
              <li className="dropdown-item"> "no new messages"</li>
            )}
            {notification.map((notify, i) => (
              <li
                className="dropdown-item"
                key={i}
                onClick={() => {
                  setSelectedChat(notify.chat);
                  setNotification(notification.filter((n) => n !== notify));
                }}
              >
                {notify.chat.isGroupChat
                  ? `New message in ${notify.chat.chatName}`
                  : `New message from ${getSender(user, notify.chat.users)}`}
              </li>
            ))}
          </ul>
        </div>
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-success dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <AccountCircleIcon />
          </button>
          <ul className="dropdown-menu">
            <li className="dropdown-item">
              <ProfileModal user={user}>
                <Button>My Profile</Button>
              </ProfileModal>
            </li>
            <li className="dropdown-item">
              <button className="btn btn-danger" onClick={logoutHandler}>
                Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideDrawer;
