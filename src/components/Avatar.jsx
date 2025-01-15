import React from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Avatar = ({ userId, name, imageUrl, width, height }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);

  let avaterName = "";

  if (name) {
    const splitName = name.split(" ");
    if (splitName.length > 1) {
      avaterName = splitName[0][0] + splitName[1][0];
    } else {
      avaterName = splitName[0][0];
    }
  }
  const bgColor = [
    "bg-slate-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-gray-200",
    "bg-blue-200",
  ];

  const isOnline = onlineUser.includes(userId);

  const randomNumber = Math.floor(Math.random() * 50);
  return (
    <div
      className={`text-slate-800  rounded-full  text-xl font-bold relative`}
      style={{ width: width + "px", height: height + "px" }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          alt={name}
          className="overflow-hidden rounded-full"
        />
      ) : name ? (
        <div
          style={{ width: width + "px", height: height + "px" }}
          className={`overflow-hidden rounded-full flex items-center justify-center ${bgColor[randomNumber]}`}
        >
          {avaterName}
        </div>
      ) : (
        <FaRegCircleUser size={52} />
      )}

      {isOnline && (
        <div className="bg-green-600 p-1 absolute bottom-2 right-0 z-40  rounded-full"></div>
      )}
    </div>
  );
};

export default Avatar;
