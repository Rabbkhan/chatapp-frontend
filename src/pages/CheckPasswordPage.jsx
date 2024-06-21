import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/upload';
import axios from 'axios'
import { FaRegCircleUser } from "react-icons/fa6";
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';
import toast from 'react-hot-toast';

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
    userId : ""

  });

  const navigate = useNavigate()
  const location = useLocation();
  const dispatch = useDispatch()
  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email');
    }
  }, []);

  // const basepath =location.pathname === '/'
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {

      return {
        ...prev,
        [name]: value
      }
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api/password`

    try {
      const response = await axios({
        method: 'post',
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password
        },
        withCredentials: true
      })

      toast.success(response.data.message)

      if (response.data.success) {
       dispatch(setToken(response?.data?.token))
        localStorage.setItem('token', response?.data?.token)
        setData({
          password: "",
        })
        navigate('/')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  };

  // console.log("data", data)
  return (
    <div className='mt-5'>

      <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
        <div className='w-fit mx-auto mt-3 flex justify-center items-center flex-col'>
          {/* <FaRegCircleUser size={80}/> */}
          <Avatar
            height={70}
            width={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic
            }
          />
          <h2 className='text-center'>{location?.state?.name}</h2>
        </div>

        <h3>Login to Chat App!</h3>
        <form className='grid gap-1 mt-5' onSubmit={handleSubmit}>

          <div className='flex flex-col gap-1'>
            <label htmlFor="password">password:</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>




          <button className='bg-primary text-lg px-4 py-2 text-white hover:bg-secondary rounded-sm mt-4 font-bold leading-relaxed tracking-wide'>Login</button>
        </form>

        <p className='my-2'><Link to={'/forgot-password'} className='text-primary hover:underline font-semibold'>Forgot Password</Link></p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
