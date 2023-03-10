import NavBar from "../navbar/index";
import React from "react";
import styled from "styled-components";
import HomeUpcomingAuctions from "./upcomingAuctions";
import HomeLiveAuctions from "./liveAuctions";
import HomePastAuctions from "./pastAuctions";
function Home() {
    return (
      <Container>
        <NavBar />
        <Hbar>
          <h5>Upcoming Auctions</h5>
          <a href='/upcomingAuctions'>
            <Button>View all</Button>
          </a>
        </Hbar>
        <HomeUpcomingAuctions/>
        <Hbar>
          <h5>Live Auctions</h5>
          <a href='/liveAuctions'>
            <Button>View all</Button>
          </a>
        </Hbar>
        <HomeLiveAuctions/>
        <Hbar>
          <h5>Past Auctions</h5>
          <a href='pastAuctions'>
            <Button>View all</Button>
          </a>

        </Hbar>
        <HomePastAuctions/>
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
	align-items: center;
  flex-gap:100px;
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
	margin-left:auto;
`


export default Home;