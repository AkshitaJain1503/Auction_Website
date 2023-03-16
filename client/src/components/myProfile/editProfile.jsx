import React,{ useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { GetProfile } from "./getProfile";
import styles from "../loginAndSignup/signup/styles.module.css";
import NavBar from "../navbar/index";
import { Country, State, City }  from 'country-state-city';
import Select from "react-select";


const EditProfile = () => {
  const navigate = useNavigate();

  // Getting data from getProfile to display as default data
  const data = GetProfile();

  //to change selection of cities
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Setting the new Data which user edits.
  const [newData, setData] = useState({});
  const handleChange = ({ currentTarget: input }) => {    
    setData({ ...newData, [input.name]: input.value });
};

  //on submitting sending the new data to the patch myProfile API
  const handleSubmit  = async (e) =>{

    // to send only updated data for patch API
    if(selectedCountry != null) 
      newData.country = selectedCountry.name;
    if(selectedState != null) 
      newData.state = selectedState.name;
    if(selectedCity != null){
      newData.city = selectedCity.name;
      newData.latitude = selectedCity.latitude;
      newData.longitude = selectedCity.longitude;
    }

    e.preventDefault();
    const url = "http://localhost:3001/api/myProfile";
    const tokenStr = localStorage.getItem("token");
    const headers = { "Authorization": "Bearer "+tokenStr };
    const res = await axios.patch(url, newData, { headers });

    // if there is an authentication problem, redirect to signup page      
    if (res.status === 404 || !res) {
      navigate("/signup");
    }
    // redirecting to the myProfile display page after submitting changes to display the changes
    navigate("/myProfile");
  }
    
  //front-end rendering the edit form
  return(
    <div>
      <div>
        <NavBar/>
      </div>
      <div className={styles.signup_container}>
        <div className={styles.signup_form_container}>
          <div className={styles.right}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
              <h1>Edit Profile</h1>
              <label >Name<br></br>
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
              //deafultValue is the already existing data from get myProfile API
                  defaultValue = {data.name}
                  required
                  onChange={handleChange}
                  className={styles.input}
                />
              </label>

              <label> Address <br></br>
                <input
                  type="address"
                  placeholder="Address"
                  name="address"
                  defaultValue = {data.address}
                  required
                  onChange={handleChange}
                  className={styles.input}
                />
              </label>

              <label> Country <br></br>
                <Select
                  placeholder = {data.country}
                  options={Country.getAllCountries()}
                  getOptionLabel={(options) => {
                    return options["name"];
                  }}
                  getOptionValue={(options) => {
                    return options["name"];
                  }}
                  value={selectedCountry}
                  onChange={(item) => {
                    setSelectedCountry(item);
                  }}
                  required
                  defaultValue = {data.country}
                  className={styles.Select}

                />
              </label>

              <label> State <br></br>
                <Select
                  placeholder = {data.state}
                  options={State.getStatesOfCountry(selectedCountry?.isoCode)}
                  getOptionLabel={(options) => {
                    return options["name"];
                  }}
                  getOptionValue={(options) => {
                    return options["name"];
                  }}
                  value={selectedState}
                  onChange={(item) => {
                    setSelectedState(item);
                  }}
                  defaultValue = {data.state}
                  required
                  className={styles.Select}
                /> 
              </label>

              <label> City <br></br>
                <Select
                  placeholder = {data.city}
                  options={City.getCitiesOfState(
                    selectedState?.countryCode,
                    selectedState?.isoCode
                  )}
                  getOptionLabel={(options) => {
                    return options["name"];
                  }}
                  getOptionValue={(options) => {
                    return options["name"];
                  }}
                  value={selectedCity}
                  onChange={(item) => {
                    setSelectedCity(item);
                  }}
                  defaultValue = {data.city}
                  required
                  className={styles.Select}
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

