import { DestinationCordiContext } from "@/context/DestinationCordiContext";
import { SourceCordiContext } from "@/context/SourceCordiContext";
import React, { useContext, useEffect, useState } from "react";

const session_token = '5ccce4a4-ab0a-4a7c-943d-580e55542363';
const MAPBOX_RETRIEVE_URL = 'https://api.mapbox.com/search/searchbox/v1/retrieve/';

interface Suggestion {
  name: string;
  place_formatted: string;
  full_address: string;
  mapbox_id: string;
}

interface AutocompleteProps {
  onSelectSuggestion?: (suggestion: Suggestion) => void; // Optional callback for handling selected suggestion
  onSelectDestination?: (destination: Suggestion) => void; // Optional callback for handling selected suggestion

}

const AutocompleteAddress: React.FC<AutocompleteProps> = ({ onSelectSuggestion }) => {
  const [source, setSource] = useState<string>("");
  const [dest, setDest] = useState<string>("");
  const [addressList, setAddressList] = useState<({ searchResults: { suggestions: Suggestion[] } }) | null>(null);
  const [destinationList, setDestinationList] = useState<({ searchResults: { suggestions: Suggestion[] } }) | null>(null);

  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const { sourceCoordinates, setSourceCoordinates } = useContext(SourceCordiContext);
  const { destinationCoordinates, setDestinationCoordinates } = useContext(DestinationCordiContext);

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSource(event.target.value);
    if (source.length > 0) {
      setIsLoading(true);
      const sourcePromise = fetch(`api/search-address?q=${source}`);
      const [sourceResponse] = await Promise.all([sourcePromise]);

      if (!sourceResponse.ok) {
        throw new Error(`Error fetching suggestions for '${source}': ${sourceResponse.statusText}`);
      }
      try {
        const sourceResult = await sourceResponse.json();
        
        
        const sourceSuggestions = sourceResult.searchResults.suggestions.map((suggestion: { name: any; place_formatted: any; full_address: any; mapbox_id: any; }) => ({
          name: suggestion.name,
          place_formatted: suggestion.place_formatted,
          full_address: suggestion.full_address,
          mapbox_id: suggestion.mapbox_id,
        }));
        setAddressList({ searchResults: { suggestions: sourceSuggestions } });
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setAddressList(null);
    }
  };

  const handleDestinationInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const desti =event.target.value;
    setDest(desti);
    if (dest.length > 0) {
      setIsLoading(true);
      const destinationPromise = fetch(`api/search-address?q=${dest}`);
      const [destinationResponse] = await Promise.all([destinationPromise]);

      if (!destinationResponse.ok) {
        throw new Error(`Error fetching suggestions for '${dest}': ${destinationResponse.statusText}`);
      }
      try {
        const destinationResult = await destinationResponse.json();
        
        const destinationSuggestions = destinationResult.searchResults.suggestions.map((destination: { name: any; place_formatted: any; full_address: any; mapbox_id: any; }) => ({
          name: destination.name,
          place_formatted: destination.place_formatted,
          full_address: destination.full_address,
          mapbox_id: destination.mapbox_id,
        }));
        setDestinationList({ searchResults: { suggestions: destinationSuggestions } });
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setDestinationList(null);
    }
  };



  const handleSuggestionClick = async (suggestion: Suggestion) => {
    setSource(`${suggestion.name} ${suggestion.place_formatted}`);
    setAddressList(null);
  
    const res=await fetch(MAPBOX_RETRIEVE_URL+suggestion.mapbox_id+"?session_token="+session_token+"&access_token="+process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN)

    const result=await res.json();

    setSourceCoordinates({
      lng:result.features[0].geometry.coordinates[0],
      lat:result.features[0].geometry.coordinates[1],
    })

   
  };

  const handleDestinationClick = async (destination: Suggestion) => {
    setDest(`${destination.name} ${destination.place_formatted}`);
    setDestinationList(null);
  
    const resp=await fetch(MAPBOX_RETRIEVE_URL+destination.mapbox_id+"?session_token="+session_token+"&access_token="+process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN)

    const resultDest=await resp.json();

    setDestinationCoordinates({
      lng:resultDest.features[0].geometry.coordinates[0],
      lat:resultDest.features[0].geometry.coordinates[1],
    })

    console.log(resultDest);
   
  };

  return (
    <div className="mt-5">
      <div>
        <label className="text-gray-400">Where From?</label>
        <input
          type="text"
          className="bg-white p-1 border-[1px] w-full rounded-md outline-none focus:border-purple-400"
          value={source}
          onChange={handleInputChange}
          name="whereFrom"
        />
        {isLoading && <p>Loading suggestions...</p>}
        {addressList && addressList.searchResults.suggestions.length > 0 && (
          <ul>
            {addressList.searchResults.suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)} className="p-3 hover:bg-gray-100 cursor-pointer">
                {suggestion.name} - {suggestion.place_formatted}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-3">
        <label className="text-gray-400">Where To?</label>
        <input
          type="text"
          className="bg-white p-1 border-[1px] w-full rounded-md outline-none focus:border-purple-400"
          value={dest}
          onChange={handleDestinationInputChange}
          name="whereTo"
        />
         {isLoading && <p>Loading suggestions...</p>}
        {destinationList && destinationList.searchResults.suggestions.length > 0 && (
          <ul>
            {destinationList.searchResults.suggestions.map((destination, index) => (
              <li key={index} onClick={() => handleDestinationClick(destination)} className="p-3 hover:bg-gray-100 cursor-pointer">
                {destination.name} - {destination.place_formatted}
              </li>
            ))}
          </ul>
        )}
        
      </div>
    </div>
  );
};

export default AutocompleteAddress;

function setSourceChange(arg0: boolean) {
  throw new Error("Function not implemented.");
}
