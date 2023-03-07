import styles from "./styles.module.css";
const NavLoggedOut = () => {
	return (
		<div className={styles.home_container}>
			<nav className={styles.navbar}>

				<a href="/login">
					<button className={styles.white_btn}>
						Login / Signup
					</button>
				</a>

				<form action="" className={styles.search_bar}>
					<input type="text" placeholder="search anything" name="name"/>
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

export default NavLoggedOut;