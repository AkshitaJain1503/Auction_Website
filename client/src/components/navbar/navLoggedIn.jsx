import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";

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
          <button className={styles.white_btn}>My Account</button>
        </a>
        <a href="myChats">
					<button className={styles.white_btn}>
						Buyer Queries
					</button>
				</a>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>

        <form action="" className={styles.search_bar}>
          <input
            type="text"
            placeholder="search anything"
            name="name"
            onChange={(e) => {
              setValue(e.target.value);
            }}/>
					<button	type="submit" onClick={handleSearch}>

           < BiSearchAlt> </BiSearchAlt>
					</button>
				</form>
        <h1>
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <img
              src="./website_icon.png"
              alt={"website icon"}
              width={"200px"}
              height={"100px"}
              style={{ marginTop: "10px" }}
            />
          </a>
        </h1>
      </nav>
    </div>
  );
};

export default NavLoggedIn;
