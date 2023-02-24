import React,{ useEffect } from 'react';
import NavLoggedIn from "../home/navbar/navLoggedIn";
import axios from 'axios';

const PastPurchases = () => {
    return(
        <div>
            <NavLoggedIn/>
            <p> PAST PURCHASES </p>
        </div>
    )
};

export default PastPurchases;