import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/home";
import Signup from "./components/loginAndSignup/signup";
import Login from "./components/loginAndSignup/login";
import MyProfile from "./components/myProfile";
import PostProduct from "./components/postProduct/postProduct";
import ProductPage from "./components/productDetails/productPage";
function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			
			<Route path="/" exact element={<Home />} />

			{user && <Route path="/myProfile" exact element={<MyProfile />} />}
			{!user && <Route path="/myProfile" exact element={<Signup/>}/>}

			{user && <Route path="/postProduct" exact element={<PostProduct/>}/>}
			{!user && <Route path="/postProduct" exact element={<Signup/>}/>}

			{user && <Route path="/productPage" exact element={<ProductPage/>}/>}
			
		</Routes>
	);
}

export default App;