import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import {BiSearchAlt} from "react-icons/bi";

const NavLoggedIn = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location = "/";
  };

  const [value, setValue] = useState("");

  const handleSearch = () => {
    navigate(`/searchResults?name=${value}`);
  };

  return (
    <div className={styles.home_container}>
      <nav className={styles.navbar}>
        <a href="/watchList">
          <button className={styles.white_btn}>WatchList</button>
        </a>
        <a href="/PostProduct">
          <button className={styles.white_btn}>Post Product</button>
        </a>
        <a href="/myProfile">
          <button className={styles.white_btn}>My Profile</button>
        </a>
        <a href="myChats">
					<button className={styles.white_btn}>
						My Chats
					</button>
				</a>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>

        {/* <form>
          <label htmlFor="header-search">
            <span className="visually-hidden">Search blog posts</span>
          </label>
          <input
            type="text"
            id="header-search"
            placeholder="Search anything"
            name="name"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <button onClick={handleSearch}>Search</button>
        </form> */}
        <form action="" className={styles.search_bar}>
					<input type="text" placeholder="search anything" name="name"  onChange={(e) => {
              setValue(e.target.value);
            }}/>
					<button	type="submit" onClick={handleSearch}>
						{/* <img src="./search-icon.png"  alt=""/> */}
           < BiSearchAlt> </BiSearchAlt>
					</button>
				</form>
        <h1>
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
            BidKaro!!!!!
          </a>
        </h1>
      </nav>
    </div>
  );
};

export default NavLoggedIn;
