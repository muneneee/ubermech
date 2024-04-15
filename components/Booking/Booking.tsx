"use client";

import React, { useEffect, useState, useContext} from 'react'
import AutocompleteAddress from './AutocompleteAddress'
import { DirectionDataContext } from '@/context/DirectionDataContext'
import Options from './Options';
import Cards from './Cards';
import Axios from 'axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import 'intasend-inlinejs-sdk'


// Type definition for IntaSe

function Booking() {

   const {directionData, setDirectionData}=useContext(DirectionDataContext);

   const amount = directionData?.routes ? (directionData.routes[0].distance * 0.000023).toFixed(2) : '';
   console.log(amount);

  // Create IntaSend instance with type casting for options object
  new (window as any).IntaSend({
    publicAPIKey: "ISPubKey_test_62f8058d-5fdc-47d5-be6a-56cd160db250",
    live: false, // Set to true for live environment
})
    .on("COMPLETE", (response: any) => {
        console.log("Payment completed:", response);
    })
    .on("FAILED", (response: any) => {
        console.log("Payment failed:", response);
    })
    .on("IN-PROGRESS", () => {
        console.log("Payment in progress...");
    });
  return (
    <div className='p-5'>
        <h2 className='text-[20px] font-semibold'>Booking</h2>
        <div className='border-[1px] p-5 rounded-md' style={{height:500}}>
            <AutocompleteAddress />
            <Options />
            <Cards />
           
            <button className="intaSendPayButton w-full bg-purple-400 p-1 rounded-md mt-4" data-amount={amount} data-currency="KES">Book</button>
        </div>
    </div>
 );
}

export default Booking;


