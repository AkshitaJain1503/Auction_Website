import React,{ useEffect } from 'react';
//import NavLoggedIn from "../navbar/navLoggedIn";
import axios from 'axios';
import NavBar from "../navbar/index";

const PastPurchases = () => {
    return(
        <div>
            <NavBar/>
            <p> PAST PURCHASES </p>
        </div>
    )
};

export default PastPurchases;