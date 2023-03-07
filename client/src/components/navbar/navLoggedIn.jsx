import styles from "./styles.module.css";
import SearchDetails from "../search_page/search";
import { useNavigate } from "react-router-dom";
const NavLoggedIn = () => {
	const navigate = useNavigate();
	const handleLogout = () => {
		console.log("removed");
		localStorage.removeItem("token");
	// 	console.log("removed");
	// 	const user = localStorage.getItem("token")
	// console.log(user);
		// navigate("/");
		window.location = "/"
	};
	const handleSearch = ()  => {
		console.log("removed");
		
		//SearchDetails();
		//localStorage.removeItem("token");
	// 	console.log("removed");
	// 	const user = localStorage.getItem("token")
	// console.log(user);
		 navigate("/searchResults");
		//window.location = "/searchResults"
	};
	return (
		<div className={styles.home_container}>
			<nav className={styles.navbar}>

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
				  {/* <form action="" className={styles.search_bar}>
					<input type="text" placeholder="search anything" name="name"/>
				 <button	type="submit" onSubmit={handleSearch}>
					<button onClick={handleSearch}>
						<img src={require("../../images/search_icon.jpg") } alt=""/>
						
					</button>
				</form> */}
				<form action="/" method="get" >
        <label htmlFor="header-search">
            <span className="visually-hidden">Search blog posts</span>
        </label>
        <input
            type="text"
            id="header-search"
            placeholder="Search anything"
            name="s" 
        />
        <button onClick={handleSearch} >Search</button>
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
