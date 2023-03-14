import React, { useState, useEffect } from 'react';

const AuctionTimer = ({ productId }) => {

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/auctionSpace/timer?id=" + productId , {
           headers: { "Authorization": "Bearer "+localStorage.getItem("token")}
         })
       .then(response => response.json())
       .then(data => 
         {
          setEndTime(data.endTime);
          setTimeLeft(data.timeLeft);
          setStartTime(data.startTime);  
         }
       )
       .catch(error => console.error(error));
  },[])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(new Date(endTime) - new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, endTime]);

  const formatTime = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  return (
    <div>
     Time Left: {   timeLeft !== null && timeLeft > 0 ? formatTime(timeLeft) : 'Auction ended'}
    </div>
  );
};

export default AuctionTimer;