import React from 'react'
import { useLocation } from 'react-router-dom'

export default function ProductPage(props) {
  const {state} = useLocation();
  const {data} = state;
  return (
    <div>
      <h1>Individual Product Page {data.productName}</h1>
    </div>
  )
}
