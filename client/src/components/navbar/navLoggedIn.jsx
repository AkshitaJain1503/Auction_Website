import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import React from 'react';
import {useState} from 'react';

const NavLoggedIn = () => {
	const navigate = useNavigate();
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location = "/"
	};

	const[value, setValue] = useState(""); 

	const handleSearch = ()  => {
		navigate(`/searchResults?name=${value}`)
	};

	return (
		<div className={styles.home_container}>
			<nav className={styles.navbar}>

				<a href="/allProductCarts">
					<button className={styles.white_btn}>
						Carts
					</button>
				</a>
				<a href="/PostProduct">
					<button className={styles.white_btn}>
						Post Product
					</button>
				</a>
				<a href="/myProfile">
					<button className={styles.white_btn}>
						My Profile
					</button>
				</a>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>

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

export default NavLoggedIn;
