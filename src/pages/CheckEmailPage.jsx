import React, { useState } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/upload';
import axios from 'axios'
import { FaRegCircleUser } from "react-icons/fa6";
import toast, { Toaster } from 'react-hot-toast';

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",

  });

  const navigate = useNavigate()

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      
      return{
        ...prev,
      [name]: value
      }
    });
  };

  



  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api/email`

    try {
      const response = await axios.post(URL, data)
      
      toast.success(response.data.message)
      if(response.data.success){
        setData( {
          email: "",
        
        })
      }
      navigate('/password',{
        state: response?.data?.data
      })
    } catch (error) {
toast.error(error?.response?.data?.message)
    }
  };

  // console.log("data", data)
  return (
    <div className='mt-5'>
     
      <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
      <div className='w-fit mx-auto mt-3 '>
        <FaRegCircleUser size={80}/>
      </div>

        <h3>Login to Chat App!</h3>
        <form className='grid gap-1 mt-5' onSubmit={handleSubmit}>
         
          <div className='flex flex-col gap-1'>
            <label htmlFor="email">Email:</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

        

          
          <button className='bg-primary text-lg px-4 py-2 text-white hover:bg-secondary rounded-sm mt-4 font-bold leading-relaxed tracking-wide'>Let's Go</button>
          <Toaster/>
        </form>

        <p className='my-2'>Already have account? <Link to={'/register'} className='text-primary hover:underline font-semibold'>Register</Link></p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
