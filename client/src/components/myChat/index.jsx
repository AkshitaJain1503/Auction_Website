import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import io from "socket.io-client";
import Chat from '../chat/chat';
import { GetProfile } from "../myProfile/getProfile";
import { useNavigate } from "react-router-dom";
import NavBar from '../navbar';
export default function MyChat() {
    let navigate=useNavigate();
    const [contacts,setContacts]=useState({});
    let user=GetProfile();
    let id=(user._id);
    var url;
    const getContacts = async () => {
      if(Object.keys(contacts).length === 0){
      console.log(id);
      fetch("http://localhost:3001/api/myChats?id=" + id , {
            headers: { "Authorization": "Bearer "+localStorage.getItem("token")}
          })
        .then(response => response.json())
        .then(data => 
          {;
            setContacts(data);
          }
        )
        .catch(error => console.error(error));
      }
  }
    if(id){
      getContacts();
    }
  

      const handleClick = (contact) =>{
        const contactId=contact.contactUserId;
        console.log(contactId);
        navigate(`/chat?id=${contactId}`);
      }
      console.log(contacts);
      if(Object.keys(contacts).length <= 0){
        return(

            <div>
              <NavBar/>
              <h1>Your Contacts</h1>
                <h3>Sorry,you haven't been contacted by anyone yet.</h3>
            </div>
        )
      }
      else{
        return (
            <div>
              <NavBar/>
              <h1>Your Contacts</h1>
                    {contacts &&
                contacts?.map((contact) => (
                    <Hbar 
                      key={contact._id}
                      >

                        <h4>{contact.contactName}</h4>
                        <a href={"/chat?id="+contact.contactUserId+"&name="+contact.contactName}>
                        <Button>Chat with buyer</Button>
                        </a>
                        </Hbar>
                ))}
            </div>
        )
    }
}

const Hbar = styled.div`
  margin-top:5px;
  outline-style:solid;
	width: 100%;
  max-width:5000px;
	height: 60px;
	background-color: #ffffff;
	display: flex;
	align-items: center;
  h4{
    margin-left:auto;
    margin-right:auto;
    color:#334b48
  }
  justify-content: space-between;
`;
const Button = styled.button`
  border: none;
	outline: none;
	padding: 1px 0;
	background-color: #3bb19b; 
	border-radius: 20px;
	width: 100px;
	font-weight: bold;
	font-size: 14px;
	cursor: pointer;
	// margin-right: auto;
	margin-left:auto;
`