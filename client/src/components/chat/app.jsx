import "./app.css";
import io from "socket.io-client";
import { useState,useEffect } from "react";
import Chat from "./chat";
import { GetProfile } from "../myProfile/getProfile";
import NavBar from "../navbar";

function App() {
        const params = new Proxy(new URLSearchParams(window.location.search),{
            get : (searchParams,prop) => searchParams.get(prop),
        })
        let idSeller = params.id;
        let sellerName=params.name;
        let productName=params.product;
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
    var username=user.name;
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
        body: JSON.stringify({idSeller,sellerName,room,username,idUser,userStatus,contactStatus,productName})
      }).catch((err)=> console.log(err));
    }
    addContact();
  })
  
  const socket = io.connect("http://localhost:8900");
  
  
  return (
    <div>
      <NavBar/>
    <div className="App">
        <Chat socket={socket} username={username} room={room} contactName={sellerName} product={productName}/>
    </div>
    </div>
  );

}

export default App;