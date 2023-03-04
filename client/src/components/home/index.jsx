import NavLoggedIn from "../navbar/navLoggedIn";
import NavLoggedOut from "../navbar/navLoggedOut";
const Home = () => {
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

export default Home;