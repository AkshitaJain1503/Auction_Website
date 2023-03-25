import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const PostProduct = () => {
  // using navigate for smooth navigation to other page on onclick
  const navigate = useNavigate();
  // using country, state, city attributes and their useState functions
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [product, setProduct] = useState({
    productName: "",
    productDescription: "",
    productBasePrice: "",
    shipmentFromPlace: "",
    shipmentFromLatitude: "",
    shipmentFromLongitude: "",
    productImage: "",
    startDateTime: "",
    endDateTime: "",
  });

  // onchange handlers defined here for all inputs including file inputs
  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setProduct({ ...product, [name]: value });
  };
  const handlePhoto = async (e) => {
    let photo = e.target.name;
    setProduct({ ...product, [photo]: e.target.files[0] });
  };

  // postData gets on form submission and sends the info to the backend server
  const postData = async (e) => {
    e.preventDefault();
    
    // destructuring of all product attributes and storing them in constants
    const {
      productName,
      productDescription,
      productBasePrice,
      productImage,
      startDateTime,
      endDateTime,
    } = product;
    const shipmentFrom = selectedCity.name;

    // storing the place, latitude and longitude of shipment source using country-state-city npm package attributes
    const shipmentFromPlace =
      selectedCity.name + ", " + selectedState.name + ", " + selectedCountry.name;
    const shipmentFromLatitude = selectedCity.latitude;
    const shipmentFromLongitude = selectedCity.longitude;

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
    
    // storing all info in formdata for multi-part formdata encrypted type as image files are also to be transferred to the backend server
    const formdata = new FormData();
    formdata.append("productName", productName);
    formdata.append("productDescription", productDescription);
    formdata.append("productBasePrice", productBasePrice);
    formdata.append("shipmentFromPlace", shipmentFromPlace);
    formdata.append("shipmentFromLatitude", shipmentFromLatitude);
    formdata.append("shipmentFromLongitude", shipmentFromLongitude);
    formdata.append("productImage", productImage);
    formdata.append("startDateTime", startDateTime);
    formdata.append("endDateTime", endDateTime);

    alert("Please wait! Your product is getting posted.");

    // using post method to post the info to the server side
    const res = await fetch("http://localhost:3001/api/postProduct", {
      method: "POST",
      headers: {
        encType: "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: formdata,
    }).catch((err) => console.log(err));

    // data stores the product id obtained from the server side
    const data = await res.json();

    // checks if the response status is not found 
    // also checks for response being null
    if (res.status === 404 || !res) {
      // redirects to signup if user not logged in, and hence response not obtained
      window.location = "/signup";
    } else {
      // product details submitted and navigates to the individual product page
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
              <div className="my-3">
                <Label for="place">Shipment from: </Label>
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
                  required
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
                  required
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
                  required
                />
              </div>
              <div className="my-3">
                <Label for="image">Product Image*<span style={{fontSize: "10px"}}>(JPEG, JPG, WEBP, PNG types are allowed only)</span></Label>
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
                <Button type="submit" className="rounded-0" color="dark">
                  Post your product
                </Button>
              </Container>
            </Form>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default PostProduct;
