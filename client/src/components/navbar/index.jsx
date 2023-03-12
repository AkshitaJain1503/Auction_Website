import NavLoggedIn from "./navLoggedIn";
import NavLoggedOut from "./navLoggedOut";
const NavBar = () => {
	
	// getting JWT (token) from user's local storage
	const user = localStorage.getItem("token")

	if(user){
		return(
			<NavLoggedIn/>
		)
	}else{
		return (
			<NavLoggedOut/>
		)
	} 
};

export default NavBar;