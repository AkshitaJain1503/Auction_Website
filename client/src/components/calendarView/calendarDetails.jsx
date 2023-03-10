import React,{ useEffect,useState} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../navbar/index";
import { Link } from 'react-router-dom';
import styles from "../auctionSpace/styles.module.css";
import './calendarDetails.css';

 const CalendarDetails = () => {
    const navigate = useNavigate();
    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const productName = query.get('name');
    const date = query.get('date');
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3001/api/calendarDetails?name=${productName}&date=${date}` )
          .then(response => response.json())
          .then(data => 
            {
              setData(data.data);             
            }
          )
          .catch(error => console.error(error));
      }, []);

      const handleOnClickEvent = (product) => {
        navigate(`/productPage?id=${product.productId}`  );
      };

    return (
        <div>
            <NavBar />
             <div>
             <h1>Search results for "{productName}"</h1>
                 <h5>Total Matching Products: {data.length}</h5> 
            </div>
            <hr />
            {/* <div className={styles.backGroundSpace}> */}
            <ul className="card-grid">
                {data.map((product) => (
                    <li key={product.productId}>
                        {/* <Link to={"/"} className="card-link"> */}
                            <div onClick={() => handleOnClickEvent(product)} >
                            <article className="card" key={product.productId}  >
                            <div className="card-image">
                                <img src={product.img} alt={product.productName} />
                            </div>
                            <div className="card-content">
                                <h2 className="card-name">{product.productName}</h2>
                                <ol className="card-list">
                                    <ul>
                                        Base Price :
                                        { <span>{ product.basePrice}</span> }
                                    </ul>
                                    <ul>
                                        Shipment From: {product.shipment}
                                    </ul>
                                    <ul>
                                        Start Time: {product.StartTime}
                                    </ul>
                                    <ul>
                                        End Time: {product.EndTime}
                                    </ul>
                                </ol>
                                </div>
                        </article>
                        </div>
                    {/* </Link> */}
                </li>
            ))}
        </ul> 
        {/* </div> */}
    </div>
);
} 

export default CalendarDetails;
//http://localhost:3000/calendarView?name=st
