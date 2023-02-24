import React,{ useEffect } from 'react';
import NavLoggedIn from "../home/navbar/navLoggedIn";
import axios from 'axios';

const PastPosts = () => {
    return(
        <div>
            <NavLoggedIn/>
            <p> PAST POSTS </p>
        </div>
    )
};

export default PastPosts;