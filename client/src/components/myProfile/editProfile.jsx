import React,{ useEffect } from 'react';
import NavLoggedIn from "../home/navbar/navLoggedIn";
import axios from 'axios';

const EditProfile = () => {
    return(
        <div>
            <NavLoggedIn/>
            <p> EDIT PROFILE FORM</p>
        </div>
    )
};

export default EditProfile;