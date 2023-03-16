import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import NavLoggedIn from "../navbar/navLoggedIn";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "../navbar/index";
import {
  Card,
  CardBody,
  Form,
  Input,
  Label,
  Button,
  Container,
} from "reactstrap";
import { Country, State, City } from "country-state-city";
import Select from "react-select";

// import ProductPage from "../productDetails/productPage";

// const convertToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.readAsDataURL(file);
//     fileReader.onload = () => {
//       resolve(fileReader.result);
//     };
//     fileReader.onerror = (error) => {
//       reject(error);
//     };
//   });
// };

const PostProduct = () => {
  const navigate = useNavigate();

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [product, setProduct] = useState({
    productName: "",
    productDescription: "",
    productBasePrice: "",
    shipmentFrom: "",
    productImage: "",
    startDateTime: "",
    endDateTime: "",
    // auctionStartDate: "",
    // auctionStartTime: "",
    // days: "",
    // hours: "",
    // minutes: ""
  });
  let name, value;
  const handleInput = (e) => {
    // console.log(e);
    name = e.target.name;
    value = e.target.value;
    setProduct({ ...product, [name]: value });
    // console.log(user.productImage);
  };
  const handlePhoto = async (e) => {
    let photo = e.target.name;
    // const value = await convertToBase64(e.target.files[0]);
    // let nvalue = JSON.stringify(value);
    setProduct({ ...product, [photo]: e.target.files[0] });
    // console.log(e.target.files[0]);
  };

  const postData = async (e) => {
    e.preventDefault();
    const {
      productName,
      productDescription,
      productBasePrice,
      productImage,
      startDateTime,
      endDateTime,
      // auctionStartDate,
      // auctionStartTime,
      // days,
      // hours,
      // minutes
    } = product;
    const shipmentFrom = selectedCity.name;

    // Validating auction start time and end time
    const now = new Date();
    const startTime = new Date(startDateTime);
    const endTime = new Date(endDateTime);
    if (startTime <= now || endTime <= now) {
      alert("Auction start time and end time must be in the future.");
      return;
    }
    if (startTime >= endTime) {
      alert("Auction start time must be before the auction end time.");
      return;
    }

    const formdata = new FormData();
    formdata.append("productName", productName);
    formdata.append("productDescription", productDescription);
    formdata.append("productBasePrice", productBasePrice);
    formdata.append("shipmentFrom", shipmentFrom);
    formdata.append("productImage", productImage);
    formdata.append("startDateTime", startDateTime);
    formdata.append("endDateTime", endDateTime);
    // formdata.append("auctionStartTime", auctionStartTime);
    // formdata.append("days", days);
    // formdata.append("hours", hours);
    // formdata.append("minutes", minutes);

    const res = await fetch("http://localhost:3001/api/postProduct", {
      method: "POST",
      headers: {
        encType: "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: formdata,
    }).catch((err) => console.log(err));

    const data = await res.json();
    if (data.status === 404 || !data) {
      window.location = "/signup";
    } else {
      alert("Product details submitted!");
      navigate(`/productPage?id=${data}`);
    }
  };
  return (
    <>
      <NavBar />
      <div className="wrapper">
        <Card className="shadow-sm">
          <CardBody>
            <h3>Post your product details for the advertisement</h3>
            <p>
              The fields marked with * symbol are required fields, kindly fill
              those before submitting the form.
            </p>
            <Form
              onSubmit={postData}
              method="POST"
              encType="multipart/form-data"
            >
              <div className="my-3">
                <Label for="productName">Product Name*</Label>
                <Input
                  id="productName"
                  name="productName"
                  type="text"
                  placeholder="Enter the product name here"
                  value={product.productName}
                  onChange={handleInput}
                  className="rounded-0"
                  required
                />
              </div>
              <div className="my-3">
                <Label for="description">Product Description</Label>
                <Input
                  id="description"
                  name="productDescription"
                  type="textarea"
                  value={product.productDescription}
                  onChange={handleInput}
                  placeholder="Enter your product details here"
                  className="rounded-0"
                  style={{ height: "150px" }}
                />
              </div>
              <div className="my-3">
                <Label for="basePrice">Base Price*</Label>
                <Input
                  id="basePrice"
                  name="productBasePrice"
                  type="text"
                  placeholder="Enter the base price of the product here"
                  value={product.productBasePrice}
                  onChange={handleInput}
                  className="rounded-0"
                  required
                />
              </div>
              {/* <div className="my-3">
                <Label for="startDate">Start Date*</Label>
                <Input 
                 id="startDate"
                 name="auctionStartDate"
                 type="date"
                 value={product.auctionStartDate}
                 onChange={handleInput}
                 className="rounded-0"
                 required
                /> 
              </div>
              <div className="my-3">
                <Label for="startTime">Start Time*</Label>
                <Input 
                 id="startTime"
                 name="auctionStartTime"
                 type="time"
                 value={product.auctionStartTime}
                 onChange={handleInput}
                 className="rounded-0"
                 required
                /> 
              </div> */}

              <div className="my-3">
                <Label for="startTime">Auction Start Date and Time*</Label>
                <Input
                  id="startTime"
                  name="startDateTime"
                  type="datetime-local"
                  value={product.startDateTime}
                  onChange={handleInput}
                  className="rounded-0"
                  required
                />
              </div>
              <div className="my-3">
                <Label for="endTime">Auction End Date and Time*</Label>
                <Input
                  id="endTime"
                  name="endDateTime"
                  type="datetime-local"
                  value={product.endDateTime}
                  onChange={handleInput}
                  className="rounded-0"
                  required
                />
              </div>

              {/* <div className="my-3">
                <Label for="duration">Duration*</Label>
                <br/>
                
                <input 
                 id="duration"
                 name="days"
                 type="number"
                 value={product.days}
                 onChange={handleInput}
                 style={{margin: "10px", borderRadius: "5px", border: "1px solid #c7baba", marginLeft: "20px"}}
                 required
                /> days
                <input 
                 id="duration"
                 name="hours"
                 type="number"
                 value={product.hours}
                 onChange={handleInput}
                 style={{margin: "10px", borderRadius: "5px", border: "1px solid #c7baba", marginLeft: "50px"}}
                  required
                /> hours
                <input 
                 id="duration"
                 name="minutes"
                 type="number"
                 value={product.minutes}
                 onChange={handleInput}
                 style={{margin: "10px", borderRadius: "5px", border: "1px solid #c7baba", marginLeft: "50px"}}
                 required
                /> minutes 
                
              </div> */}
              <div className="my-3">
                <Label for="place">Shipment from: </Label>
                {/* <Input
                  id="place"
                  name="shipmentFrom"
                  type="select"
                  value={product.shipmentFrom}
                  onChange={handleInput}
                  placeholder="Enter here"
                  className="rounded-0"
                  required
                >
                  <option value="choose location">Choose location</option>
                  <option>Bangalore</option>
                  <option>Hyderabad</option>
                  <option>Kolkata</option>
                  <option>Mumbai</option>
                  <option>Delhi</option>
                  <option>Chennai</option>
                  <option>Ahmedabad</option>
                  <option>Pune</option>
                  <option>Surat</option>
                </Input> */}
                <br></br>
                <Label for="country">Country name* </Label>
                <Select
                  options={Country.getAllCountries()}
                  getOptionLabel={(options) => {
                    return options["name"];
                  }}
                  getOptionValue={(options) => {
                    return options["name"];
                  }}
                  value={selectedCountry}
                  onChange={(item) => {
                    setSelectedCountry(item);
                  }}
                />
                <Label for="country">State name* </Label>
                <Select
                  options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
                  getOptionLabel={(options) => {
                    return options["name"];
                  }}
                  getOptionValue={(options) => {
                    return options["name"];
                  }}
                  value={selectedState}
                  onChange={(item) => {
                    setSelectedState(item);
                  }}
                />
                <Label for="country">City name* </Label>
                <Select
                  options={City.getCitiesOfState(
                    selectedState?.countryCode,
                    selectedState?.isoCode
                  )}
                  getOptionLabel={(options) => {
                    return options["name"];
                  }}
                  getOptionValue={(options) => {
                    return options["name"];
                  }}
                  value={selectedCity}
                  onChange={(item) => {
                    setSelectedCity(item);
                  }}
                />
              </div>
              <div className="my-3">
                <Label for="image">Product Image*</Label>
                <Input
                  required
                  id="image"
                  name="productImage"
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                />
              </div>
              <Container className="text-center">
                <Button type="submit" className="rounded-0" color="primary">
                  Post your product
                </Button>
                {/* <Button type="submit" className="rounded-0 ms-2" color="danger">
                  Reset Content
                </Button> */}
              </Container>
            </Form>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default PostProduct;
