import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import Logo from '../assets/logo.png';
import MessagePage from '../components/MessagePage';
import Sidebar from '../components/Sidebar';
import { io } from 'socket.io-client';

const Home = () => {
  const user = useSelector(state => state?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUserAndFetchDetails = async () => {
      const token = localStorage.getItem('token');
      if (!user || !token) {
        console.log('User not authenticated, redirecting to /email');
        navigate('/email'); // Redirect to login page if not authenticated
      } else {
        await fetchUserDetails();
      }
    };

    checkUserAndFetchDetails();
  }, [user]);

  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });
      console.log('Fetched user details:', response.data.data);
      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        console.log('User session expired, redirecting to /email');
        dispatch(logout());
        navigate('/email');
      }
    } catch (error) {
      console.error('Error fetching user details:', error.response ? error.response.data : error);
      // Handle error - could be due to network issues or authentication issues
      if (error.response && error.response.status === 401) {
        console.log('Unauthorized, redirecting to /email');
        dispatch(logout());
        navigate('/email');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to /email');
      navigate('/email');
      return;
    }

    const socketConnection = io(import.meta.env.VITE_APP_BACKEND_URL, {
      auth: {
        token: token,
      },
    });

    socketConnection.on('onlineUser', (data) => {
      console.log('Online user data:', data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch, navigate]);

  const basePath = location.pathname === '/';

  return (
    <>
      <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
        <section className={`bg-white ${!basePath && 'hidden'} lg:block`}>
          <Sidebar />
        </section>

        <section className={`${basePath && 'hidden'}`}>
          <MessagePage />
        </section>

        <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? 'hidden' : 'lg:flex'}`}>
          <div>
            <img src={Logo} width={250} alt='logo' />
          </div>
          <div>
            <p className='text-2xl'>Select user to send message</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
