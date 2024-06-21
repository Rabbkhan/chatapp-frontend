import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaPlus, FaImages, FaVideo } from "react-icons/fa";
import { LuFileAudio } from "react-icons/lu";
import { IoClose, IoSend } from "react-icons/io5";
import uploadFile from '../helpers/upload';
import Loading from './Loading';
import wallpaper from '../assets/wallpaper.jpg';
import moment from 'moment'
const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const user = useSelector(state => state?.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);

  const currentMessage = useRef()
  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [allMessage])
  const handleVideoImageUpload = () => {
    setOpenImageVideoUpload(prev => !prev);
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    try {
      setLoading(true);
      const uploadVideo = await uploadFile(file);
      setMessage(prev => ({ ...prev, videoUrl: uploadVideo.url }));
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setLoading(false);
      setOpenImageVideoUpload(false);
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    try {
      setLoading(true);
      const uploadPhoto = await uploadFile(file);
      setMessage(prev => ({ ...prev, imageUrl: uploadPhoto.url }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
      setOpenImageVideoUpload(false);
    }
  };

  const handleUploadAudio = async (e) => {
    const file = e.target.files[0];
    try {
      setLoading(true);
      const audioUrl = await uploadFile(file);
      setMessage(prev => ({ ...prev, audioUrl: audioUrl.url }));
    } catch (error) {
      console.error('Error uploading audio:', error);
    } finally {
      setLoading(false);
      setOpenImageVideoUpload(false);
    }
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setMessage(prev => ({ ...prev, text: value }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl || message.audioUrl) {
      if (socketConnection) {
        socketConnection.emit("new message", {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          audioUrl: message.audioUrl,
          msgByUserId: user?._id
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
          audioUrl: ""
        });
      }
    }
  };

  const handleClearMedia = (type) => {
    setMessage(prev => ({ ...prev, [type]: "" }));
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId);

      socketConnection.on('seen', params.userId)
     
      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });
      socketConnection.on('message', (data) => {
        setAllMessage(data);
      });
      // socketConnection.on('new message', (newMessage) => {
      //   setAllMessage(prevMessages => [...prevMessages, newMessage]);
      // });
    }

    // // Cleanup event listeners on component unmount
    // return () => {
    //   if (socketConnection) {
    //     socketConnection.off('message-user');
    //     socketConnection.off('message');
    //     socketConnection.off('new message');
    //   }
    // };
  }, [socketConnection,params?.userId,user]);

  return (
    <div style={{ backgroundImage: `url(${wallpaper})` }} >
      <header className='sticky top-0 h-16 bg-white max-w-full z- flex justify-between items-center px-2'>
        <div className='flex items-center gap-4'>
          <Link to={"/"} className='lg:hidden'>
            <FaAngleLeft />
          </Link>
          <div>
            <Avatar width={50} height={50} imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h2 className='font-semibold text-lg'>{dataUser?.name}</h2>
            <p className='my-0 -mt-1'>
              {dataUser.online ? <span className='text-blue-600'>online</span> : <span className='text-slate-400'>offline</span>}
            </p>
          </div>
        </div>
        <div className='text-2xl cursor-pointer hover:text-blue-600'>
          <button>
            <HiDotsVertical />
          </button>
        </div>
      </header>

      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>


        <div className="flex flex-col p-5 gap-2 mx-3 " ref={currentMessage}>
          {allMessage.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col mb-2 max-w-xs rounded-lg p-2  w-fit bg-white shadow-lg'
         ${user._id === msg?.msgByUserId ? "ml-auto bg-teal-300 " : ""} `}
            >
              {msg.text && <div className="text-base mb-1 px-2"><p>{msg.text}</p>
                <p className='text-xs w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>
              </div>}
              {msg.imageUrl && <img src={msg.imageUrl} alt="messageImage" className="max-w-xs rounded-lg mt-1" />}
              {msg.videoUrl && <video src={msg.videoUrl} controls className="max-w-xs rounded-lg mt-1" />}
              {msg.audioUrl && (
                <div className="bg-white p-3 w-full">
                  <audio src={msg.audioUrl} controls muted autoPlay className="w-full h-full max-w-sm m-2" />
                </div>
              )}
            </div>
          ))}
        </div>
     
        {message.imageUrl && (
          <div className='w-full h-full bg-slate-700 bg-opacity-30 flex sticky bottom-0 justify-center items-center rounded overflow-hidden'>
            <div className='w-fit p-2 absolute top-0 right-0 hover:text-white cursor-pointer' onClick={() => handleClearMedia('imageUrl')}>
              <IoClose size={30} />
            </div>
            <div className='bg-white p-3'>
              <img src={message.imageUrl} alt='uploadImage' className='aspect-square w-full h-full max-w-sm m-2 object-scale-down' />
            </div>
          </div>
        )}

        {message.videoUrl && (
          <div className='w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
            <div className='w-fit p-2 absolute top-0 right-0 hover:text-white cursor-pointer' onClick={() => handleClearMedia('videoUrl')}>
              <IoClose size={30} />
            </div>
            <div className='bg-white p-3'>
              <video src={message.videoUrl} className='aspect-square w-full h-full max-w-sm m-2 object-scale-down' controls muted autoPlay />
            </div>
          </div>
        )}

        {message.audioUrl && (
          <div className='w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
            <div className='w-fit p-2 absolute top-0 right-0 hover:text-white cursor-pointer' onClick={() => handleClearMedia('audioUrl')}>
              <IoClose size={30} />
            </div>
            <div className='bg-white p-3'>
              <audio src={message.audioUrl} controls muted autoPlay className='w-full h-full max-w-sm m-2 object-scale-down' />
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-full flex justify-center items-center">
            <Loading />
          </div>
        )}
      </section>

      <section className='h-16 bg-white flex items-center px-4'>
        <div className='relative'>
          <button onClick={handleVideoImageUpload} className='flex justify-center items-center w-12 h-12 rounded-full hover:bg-secondary hover:text-white'>
            <FaPlus size={20} />
          </button>

          {openImageVideoUpload && (
            <div className='bg-white shadow rounded absolute bottom-12 w-36 p-2'>
              <form>
                <label htmlFor='uploadImage' className='flex items-center p-2 gap-2 hover:bg-slate-200 px-3 cursor-pointer'>
                  <div className='text-blue-500'>
                    <FaImages size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label htmlFor='uploadVideo' className='flex items-center p-2 gap-2 hover:bg-slate-200 px-3 cursor-pointer'>
                  <div className='text-purple-600'>
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <label htmlFor='uploadAudio' className='flex items-center p-2 gap-2 hover:bg-slate-200 px-3 cursor-pointer'>
                  <div className='text-emerald-500'>
                    <LuFileAudio size={18} />
                  </div>
                  <p>Audio</p>
                </label>

                <input type="file" className='hidden' id="uploadVideo" onChange={handleUploadVideo} />
                <input type="file" className='hidden' id="uploadImage" onChange={handleUploadImage} />
                <input type="file" className='hidden' id="uploadAudio" onChange={handleUploadAudio} />
              </form>
            </div>
          )}
        </div>

        <form className='h-full w-full flex' onSubmit={handleSendMessage}>
          <input type='text' placeholder='Type here message..'
            className='py-1 px-4 outline-none w-full h-full'
            value={message.text}
            onChange={handleOnChange}
          />
          <button className='text-secondary hover:text-orange-600'>
            <IoSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
