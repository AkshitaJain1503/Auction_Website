import NavBar from "../navbar/index";
import React from "react";
import styled from "styled-components";
import UpcomingAuctions from "./upcomingAuctions";
import LiveAuctions from "./liveAuctions";
import PastAuctions from "./pastAuctions";
function Home() {
    return (
      <Container>
        <NavBar />
        <Hbar>
            <Button>View all</Button>
            <h5>Upcoming Auctions</h5>
        </Hbar>
        <UpcomingAuctions/>
        <Hbar>
            <Button>View all</Button>
            <h5>Live Auctions</h5>
        </Hbar>
        <LiveAuctions/>
        <Hbar>
            <Button>View all</Button>
            <h5>Past Auctions</h5>
        </Hbar>
        <PastAuctions/>
      </Container>
    );
  }
  

const Container = styled.div`
  width: 100%;
  background-color: rgb(234, 237, 237);
  max-width: 1400px;
  margin: auto;
  height: fit-content;
  align:block;
`;

const Hbar = styled.div`
  margin-top:50px;
  outline-style:solid;
	width: 100%;
  max-width:5000px;
	height: 40px;
	background-color: #ffffff;
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
`
const Button =styled.button`
border: none;
	outline: none;
	padding: 5px 0;
	background-color: #3bb19b;
	border-radius: 20px;
	width: 90px;
	font-weight: bold;
	font-size: 14px;
	cursor: pointer;
	margin-right: 10px;
	margin-left:auto;
`

export default Home;