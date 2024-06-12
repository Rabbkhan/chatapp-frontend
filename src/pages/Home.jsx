import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice'
import Logo from '../assets/logo.png'
import MessagePage from '../components/MessagePage'
import Sidebar from '../components/Sidebar'
import { io } from 'socket.io-client';

const Home = () => {

  const user = useSelector(state => state?.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  console.log("redux user", user)
  const fetchUserDetails = async () => {

    try {
      const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api/user-details`
      const response = await axios({
        url: URL,
        withCredentials: true
      })
      dispatch(setUser(response?.data?.data))
      if (response.data.logout) {
        dispatch(logout())
        navigate('/email')
      }
      // console.log("Current user Details", response)
    } catch (error) {
      // toast.error(error?.response?.data?.message)
      console.log('error', error)
    }


  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

useEffect(()=>{
const socketConnection = io(import.meta.env.VITE_APP_BACKEND_URL,{
  auth:{
      token: localStorage.getItem('token')
  }
})

socketConnection.on('onlineUser',(data)=>{
  console.log(data)
  dispatch(setOnlineUser(data))
})

dispatch(setSocketConnection(socketConnection))

return ()=>{
  socketConnection.disconnect()
}
},[])

  const basePath = location.pathname === '/'

  return (
    <>
       <div className='flex h-screen'>
      <section className={`w-1/4 bg-white h-full `}>
        <Sidebar />
      </section>

      <section className={`w-full ${basePath && "hidden"}`}>
        <MessagePage />
      </section>

      <div className={`w-full flex justify-center items-center mx-auto text-center flex-col gap-2 ${basePath ? "lg:flex" : "hidden"}`}>
        <div>
          <img src={Logo} width={400} alt='logo' />
        </div>
        <div>
          <p className='text-2xl'>Select user to send message</p>
        </div>
      </div>
    </div>

    </>
  )
}

export default Home