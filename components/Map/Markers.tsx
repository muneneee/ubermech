import { DestinationCordiContext } from '@/context/DestinationCordiContext';
import { SourceCordiContext } from '@/context/SourceCordiContext';
import { UserLocationContext } from '@/context/UserLocationContext';
import React, { useContext } from 'react'
import { Map, Marker } from 'react-map-gl';


function Markers() {

    const {userLocation,setUserLocation}=useContext(UserLocationContext)

    const {sourceCoordinates, setSourceCoordinates} = useContext(SourceCordiContext);
    const {destinationCoordinates, setDestinationCoordinates} = useContext(DestinationCordiContext);



    return (
        <div>
            {/* user location marker */}
            <Marker longitude={userLocation?.lng} latitude={userLocation?.lat} anchor="bottom" >
                    <img src="./pin.png" 
                    className='w-10 h-10'
                    />
            </Marker>

            {/* Source marker */}
            {sourceCoordinates.length!=0? <Marker longitude={sourceCoordinates?.lng} latitude={sourceCoordinates?.lat} anchor="bottom" >
                    <img src="./pin.png" 
                    className='w-10 h-10'
                    />
            </Marker>:null}
            {/* Destination marker */}
            {destinationCoordinates.length!=0? <Marker longitude={destinationCoordinates?.lng} latitude={destinationCoordinates?.lat} anchor="bottom" >
                    <img src="./pin.png" 
                    className='w-10 h-10'
                    />
            </Marker>:null}

        </div>
    )
}

export default Markers