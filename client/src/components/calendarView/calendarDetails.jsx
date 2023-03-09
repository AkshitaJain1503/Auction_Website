import React,{ useEffect,useState} from 'react';
import { useLocation } from "react-router-dom";
import NavBar from "../navbar/index";
import { Link } from 'react-router-dom';
import styles from "../auctionSpace/styles.module.css";
import './calendarDetails.css';

 const CalendarDetails = () => {
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

    return (
        <div>
            <NavBar />
             <div>
                 <h5>Total Matching Products: {data.length}</h5> 
            </div>
            <hr />
            {/* <div className={styles.backGroundSpace}> */}
            <ul className="card-grid">
                {data.map((data) => (
                    <li>
                        <Link to={`/productPage?id=${data.productId}`} className="card-link">
                            <article className="card" key={data.productId}  >
                            <div className="card-image">
                                <img src={data.img} alt={data.productName} />
                            </div>
                            <div className="card-content">
                                <h2 className="card-name">{data.productName}</h2>
                                <ol className="card-list">
                                    <ul>
                                        Base Price :
                                        { <span>{ data.basePrice}</span> }
                                    </ul>
                                    <ul>
                                        Shipment From: {data.shipment}
                                    </ul>
                                    <ul>
                                        Start Time: {data.StartTime}
                                    </ul>
                                    <ul>
                                        End Time: {data.EndTime}
                                    </ul>
                                </ol>
                                </div>
                        </article>
                    </Link>
                </li>
            ))}
        </ul> 
        {/* </div> */}
    </div>
);
} 

export default CalendarDetails;