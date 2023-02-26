import React,{ useEffect } from 'react';
import NavLoggedIn from "../home/navbar/navLoggedIn";
import axios from 'axios';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
} from 'mdb-react-ui-kit';

const GetProfile = () => {
  const [data, setData] = React.useState({})

  useEffect(() => {
    console.log("length is==>",Object.keys(data).length)
    if(Object.keys(data).length == 0){
      const url = "http://localhost:3001/api/myProfile";
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

const DisplayProfile =()=> {
  const data = GetProfile();
  const isData = Object.keys(data).length>0

  if(isData){
    return (
      <div>
        {isData ? (
          <div>
            <NavLoggedIn/>
            <section >
              <MDBContainer className="py-5">
      
          <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                
                <p className="text-muted mb-1">MORE DETAILS</p>
                <div className="d-flex justify-content-center mb-2">
                  
                <a href="/editProfile">
                  <button>Edit Profile</button>
                </a>

                <a href="/pastPurchases">
                  <button className="ms-3" >Past Purchases</button>
                </a>

                <a href="/pastPosts">
                <button className="ms-3">Past Posts</button>
                </a>
                  
                </div>
              </MDBCardBody>
            </MDBCard>


          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>FIRST NAME</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{data.firstName}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>LAST NAME</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{data.lastName}</MDBCardText>
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
                  <MDBCol sm="3">
                    <MDBCardText>ADDRESS</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{data.address}</MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  </div>
      ) : 
      (
        <NavLoggedIn/>
      )}
      </div>
    )
  }
}
// module.exports = { GetProfile,DislayProfile }
//export default DislayProfile;
  
export {GetProfile,DisplayProfile};