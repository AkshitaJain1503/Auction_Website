import React from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
const Contact = ({contacts,str}) => {
    var bool=true;
  if(str=="seller"){
    bool=false;
  }
  if(Object.keys(contacts).length <= 0){
    return(
        <Div>
            <h3>No contacts yet.</h3>
        </Div>
    )
  }
  else{
  return (
    <div>
    {contacts &&
        contacts?.map((contact) => (
            <Hbar 
              key={contact._id}
              >
                <h4>Product : {contact.productName}</h4>
                {bool && <h4>Name : {contact.contactName}</h4>}
                {!bool && <h4>Name : {contact.myName}</h4>}
                {!contact.userReadStatus && bool && <h5>You may have new messages!</h5>}
                {!contact.contactReadStatus && !bool && <h5>You may have new messages!</h5>}
                {/* {contact.userReadStatus && <h5>no new messages</h5>} */}
                {bool &&
                <a href={"/chat?id="+contact.contactUserId+"&name="+contact.contactName+"&bool=f&product="+contact.productName}>
                <Button>Chat with buyer</Button>
                </a>
                }
                {!bool &&
                <a href={"/chat?id="+contact.userId+"&name="+contact.myName+"&bool=t&product="+contact.productName}>
                <Button>Chat with seller</Button>
                </a>
                    }
                </Hbar>
        ))}
        </div>
  );
        }
};
const Div=styled.div`
outline-style:dotted;
`
const Hbar = styled.div`
  margin-top:5px;
  margin-bottom: 15px;
  outline-style:solid;
	width: 100%;
  max-width:5000px;
	height: 60px;
	background-color: #ffffff;
	display: flex;
	align-items: center;
  h4{
     margin-left: 20px;
    color:#334b48
  }
  h5{
    color: #78E9A6;
    margin-right: 50px;
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

export default Contact;
