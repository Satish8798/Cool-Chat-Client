import React from 'react'
import CloseIcon from '@mui/icons-material/Close';

function UserBadgeItem({user,handleFunction}) {
  return (
   <span className="badge bg-danger mt-1 ms-1">{user.name} <CloseIcon sx={{cursor:"pointer"}} onClick={handleFunction} /></span>
  )
}

export default UserBadgeItem