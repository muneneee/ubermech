"use client";

import Booking from "@/components/Booking/Booking";
import MapBoxMap from "@/components/Map/MapBoxMap";
import { UserLocationContext } from "@/context/UserLocationContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import {NextUIProvider} from "@nextui-org/react";
import { SourceCordiContext } from "@/context/SourceCordiContext";
import { DestinationCordiContext } from "@/context/DestinationCordiContext";
import { DirectionDataContext } from "@/context/DirectionDataContext";


export default function Home() {

  const  [userLocation,setUserLocation]=useState<any>();
  const [sourceCoordinates, setSourceCoordinates] = useState<any>([]);
  const [destinationCoordinates, setDestinationCoordinates] = useState<any>([]);
  const [directionData, setDirectionData] = useState<any>([]);




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
        <SourceCordiContext.Provider value={{sourceCoordinates, setSourceCoordinates}}>
        <DestinationCordiContext.Provider value={{destinationCoordinates, setDestinationCoordinates}}>
        <DirectionDataContext.Provider value={{directionData, setDirectionData}}>
          <div className="grid grid-cols-1 md:grid-cols-3">
                <div>
                  <Booking />
                </div>
                <div className="col-span-2">
                  <MapBoxMap />
                </div>
          </div>
        </DirectionDataContext.Provider>
        
        </DestinationCordiContext.Provider>
        </SourceCordiContext.Provider>
  
        </UserLocationContext.Provider>
      </div>    
  );
}
