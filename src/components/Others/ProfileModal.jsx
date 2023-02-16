import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

function ProfileModal({ user, children }) {
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
  const handleClose = () => setOpen(false);
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
          <img
            src={user.picture}
            alt="profile-pic"
            className="w-50 rounded-circle"
          />
          <h1 className="ms-3 mt-2">{user.name}</h1>

          <h4 className="ms-3">{user.email}</h4>
        </Box>
      </Modal>
    </>
  );
}

export default ProfileModal;
