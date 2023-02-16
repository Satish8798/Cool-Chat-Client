import { TextField } from "@mui/material";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ChatState } from "../../Context/ChatProvider";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  const {setUser} = ChatState();

  const postDetails = (pics) => {
    setLoading(true);
    if(pics === undefined){
        toast("Please Select an Image");
        setLoading(false);
    }

    if(pics.type==='image/jpeg' || pics.type === 'image/png'){
      const data = new FormData();
      data.append("file",pics);
      data.append("upload_preset","cool-chat");
      data.append("cloud_name",'dvvitblng');
      fetch("https://api.cloudinary.com/v1_1/dvvitblng/image/upload",{
        method: 'post',
        body: data,
      }).then(res=>res.json()).then((data)=>{
        setPic(data.url.toString());
        setLoading(false);
      })
    }else{
      toast("Please Select an Image");
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type":"application/json",
        },
      };

      const {data} = await axios.post('http://localhost:8000/user/signup',{
        name,email,password,confirmPassword,pic
      },config);

      toast("Signup Successful");

      localStorage.setItem("userInfo",JSON.stringify(data));
      setUser(data.user);
      navigateTo('/chats')

      setLoading(false);
    } catch (error) {
      toast(error.response.data);
      setLoading(false);
    }

  }
    
  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <TextField
        required
        id="filled-required"
        label="Name"
        variant="filled"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ marginTop: "10px", width: "80%" }}
      />
      <br />
      <TextField
        required
        id="filled-email-required"
        label="Email"
        variant="filled"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ marginTop: "10px", width: "80%"}}
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
        sx={{ marginTop: "10px", width: "80%"}}
      />
      <br />
      <TextField
        required
        id="filled-confirm-password-input"
        label="Confirm Password"
        type="password"
        variant="filled"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        sx={{ marginTop: "10px", width: "80%"}}
      />
      <br />
      <input className="mt-2 pic-input" type="file" accept="image/*" onChange={(e)=>postDetails(e.target.files[0])} />
      <br />
      <Button
        type="submit"
        variant="contained"
        color="success"
        sx={{ marginTop: "10px", width: "80%" }}
        disabled={loading}
      >
        {loading? "Loading...": "SIGN UP"}
      </Button>
      <ToastContainer/>
    </form>
  );
}

export default Signup;
