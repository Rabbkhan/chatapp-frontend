import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

const UserSearchCard = ({user, onClose}) => {
  return (
    <Link to={"/" +user?._id} onClick={onClose} className='flex items-center gap-3 mt-3 border border-transparent border-t-slate-200 p-2 hover:border hover:border-secondary rounded cursor-pointer z-40'>
     <div >
     <Avatar 
      width={50}
      height={50}
      name={user?.name}
      userId={user?._id}
      imageUrl={user?.profile_pic}
      />
     </div>
     <div>
     <div className='font-semibold'>{user?.name}</div>
<p className='text-sm'> {user?.email}</p> 
    </div>
    </Link>
  )
}

export default UserSearchCard