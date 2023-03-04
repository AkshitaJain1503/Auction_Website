import React,{ useEffect } from 'react';
import NavLoggedIn from "../navbar/navLoggedIn";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { TableControl } from 'react-bootstrap-table-control';

//GetPastPosts returns an array of objects on hitting the back-end API
const GetPastPosts = () => {
    const [data, setData] = React.useState({})
  
    useEffect(() => {
      console.log("length is==>",Object.keys(data).length)
      if(Object.keys(data).length === 0){
        const url = "http://localhost:3001/api/pastPosts";
        const tokenStr = localStorage.getItem("token");
        const headers = { "Authorization": "Bearer "+tokenStr };
        axios
          .get(url, { headers })
          .then((res) => {
            if (res.status === 404 || !res) {
              window.location = "/signup";
            }
            setData(res.data.data);
          })
      }
    })
    return data;
};

//Renders the past posts in a table whose each row on cliking renders the specific product page.
//(TableControl) 25 rows are shown on one page. Rest are shown via pagination
const PastPosts = () => {
    const navigate = useNavigate();
    const data = GetPastPosts();
    
    if(Object.keys(data).length > 0){
        return (
            <div>
                <NavLoggedIn/>
                <h5>TOTAL POSTS:  {data.length}</h5>
                <hr/>
                <TableControl
                    header={[
                    { key: "SNo", name: "#" },
                    { key: "productName", name: "Product Name" },
                    { key: "basePrice", name: "Base Price" }
                    ]}
                    itens={data}
                
                    onClickItem={function navProduct(data){
                        navigate('/productPage', {state : {data : data.productId}});
                    }}

                    clickable
                    tableProps={{
                        hover: true
                    }}
                    totalPosition="none"
                />
            </div>
        );
    }
    else{
        return (
            <div>
              <NavLoggedIn/>
              <h5>TOTAL POSTS: {Object.keys(data).length}</h5>
            </div>
        );
    }
}

export default PastPosts;