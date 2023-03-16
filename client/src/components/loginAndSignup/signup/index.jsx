import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import NavBar from "../../navbar/index";
import { Country, State, City }  from 'country-state-city';
import Select from "react-select";

const Signup = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    country: "",
    state: "",
    city: "",
    latitude: "",
    longitude: "",
  });

  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  //hitting POST API
  const handleSubmit = async (e) => {
    e.preventDefault();
      data.country = selectedCountry.name;
      data.state = selectedState.name;
      data.city = selectedCity.name;
      data.latitude = selectedCity.latitude;
      data.longitude = selectedCity.longitude;
    try {
      const url = "http://localhost:3001/api/register";
      const { data: res } = await axios.post(url, data);

      //setting the JWT token on successful signUp and redirecting to home page
      localStorage.setItem("token", res.data);
      window.location = "/";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div>
      <div>
      <NavBar/>
      </div>
      <div className={styles.signup_container}>
        <div className={styles.signup_form_container}>
          <div className={styles.left}>
            <h1>Welcome Back</h1>
            <Link to="/login">
              <button type="button" className={styles.white_btn}>
                Sign in
              </button>
            </Link>
          </div>
          <div className={styles.right}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
              <h1>Create Account</h1>
              <input
                type="text"
                placeholder="Name*"
                name="name"
                onChange={handleChange}
                value={data.name}
                required
                className={styles.input}
              />
              <input
                type="email"
                placeholder="Email*"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Password*"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                className={styles.input}
              />
              <input
                type="address"
                placeholder="Address*"
                name="address"
                onChange={handleChange}
                value={data.address}
                required
                className={styles.input}
              />
        
              <Select
                placeholder = "Country*"
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
                className={styles.Select}
              />

              <Select
                placeholder = "State*"
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
                required
                className={styles.Select}
              />

              <Select
                placeholder = "City*"
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
                required
                className={styles.Select}
              />

              {error && <div className={styles.error_msg}>{error}</div>}
              <button type="submit" className={styles.green_btn}>
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
