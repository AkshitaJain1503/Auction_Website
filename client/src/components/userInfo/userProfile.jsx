import React,{ useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import NavBar from "../navbar/index";
import styles from "../auctionSpace/styles.module.css";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
} from 'mdb-react-ui-kit';

// getting the buyer or seller (user) id for params
const GetUserId = () => {
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();

  const id = query.get('id');

  return id;
}

//getting the buyer or seller (user) data from the backend API
const GetUserProfile = () => {
  const id = GetUserId();
  const [data, setData] = React.useState({})

  useEffect(() => {
    if(Object.keys(data).length === 0){
      const url = "http://localhost:3001/api/userProfile?id=" + id;
      const tokenStr = localStorage.getItem("token");
      const headers = { "Authorization": "Bearer "+tokenStr };
      axios
        .get(url, { headers })
        .then((res) => {
          if (res.status === 404 || !res) {
            window.location = "/signup";
          }
          setData(res.data.data);
        })
    }
  })
  return data;
};

//rendering the buyer or seller (user) data on the browser
const DisplayUserProfile =()=> {
  const data = GetUserProfile();
  const id = GetUserId();
  const isData = Object.keys(data).length>0

  if(isData){
    return (
      <div>
        {isData ? (
          <div>
            <NavBar/>
            <div className={styles.backGroundSpace}>
              <h5>USER PROFILE</h5>
              <hr></hr>
              <section >
                <MDBContainer className="py-5">
                  <MDBRow>
                    <MDBCol lg="8">
                      <MDBCard className="mb-4">
                        <MDBCardBody>
                          <MDBRow>
                            <MDBCol sm="3">
                              <MDBCardText>NAME</MDBCardText>
                            </MDBCol>
                            <MDBCol sm="9">
                              <MDBCardText className="text-muted">{data.name}</MDBCardText>
                            </MDBCol>
                          </MDBRow>
                          <hr />
              
                          <MDBRow>
                            <MDBCol sm="3">
                              <MDBCardText>EMAIL</MDBCardText>
                            </MDBCol>
                            <MDBCol sm="9">
                              <MDBCardText className="text-muted">{data.email}</MDBCardText>
                            </MDBCol>
                          </MDBRow>
                          <hr />

                          <MDBRow>
                            <MDBCol sm="5">
                              <MDBCardText>COUNTRY, STATE, CITY</MDBCardText>
                            </MDBCol>
                            <MDBCol sm="9">
                              <MDBCardText className="text-muted">{`${data.country}, ${data.state}, ${data.city}`}</MDBCardText>
                            </MDBCol>
                          </MDBRow>
                          <hr />

                          <MDBRow>
                            <MDBCol sm="3">
                              <MDBCardText>TOTAL POSTS</MDBCardText>
                            </MDBCol>
                            <MDBCol sm="9">
                              <MDBCardText className="text-muted">{data.totalPosts}</MDBCardText>
                            </MDBCol>
                          </MDBRow>
                          <hr />

                          <MDBRow>
                            <MDBCol sm="3">
                              <MDBCardText>TOTAL PURCHASES</MDBCardText>
                            </MDBCol>
                            <MDBCol sm="9">
                              <MDBCardText className="text-muted">{data.totalPurchases}</MDBCardText>
                            </MDBCol>
                          </MDBRow>
                
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
      
                  <MDBRow>
                    <MDBCol lg="4">
                      <MDBCard className="mb-4">
                        <MDBCardBody className="text-center">
                
                          <p className="text-muted mb-1">MORE DETAILS</p>
                          <div className="d-flex justify-content-center mb-2">
                          

                          <a href={`/pastPurchases?id=${id}`}>
                            <button className="ms-3 btn btn-dark bid-btn" >Past Purchases</button>
                          </a>

                          <a href={`/pastPosts?id=${id}`}>
                          <button className="ms-3 btn btn-dark bid-btn">Past Posts</button>
                          </a>
                            
                          </div>

                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
                </MDBContainer>
              </section>
            </div>
          </div>
        ) : 
        (
        <NavBar/>
        )}
      </div>
    )
  }
}

export {DisplayUserProfile};
