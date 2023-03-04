import styles from "./styles.module.css";

const NavLoggedIn = () => {

	const handleLogout = () => {
		console.log("removed");
		localStorage.removeItem("token");
	// 	console.log("removed");
	// 	const user = localStorage.getItem("token")
	// console.log(user);
		// navigate("/");
		window.location = "/"
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
				<form action="" className={styles.search_bar}>
					<input type="text" placeholder="search anything" name="q"/>
					<button	type="submit">
						<img src={require("../../images/search_icon.jpg") } alt=""/>
					</button>
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
