import React,{ useEffect,useState} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../navbar/index";
import './calendarDetails.css';
import moment from 'moment';

 const CalendarDetails = () => {
    const navigate = useNavigate();
    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const productName = query.get('name');
    const date = query.get('date');
    const formattedDate = moment(date, 'YYYY-MM-DD').format('DD-MM-YYYY');
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
             <h1>Search results for "{productName}" on {formattedDate}</h1>
                 <h5>Total Matching Products: {data.length}</h5> 
            </div>
            <hr />
            <ul className="card-grid">
                {data.map((product) => (
                    <li key={product.productId}>
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
                </li>
            ))}
        </ul> 
    </div>
);
} 

export default CalendarDetails;
//http://localhost:3000/calendarView?name=st
