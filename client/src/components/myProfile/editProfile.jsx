import React,{ useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavLoggedIn from "../navbar/navLoggedIn";
import axios from 'axios';
import { GetProfile } from "./getProfile";
import styles from "../loginAndSignup/signup/styles.module.css";


const EditProfile = () => {
  const navigate = useNavigate();

// Getting data from getProfile to display as default data
  const data = GetProfile();

// Setting the new Data which user edits.
  const [newData, setData] = useState({});
  const handleChange = ({ currentTarget: input }) => {    
    setData({ ...newData, [input.name]: input.value });

    console.log("new data is->",newData)
};

//on submitting sending the new data to the patch myProfile API
  const handleSubmit  = async (e) =>{
    e.preventDefault();
    const url = "http://localhost:3001/api/myProfile";
    const tokenStr = localStorage.getItem("token");
    const headers = { "Authorization": "Bearer "+tokenStr };
    const res = await axios.patch(url, newData, { headers });

 // if there is an authentication problem, redirect to signup page      
    if (res.status === 404 || !res) {
      navigate("/signup");
    }
//  redirecting to the myProfile display page after submitting changes to display the changes
    navigate("/myProfile");
  }
    
//front-end rendering the edit form
  return(
    <div>
      <div>
        <NavLoggedIn/>
      </div>
      <div className={styles.signup_container}>
        <div className={styles.signup_form_container}>
          <div className={styles.right}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
              <h1>Edit Profile</h1>
              <label >First Name*
                <input style={{ marginLeft: '2rem' }}
                  type="text"
                  placeholder="First Name"
                  name="firstName"
            //deafultValue is the already existing data from get myProfile API
                  defaultValue = {data.firstName}
                  required
                  onChange={handleChange}
                  className={styles.input}
                />
              </label>
              <label> Last Name
                <input style={{ marginLeft: '2rem' }}
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  defaultValue = {data.lastName}
                  onChange={handleChange}
                  className={styles.input}
                />
              </label>
              <label> Address*
                <input style={{ marginLeft: '2rem' }}
                  type="address"
                  placeholder="Address"
                  name="address"
                  defaultValue = {data.address}
                  required
                  onChange={handleChange}
                  className={styles.input}
                />
              </label>
              <button type="submit" className={styles.green_btn}>
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>    
  )
};




export default EditProfile;

