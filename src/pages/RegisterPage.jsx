import React, { useState } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/upload';
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  });

  const [uploadPhoto, setUploadPhoto] = useState("");
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

  const handleUploadPhoto = async(e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file)
    // console.log("uploadPhoto", uploadPhoto)
    setUploadPhoto(file);

    setData((prev) => {
      
      return{
        ...prev,
      profile_pic: uploadPhoto?.url
      }
    });
  };

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api/register`


    const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api/register`
    try {
      const response = await axios.post(URL, data)
      
      toast.success(response.data.message)
      if(response.data.success){
        setData( {
          name: "",
          email: "",
          password: "",
          profile_pic: ""
        })
      }
      navigate('/email')
    } catch (error) {
toast.error(error?.response?.data?.message)
    }
  };

  console.log("data", data)
  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
        <h3>Welcome to Chat App!</h3>
        <form className='grid gap-1 mt-5' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor="name">Name:</label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='Enter your name'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

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

          <div className='flex flex-col gap-1'>
            <label htmlFor="password">Password:</label>
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

          <div className='flex flex-col gap-1'>
            <label htmlFor="profile-pic">Photo:</label>
            <div
              className='h-14 bg-slate-200 flex justify-center items-center border hover:border-primary rounded-sm cursor-pointer'
              onClick={() => document.getElementById('profile_pic').click()}
            >
              <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                {uploadPhoto ? uploadPhoto.name : "Upload Profile Photo"}
              </p>
              {
                uploadPhoto && (
                  <button className='text-lg ml-2 hover:text-red-500' onClick={handleClearUploadPhoto}>
                    <IoCloseOutline />
                  </button>
                )
              }
            </div>
            <input
              type='file'
              id='profile_pic'
              name='profile_pic'
              className='hidden'
              onChange={handleUploadPhoto}
            />
          </div>
          <button className='bg-primary text-lg px-4 py-2 text-white hover:bg-secondary rounded-sm mt-4 font-bold leading-relaxed tracking-wide'>Register</button>
          <Toaster/>
        </form>

        <p className='my-2'>Already have account? <Link to={'/email'} className='text-primary hover:underline font-semibold'>Login</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
