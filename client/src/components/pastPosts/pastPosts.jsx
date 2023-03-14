import React,{ useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { TableControl } from 'react-bootstrap-table-control';
import NavBar from "../navbar/index";
import styles from "../auctionSpace/styles.module.css";

//Past post component can be the myprofile segment or the buyer or seller segment
//so getting the id accordingly for params
const GetUserId = () => {
    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
  
    const id = query.get('id');
  
    return id;
  }

//GetPastPosts returns an array of objects on hitting the back-end API
const GetPastPosts = () => {
    const id = GetUserId();
    const [data, setData] = React.useState({})
  
    useEffect(() => {
      if(Object.keys(data).length === 0){
        const url = "http://localhost:3001/api/pastPosts?id=" + id;
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
const PastPosts = () => {
    const navigate = useNavigate();
    const data = GetPastPosts();
    
    if(Object.keys(data).length > 0){
        return (
            <div>
                <NavBar/>
                
                <hr/>
                <div className={styles.backGroundSpace}>
                  <h5>TOTAL POSTS:  {data.length}</h5>
                  <hr></hr>
                  <br></br>
                  <TableControl
                      header={[
                      { key: "SNo", name: "#" },
                      { key: "productName", name: "Product Name" },
                      { key: "basePrice", name: "Base Price" },
                      { key: "startTime", name: "Start Date and Time" },
                      { key: "endTime", name: "End Date and Time" }
                      ]}
                      itens={data}
                  
                      onClickItem={function navProduct(data){
                          navigate(`/productPage?id=${data.productId}`);
                      }}

                      clickable
                      tableProps={{
                          hover: true
                      }}
                      totalPosition="none"
                      pagination = {false}
                  />
                </div>
            </div>
        );
    }
    //if no data retrieved yet
    else{
        return (
            <div>
              <NavBar/>
              <h5>TOTAL POSTS: {Object.keys(data).length}</h5>
            </div>
        );
    }
}

export default PastPosts;