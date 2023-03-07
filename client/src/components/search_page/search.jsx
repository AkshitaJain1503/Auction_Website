import React,{ useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { TableControl } from 'react-bootstrap-table-control';
import NavBar from "../navbar/index";

const GetProductname = () => {
    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const name = query.get('name');
    
    return name;
}

const GetSearchResults = () => {
    const name = GetProductname();
    const [data, setData] = React.useState({})
    
    useEffect(() => {
        if(Object.keys(data).length === 0){
            const url = "http://localhost:3001/api/search?name=" + name;
        axios
            .get(url)
            .then((res) => {
            setData(res.data.data);
            })
        }
    })
    return data;
    //this data is an object with array of objects
    //{[{},{},{}]}
    //i chose this format as tablecontrol takes this format only
};

//Renders the past purchases in a table whose each row on cliking renders the specific product page.
//(TableControl) 25 rows are shown on one page. Rest are shown via pagination
const SearchDetails = () => {
    const navigate = useNavigate();
    let data = GetSearchResults()
    
    if(Object.keys(data).length > 0){
        return (
            <div>
                <NavBar/>
                <h5>Total Matching Products:  {data.length}</h5>
                <hr/>
                <TableControl
                    header={[
                    { key: "SNo", name: "#" },
                    { key: "productName", name: "Product Name" },
                    { key: "basePrice", name: "Base Price" }
                    ]}
                    itens={data}
                    onClickItem={function navProduct(data){
                        navigate(`/productPage?id=${data.productId}`);
                    }}

                    clickable
                    tableProps={{
                        hover: true,
                    }}
                    totalPosition="none"
                />
            </div>
        );
    }
    else{
        return (
            <div>
              <NavBar/>
              <h5>Total Matching Products: {Object.keys(data).length}</h5>
            </div>
        );
    }
}

export default SearchDetails;