"use client";

import Booking from "@/components/Booking/Booking";
import MapBoxMap from "@/components/Map/MapBoxMap";
import { UserLocationContext } from "@/context/UserLocationContext";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {

  const  [userLocation,setUserLocation]=useState<any>();

  useEffect(()=>{
    getUserLocation();
  },[])

  const getUserLocation=()=>{
    navigator.geolocation.getCurrentPosition(function(pos){
      setUserLocation({
        lat:pos.coords.latitude,
        lng:pos.coords.longitude
      })
    })
  }


  return (
    <div>
      <UserLocationContext.Provider value={{userLocation, setUserLocation}}>
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div>
            <Booking />
          </div>
          <div className="col-span-2">
            <MapBoxMap />
          </div>
        </div>
      </UserLocationContext.Provider>
    </div>
  );
}
