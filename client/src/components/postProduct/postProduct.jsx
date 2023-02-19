import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const PostProduct = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    productName: "",
    productDescription: "",
    productBasePrice: "",
    shipmentFrom: "",
    productImage: "",
  });
  let name, value;
  const handleInput = (e) => {
    // console.log(e);
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });
    // console.log(user.productImage);
  };
  const handlePhoto = async (e) => {
    let photo = e.target.name;
    const value = await convertToBase64(e.target.files[0]);
    // let nvalue = JSON.stringify(value);
    console.log(value);
    // console.log(value.);
    setUser({ ...user, [photo]: value });
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
    } = user;

    const res = await fetch("http://localhost:3001/api/postProduct", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer "+localStorage.getItem("token")
      },
      body: JSON.stringify({
        productName,
        productDescription,
        productBasePrice,
        shipmentFrom,
        productImage,
      }),
    });
    //console.log(res);

    // console.log(res);
    const data = await res.json();

    if (data.status === 404 || !data) {
      window.location = "/signup";
    } else {
      //console.log("data fetched!");
      // <Redirect to="/"></Redirect>
      alert('Product details submitted!');
      navigate("/productPage");
    }
  };
  return (
    <>
      <div className="wrapper">
        <Card className="shadow-sm">
          <CardBody>
            <h3>Post your product details for the advertisement</h3>
            <Form method="POST" encType="multipart/form-data">
              <div className="my-3">
                <Label for="productName">Product Name*</Label>
                <Input
                  id="productName"
                  name="productName"
                  type="text"
                  placeholder="Enter the product name here"
                  value={user.productName}
                  onChange={handleInput}
                  className="rounded-0"
                />
              </div>
              <div className="my-3">
                <Label for="description">Product Description</Label>
                <Input
                  id="description"
                  name="productDescription"
                  type="textarea"
                  value={user.productDescription}
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
                  value={user.productBasePrice}
                  onChange={handleInput}
                  className="rounded-0"
                />
              </div>
              <div className="my-3">
                <Label for="place">Shipment from*</Label>
                <Input
                  id="place"
                  name="shipmentFrom"
                  type="select"
                  value={user.shipmentFrom}
                  onChange={handleInput}
                  placeholder="Enter here"
                  className="rounded-0"
                >
                  <option value="choose location">Choose location</option>
                  <option>Bangalore</option>
                  <option>Hyderabad</option>
                  <option>Kolkata</option>
                  <option>Mumbai</option>
                </Input>
              </div>
              <div className="my-3">
                <Label for="image">Product Image</Label>
                <Input
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
                  onClick={postData}
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
