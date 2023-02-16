import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ChatState } from "../../Context/ChatProvider";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const navigateTo = useNavigate();
  const {setUser} = ChatState();

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setLoading(true);
    if(!password || !email){
      toast("Please fill all the details");
      setLoading(false);
    }

    const config = {
      headers:{
        'Content-Type': 'application/json'
      }
    }

    try{
      const { data } = await axios.post('https://cool-chat-server.onrender.com/user/login',{
        email,password
      },config);

      toast('login successful');

      localStorage.setItem('userInfo',JSON.stringify(data));
      setLoading(false);
      setUser(data.user);
      navigateTo('/chats');
    }catch(error){
      toast(error.response.data);
      setLoading(false);
    }
    
  }

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <TextField
        required
        id="filled-required"
        label="Email"
        variant="filled"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ marginTop: "10px", width: "80%" }}
      />
      <br />
      <TextField
        required
        id="filled-password-input"
        label="Password"
        type="password"
        variant="filled"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ marginTop: "10px", width: "80%" }}
      />
      <br />
      <Button
        type="submit"
        variant="contained"
        color="success"
        sx={{ marginTop: "10px", width: "80%" }}
      >
        {loading ? "Loading..." : "LOG IN"}
      </Button>
      <ToastContainer/>
    </form>
  );
}

export default Login;
