import React, { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import uploadFile from '../helpers/upload';
import Divider from './Divider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.user,
    profile_pic: user?.profile_pic,
  });

  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      ...user,
    }));
  }, [user]);

  console.log('user edit', user);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();

    uploadPhotoRef.current.click();
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);

    setData((prev) => ({
      ...prev,
      profile_pic: uploadPhoto?.url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api/update-user`;

      const response = await axios({
        method:'put',
        url:URL,
        data:data,
        withCredentials:true

      });

      // console.log('update user', response)
      toast.success(response?.data?.message);

      if (response.data.success) {
        dispatch(setUser(response.data.data));

      }
    } catch (error) {
      console.log(error)
      toast.error();
    }
  };

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-40 bg-gray-700 bg-opacity-20 flex justify-center items-center'>
      <div className='bg-white p-4 m-1 rounded w-full max-w-sm py-4'>
        <h2 className='font-semibold'>Profile Details</h2>
        <p className='text-sm'>Edit user details</p>

        <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              name='name'
              id='name'
              value={data.name}
              onChange={handleOnChange}
              className='w-full px-2 focus:outline-primary border-0.5'
            />
          </div>
          <div>
            <label htmlFor='profile_pic'>
              Photo
              <div className='my-1 flex items-center gap-6'>
                <Avatar
                  width={40}
                  height={40}
                  imageUrl={data?.profile_pic}
                  name={data?.name}
                />
                <button
                  type='button'
                  className='font-semibold'
                  onClick={handleOpenUploadPhoto}
                >
                  Change photo
                </button>
                <input
                  type='file'
                  className='hidden'
                  id='profile_pic'
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </div>
            </label>
          </div>
          <Divider />
          <div className='flex gap-2 w-fit ml-auto'>
            <button
              type='button'
              onClick={onClose}
              className='border-primary border px-4 py-1 rounded hover:bg-secondary hover:text-white'
            >
              Cancel</button>
            <button onClick={handleSubmit} className='border-primary border px-4 py-1 rounded bg-secondary text-white hover:bg-orange-500'>Save</button>

          </div>
        </form>
      </div>
    </div>
  )
}

export default React.memo(EditUserDetails);