import React, { useEffect, useState } from 'react';
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { FaRegUserCircle } from "react-icons/fa";
import EditUserDetails from './EditUserDetails';
import Avatar from './Avatar';
import Divider from './Divider';
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from './SearchUser';
import { FaImages, FaVideo } from "react-icons/fa";
import { logout } from '../redux/userSlice';


const Sidebar = () => {
  const user = useSelector(state => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [alluser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const socketConnection = useSelector(state => state?.user?.socketConnection);
const dispatch = useDispatch()
const navigate = useNavigate()
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('sidebar', user?._id);

      socketConnection.on('conversation', (data) => {
        console.log("conversation", data);

        const conversationUserData = data.map((conversationUser, index) => {
          if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender
            };
          }
        });

        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);

 const handlelogout =()=>{
dispatch(logout())
navigate('/email')
localStorage.clear()
 }

  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
      <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-4 text-slate-600 flex flex-col justify-between'>
        <div>
          <NavLink className={({ isActive }) => `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title='chat'>
            <IoChatbubbleEllipses size={20} />
          </NavLink>
          <div className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded' title='add friends' onClick={() => setOpenSearchUser(true)}>
            <FaUserPlus size={20} />
          </div>
        </div>
        <div className='flex flex-col items-center'>
          <button className='mx-auto bg-gray-300 rounded-full' title={user?.name} onClick={() => setEditUserOpen(true)}>
            <Avatar
              width={30}
              height={30}
              name={user?.name}
              userId={user?._id}
            />
          </button>
          <button className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded' title='logout' onClick={handlelogout}>
            <span className='-ml-2'><IoIosLogOut size={20} /></span>
          </button>
        </div>
      </div>
      <div className='w-full'>
        <div className='flex items-center h-16'>
          <h2 className='text-lg font-bold p-2'>Message</h2>
        </div>
        <Divider />
        <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
          {
            alluser.length === 0 && (
              <div>
                <div className='flex justify-center items-center my-4 text-slate-500'>
                  <FiArrowUpLeft size={50} />
                </div>
                <p className='text-lg text-center text-slate-600'>Explore users to start the conversation</p>
              </div>
            )
          }
          {
            alluser.map((conv, index) => (
              <NavLink to={'/'+conv?.userDetails?._id}
                key={conv?._id}
                className='flex items-center gap-4 border px-2 py-3 border-transparent hover:border-secondary rounded hover:bg-slate-100 '
              >
                <div className='flex justify-center items-center gap-2 p-3 cursor-pointer'>
                  <Avatar
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    width={50}
                    height={50}
                  />
                  <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-gray-800 truncate'>
                      {conv?.userDetails?.name}
                    </h3>
                    <div className='text-slate-500'>
                      <div>
                        {
                          conv?.lastMsg?.imageUrl && (
                            <div className='flex items-center gap-2'>
                              <span><FaImages /></span>
                              <span>image</span>
                            </div>
                          )
                        }
                        {
                          conv?.lastMsg?.videoUrl && (
                            <div className='flex items-center gap-2'>
                              <span><FaVideo /></span>
                              <span>Video</span>
                            </div>
                          )
                        }
                      </div>
                    </div>
                    <p className='text-xs text-slate-500'>
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {
                  Boolean(conv?.unseenMsg) &&(
                    <p className='text-xs w-6 h-6 text-center ml-auto p-1 bg-teal-600 text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>

                  )
                }
              </NavLink>
            ))
          }
        </div>
      </div>
      {/* edit user details */}
      {
        editUserOpen && (
          <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
        )
      }
      {/* search user */}
      {
        openSearchUser && (
          <SearchUser onClose={() => setOpenSearchUser(false)} />
        )
      }
    </div>
  );
}

export default Sidebar;
