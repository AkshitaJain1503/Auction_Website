import { Route, Routes } from "react-router-dom";
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

      {user && <Route path="/myProfile" exact element={<DisplayProfile />} />}
      {!user && <Route path="/myProfile" exact element={<Signup />} />}

      {user && <Route path="/editProfile" exact element={<EditProfile />} />}
      {!user && <Route path="/editProfile" exact element={<Signup />} />}

      {user && (
        <Route path="/pastPurchases" exact element={<PastPurchases />} />
      )}
      {!user && <Route path="/pastPurchases" exact element={<Signup />} />}

      {user && <Route path="/pastPosts" exact element={<PastPosts />} />}
      {!user && <Route path="/pastPosts" exact element={<Signup />} />}

      {user && <Route path="/postProduct" exact element={<PostProduct />} />}
      {!user && <Route path="/postProduct" exact element={<Signup />} />}

      <Route path="/productPage" exact element={<ProductPage />} />

      {user && (
        <Route path="/userProfile" exact element={<DisplayUserProfile />} />
      )}
      {!user && <Route path="/userProfile" exact element={<Signup />} />}

      {user && <Route path="/auctionSpace" exact element={<Auction />} />}

      {<Route path="/watchList" exact element={<WatchList />} />}
      {user && (
        <Route path="/userProfile" exact element={<DisplayUserProfile />} />
      )}
      {!user && <Route path="/userProfile" exact element={<Signup />} />}

			<Route path="/calendarView" exact element={<Calendar/>}/>
			<Route path="/calendarDetails" exact element={<CalendarDetails/>}/>
			
			{user && <Route path="/postProduct" exact element={<PostProduct/>}/>}
			<Route path="/liveAuctions" exact element={<ViewAll/>}/>
			<Route path="/pastAuctions" exact element={<ViewAll/>}/>
			<Route path="/upcomingAuctions" exact element={<ViewAll/>}/>
     
      {user && <Route path="/chat" exact element={<Chat />} />}
      {!user && <Route path="/chat" exact element={<Signup />} />}
      {user && <Route path="/myChats" exact element={<MyChat />} />}
      {!user && <Route path="/myChats" exact element={<Signup />} />}
      {user && <Route path="/auctionSpace" exact element={<Auction />} />}
      {!user && <Route path="/auctionSpace" exact element={<Signup />} />}
      <Route path="/searchResults" exact element={<SearchDetails />} />

      <Route path="/calendarView" exact element={<Calendar />} />
      <Route path="/calendarDetails" exact element={<CalendarDetails />} />

      {user && <Route path="/postProduct" exact element={<PostProduct />} />}
      <Route path="/LiveAuctions" exact element={<ViewAll />} />
      <Route path="/PastAuctions" exact element={<ViewAll />} />
      <Route path="/UpcomingAuctions" exact element={<ViewAll />} />
    </Routes>
  );
}

export default App;
