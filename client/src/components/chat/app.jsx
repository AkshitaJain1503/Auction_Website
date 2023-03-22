import "./app.css";
import io from "socket.io-client";
import { useState,useEffect } from "react";
import Chat from "./chat";
import { GetProfile } from "../myProfile/getProfile";
import { useNavigate } from "react-router-dom";
import NavBar from "../navbar";


function App() {
    
        const params = new Proxy(new URLSearchParams(window.location.search),{
            get : (searchParams,prop) => searchParams.get(prop),
        })
        let idSeller = params.id;
        let sellerName=params.name;
        let val=params.bool;
        let user=GetProfile();
        let idUser = user._id;
       
    // make sure id1 is the smaller value for
    // consistency of generation of roomId
    var room;
    if (idSeller > idUser) {
        // swap two values
      room=idUser+"|"+idSeller;
    }
    else{
      room=idSeller+"|"+idUser;
    }

    //console.log(idSeller);
    var username=user.name;
    //console.log(room);
  useEffect(()=>{
    const addContact = async (e) => {
      var userStatus,contactStatus;
      if(val=="t"){
        contactStatus=true;
          userStatus=false;
          
        }
        else{
          contactStatus=false;
            userStatus=true;
            [idSeller,idUser]=[idUser,idSeller];
          [username,sellerName]=[sellerName,username]
        }
      const res = await fetch("http://localhost:3001/api/myChats" , {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+localStorage.getItem("token")
        },
        body: JSON.stringify({idSeller,sellerName,room,username,idUser,userStatus,contactStatus})
      }).catch((err)=> console.log(err));
     
  
    // const url = "http://localhost:3001/api/myChats?roomId="+room;
    // const tokenStr = localStorage.getItem("token");
    // const headers = { "Authorization": "Bearer "+tokenStr };
    // const ress = await axios.patch(url, newData, { headers });
    // //if there is an authentication problem, redirect to signup page      
    // if (ress.status === 404 || !ress) {
    //   navigate("/signup");
    // }
  
    }
    addContact();
  })
  
  const socket = io.connect("http://localhost:8900");
  
  
  return (
    <div>
      <NavBar/>
    <div className="App">
        <Chat socket={socket} username={username} room={room} />
    </div>
    </div>
  );

}

export default App;