import styles from "./styles.module.css";

const Home = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<div className={styles.home_container}>
			<nav className={styles.navbar}>
				<h1>BidKaro!!!!!</h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					My Profile
				</button>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
				
			</nav>
		</div>
	);
};

export default Home;