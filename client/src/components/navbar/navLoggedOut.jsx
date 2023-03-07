import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import React from 'react';
import {useState} from 'react';
const NavLoggedOut = () => {
	const navigate = useNavigate();
	const[value, setValue] = useState(""); 

	const handleSearch = ()  => {
		navigate(`/searchResults?name=${value}`)
	};
	return (
		<div className={styles.home_container}>
			<nav className={styles.navbar}>

				<a href="/login">
					<button className={styles.white_btn}>
						Login / Signup
					</button>
				</a>

				<form >
        <label htmlFor="header-search">
            <span className="visually-hidden">Search blog posts</span>
        </label>
        <input
            type="text"
            id="header-search"
            placeholder="Search anything"
            name="name" 
			onChange={(e) => {setValue(e.target.value)}}
			
        />
        <button onClick={handleSearch}>Search</button>
    </form>
				<h1>
					<a href="/" style={{textDecoration:"none",color:"inherit"}}>
						BidKaro!!!!!
					</a>
				</h1>
			</nav>
		</div>
	);
};

export default NavLoggedOut;