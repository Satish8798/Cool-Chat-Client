import React from "react";

function UserListItem({ user,handleFunction }) {
  return (
    <div style={{height: "70px", cursor:"pointer"}} onClick={handleFunction} className="d-flex bg-secondary rounded p-1 flex-row justify-content-around w-75 ms-5 mt-1 border border-success border-opacity-50 rounder">
        <img className="w-25 rounded-circle" src={user.picture} alt="userphoto" />
        <div className="d-flex flex-column ms-2">
            <p>{user.name}</p>
            <p>{user.email}</p>
        </div>
    </div>
  );
}

export default UserListItem;
