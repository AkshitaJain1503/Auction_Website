import {  Navigate} from 'react-router-dom';

//Redirecting on the basis of isUser logged in or logged out
const ProtectedRoute = ({Component}) => {

    const user = localStorage.getItem("token");
    return user ? <Component/> : <Navigate to="/signup" />;
    
}

export default ProtectedRoute;