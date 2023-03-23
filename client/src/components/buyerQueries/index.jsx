import React from 'react'
import { useState } from "react";
import styled from "styled-components";
import { GetProfile } from "../myProfile/getProfile";
import NavBar from '../navbar';
import Contact from './contacts';
export default function MyChat() {
    const [buyerContacts,setBuyerContacts]=useState({});
    const [sellerContacts,setSellerContacts]=useState({});
    let user=GetProfile();
    let id=(user._id);
    const getBuyerContacts = async () => {
      if(Object.keys(buyerContacts).length === 0){;
      fetch("http://localhost:3001/api/myChats?id=" + id , {
            headers: { "Authorization": "Bearer "+localStorage.getItem("token")}
          })
        .then(response => response.json())
        .then(data => 
          {
            setBuyerContacts(data);
          }
        )
        .catch(error => console.error(error));
      }
  }
  const getSellerContacts = async () => {
    if(Object.keys(sellerContacts).length === 0){
    fetch("http://localhost:3001/api/myChats/seller?id=" + id , {
          headers: { "Authorization": "Bearer "+localStorage.getItem("token")}
        })
      .then(response => response.json())
      .then(data => 
        {
          setSellerContacts(data);
        }
      )
      .catch(error => console.error(error));
    }
}
    if(id){
      getBuyerContacts();
      getSellerContacts();
    }
        return (
            <Container>
                <NavBar/>
              <h1>Buyer Contacts</h1>
              <Contact
                contacts={buyerContacts} str="buyer"/>
              <h1>Seller Contacts</h1>
              <Contact
                contacts={sellerContacts} str="seller"/>
            </Container>
        )
}


const Container =styled.div`
  background-color: rgb(234, 237, 237);
  height: 100dvh;
  `