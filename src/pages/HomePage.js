import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import Login from "../components/registeration/Login";
import Signup from "../components/registeration/Signup";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [value, setValue] = useState("login");
  const navigateTo = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const user= JSON.parse(localStorage.getItem('user'));
    if(user) navigateTo('/chats');
  }, []);
  

  return (
    <div className="container">
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-12 col-md-4 mt-5 p-2 app-title text-center">
          <h1>Cool Chat</h1>
        </div>
      </div>
      <div className="row mt-3 d-flex justify-content-center align-items-center">
        <div className="col-12 col-md-4 p-2">
          <div className="registeration-form-container">
            <Box sx={{ width: "100%" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                textColor="inherit"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
              >
                <Tab value="login" label="LOGIN" sx={{ width: "50%" }} />
                <Tab value="signup" label="SIGNUP" sx={{ width: "50%" }} />
              </Tabs>
            </Box>
            {value === "login" && <Login />}
            {value === "signup" && <Signup />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
