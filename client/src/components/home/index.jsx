import NavBar from "../navbar/index";
import React from "react";
import styled from "styled-components";
import HomeAuctions from "./homeAuctions";
function Home() {
    return (
      <Container>
        <NavBar />
        <Hbar>
          <h4>Upcoming Auctions</h4>
          <a href='/upcomingAuctions'>
            <Button>View all</Button>
          </a>
        </Hbar>
        <HomeAuctions
          str={"UpcomingAuction"}
        />
        <Hbar>
          <h4>Live Auctions</h4>
          <a href='/liveAuctions'>
            <Button>View all</Button>
          </a>
        </Hbar>
        <HomeAuctions
          str={"LiveAuction"}
        />
        <Hbar>
          <h4>Past Auctions</h4>
          <a href='pastAuctions'>
            <Button>View all</Button>
          </a>
        </Hbar>
        <HomeAuctions
          str={"PastAuction"}
        />
      </Container>
    );
  }
  

const Container = styled.div`
  width: 100%;
  height:100vh;
  background-color: rgb(234, 237, 237);
  margin: auto;
  height: fit-content;
  align:block;
  padding-bottom: 25px;
`;

const Hbar = styled.div`
  margin-top:50px;
  outline-style:solid;
	width: 100%;
  max-width:5000px;
	height: 40px;
	background-color: #ffffff;
	display: flex;
	align-items: center;
  h4{
    margin-left:auto;
    margin-right:auto;
    color:#334b48
  }
  justify-content: space-between;
`
const Button = styled.button`
  border: none;
	outline: none;
	padding: 5px 0;
	background-color: #3bb19b; 
	border-radius: 20px;
	width: 90px;
	font-weight: bold;
	font-size: 14px;
	cursor: pointer;
	// margin-right: auto;
	margin-right: 5px;
`


export default Home;