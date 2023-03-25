import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./components/home";
import Signup from "./components/loginAndSignup/signup";
import Login from "./components/loginAndSignup/login";
import { DisplayProfile } from "./components/myProfile/getProfile";
import { DisplayUserProfile } from "./components/userInfo/userProfile";
import EditProfile from "./components/myProfile/editProfile";
import PastPurchases from "./components/pastPurchases/pastPurchases";
import SearchDetails from "./components/search_page/search";
import PastPosts from "./components/pastPosts/pastPosts";
import PostProduct from "./components/postProduct/postProduct";
import ProductPage from "./components/productDetails/productPage";
import Auction from "./components/auctionSpace";
import WatchList from "./components/watchList/watchList";
import { Calendar } from "./components/calendarView/Calendar";
import CalendarDetails from "./components/calendarView/calendarDetails";
import ViewAll from "./components/viewAllPages";
import Chat from "./components/chat/app"
import MyChat from "./components/buyerQueries";
function App() {
  const user = localStorage.getItem("token");

  return (
    <Routes>
      {user && <Route path="/signup" exact element={<Home />} />}
      <Route path="/signup" exact element={<Signup />} />

      {user && <Route path="/login" exact element={<Home />} />}
      <Route path="/login" exact element={<Login />} />

      <Route path="/" exact element={<Home />} />

      <Route path={"/myProfile"} element={<ProtectedRoute Component={DisplayProfile} />} />
      <Route path={"/editProfile"} element={<ProtectedRoute Component={EditProfile} />} />
      <Route path={"/userProfile"} element={<ProtectedRoute Component={DisplayUserProfile} />} />

      <Route path={"/pastPurchases"} element={<ProtectedRoute Component={PastPurchases} />} />
      <Route path={"/pastPosts"} element={<ProtectedRoute Component={PastPosts} />} />

      <Route path={"/postProduct"} element={<ProtectedRoute Component={PostProduct} />} />

      <Route path="/productPage" exact element={<ProductPage />} />

      <Route path={"/watchList"} element={<ProtectedRoute Component={WatchList} />} />

      <Route path={"/chat"} element={<ProtectedRoute Component={Chat} />} />
      <Route path={"/myChats"} element={<ProtectedRoute Component={MyChat} />} />

      <Route path={"/auctionSpace"} element={<ProtectedRoute Component={Auction} />} />

      <Route path="/searchResults" exact element={<SearchDetails />} />

      <Route path="/calendarView" exact element={<Calendar />} />
      <Route path="/calendarDetails" exact element={<CalendarDetails />} />

      <Route path="/liveAuctions" exact element={<ViewAll/>}/>
			<Route path="/pastAuctions" exact element={<ViewAll/>}/>
			<Route path="/upcomingAuctions" exact element={<ViewAll/>}/>
    </Routes>
  );
}

export default App;
