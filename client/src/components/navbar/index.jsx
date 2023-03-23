import NavLoggedIn from "./navLoggedIn";
import NavLoggedOut from "./navLoggedOut";
const NavBar = () => {
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