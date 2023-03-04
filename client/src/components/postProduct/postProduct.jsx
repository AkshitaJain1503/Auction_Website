import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavLoggedIn from "../navbar/navLoggedIn";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Card,
  CardBody,
  Form,
  Input,
  Label,
  Button,
  Container,
} from "reactstrap";
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
  const [product, setProduct] = useState({
    productName: "",
    productDescription: "",
    productBasePrice: "",
    shipmentFrom: "",
    productImage: "",
    auctionStartDate: "",
    auctionStartTime: "",
    auctionDuration: ""
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
      shipmentFrom,
      productImage,
      auctionStartDate,
      auctionStartTime,
      auctionDuration
    } = product;
    const formdata = new FormData();
    formdata.append("productName", productName);
    formdata.append("productDescription", productDescription);
    formdata.append("productBasePrice", productBasePrice);
    formdata.append("shipmentFrom", shipmentFrom);
    formdata.append("productImage", productImage);
    formdata.append("auctionStartDate", auctionStartDate);
    formdata.append("auctionStartTime", auctionStartTime);
    formdata.append("auctionDuration", auctionDuration);

    const res = await fetch("http://localhost:3001/api/postProduct", {
      method: "POST",
      headers: {
        "encType": "multipart/form-data",
        "Authorization": "Bearer "+localStorage.getItem("token")
      },
      body: formdata
    }).catch((err)=> console.log(err));
    
    const data = await res.json();
    // console.log(data);
    if (data.status === 404 || !data) {
      window.location = "/signup";
    } else {
      //console.log("data fetched!");
      // <Redirect to="/"></Redirect>
      alert('Product details submitted!');
      // const element = <ProductPage name="90"/>
      // navigate(`/productPage/${data}`, {state : {data : data}});
      navigate("/productPage", {state : {data : data}});
    }
  };
  return (
    <>
    <NavLoggedIn/>
      <div className="wrapper">
        <Card className="shadow-sm">
          <CardBody>
            <h3>Post your product details for the advertisement</h3>
            <p>The fields marked with * symbol are required fields, kindly fill those before submitting the form.</p>
            <Form onSubmit={postData} method="POST" encType="multipart/form-data">
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
              </div>
              <div className="my-3">
                <Label for="duration">Duration in hh:mm format (in hours and minutes)*</Label>
                <Input 
                 id="duration"
                 name="auctionDuration"
                 type="time"
                 value={product.auctionDuration}
                 onChange={handleInput}
                 className="rounded-0"
                 required
                /> 
              </div>
              <div className="my-3">
                <Label for="place">Shipment from*</Label>
                <Input
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
                </Input>
              </div>
              <div className="my-3">
                <Label for="image">Product Image</Label>
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
                <Button
                  type="submit"
                  className="rounded-0"
                  color="primary"
                >
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
