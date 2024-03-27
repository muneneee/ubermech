"use client";

import { UserLocationContext } from '@/context/UserLocationContext';
import React, { useContext, useEffect, useRef } from 'react';
import { Map, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Markers from './Markers';
import { DestinationCordiContext } from '@/context/DestinationCordiContext';
import { SourceCordiContext } from '@/context/SourceCordiContext';
import { DirectionDataContext } from '@/context/DirectionDataContext';
import MapBoxRoute from './MapBoxRoute';

const MAPBOX_DRIVING_ENDPOINT="https://api.mapbox.com/directions/v5/mapbox/driving/"
const session_token="5ccce4a4-ab0a-4a7c-943d-580e55542363";

function MapBoxMap() {

  const mapRef=useRef<any>();

  const {sourceCoordinates, setSourceCoordinates} = useContext(SourceCordiContext);
  const {destinationCoordinates, setDestinationCoordinates} = useContext(DestinationCordiContext);


  const {userLocation,setUserLocation}=useContext(UserLocationContext)
  const {directionData, setDirectionData}=useContext(DirectionDataContext);

  //used to fly to destination markers location

  useEffect(()=>{
    if(sourceCoordinates){
      mapRef.current?.flyTo({
        center:[sourceCoordinates.lng, sourceCoordinates.lat],
        duration:2500
      })
    }
    if(SourceCordiContext&&destinationCoordinates){
      getDirectionRoute();
    }
  },[sourceCoordinates])

  //used to fly to destination markers location
  useEffect(()=>{
    if(destinationCoordinates){
      mapRef.current?.flyTo({
        center:[destinationCoordinates.lng, destinationCoordinates.lat],
        duration:2500
      })
    }
  },[destinationCoordinates]);

  const getDirectionRoute=async()=>{
    const res=await fetch(MAPBOX_DRIVING_ENDPOINT+
      sourceCoordinates.lng+","+
      sourceCoordinates.lat+";"+
      destinationCoordinates.lng+","+
      destinationCoordinates.lat+
      "?overview=full&geometries=geojson" + 
      "&access_token=" +
      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
      {
        headers:{
          "Content-Type": "application/json",
        }
      }
      );
      const result=await res.json();
      console.log(result);
      setDirectionData(result);
  }

  return (
    <div className='p-5'>
        <h2 className='text-[20px] font-semibold'>Map</h2>
         <div className='rounded-lg overflow-hidden'>
            {userLocation? <Map
            ref={mapRef}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                initialViewState={{
                    longitude: userLocation?.lng,
                    latitude: userLocation?.lat,
                    zoom: 14
                }}
                style={{width: '100%', height: 450,borderRadius:10}}
                mapStyle="mapbox://styles/mapbox/streets-v9"
            >
            <Markers />
            {directionData?.routes? (
              <MapBoxRoute 
                coordinates={directionData?.routes[0]?.geometry?.coordinates}
              />
            ) : null}
              
            </Map>:null}
         </div>
    </div>
  )
}

export default MapBoxMap