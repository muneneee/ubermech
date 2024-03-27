import React, { useEffect, useState } from "react";

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
}

const AutocompleteAddress: React.FC<AutocompleteProps> = ({ onSelectSuggestion }) => {
  const [source, setSource] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [addressList, setAddressList] = useState<({ searchResults: { suggestions: Suggestion[] } }) | null>(null);
  const [destinationList, setDestinationList] = useState<({ searchResults: { suggestions: Suggestion[] } }) | null>(null);

  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [sourceCoordinates, setSourceCoordinates] = useState<any>([]);
  const [destinationCoordinates, setDestinationCoordinates] = useState<any>([]);


  useEffect(() => {
    const debounceFn = setTimeout(async () => {
      if (source.length > 0) {
        // Fetch suggestions for "Where From?"
        setIsLoading(true);
        const response = await fetch(`api/search-address?q=${source}`);
        if (!response.ok) {
          console.error("Error fetching address suggestions:", response.statusText);
          setIsLoading(false);
          return;
        }

        const result = await response.json();
        const suggestions = result.searchResults.suggestions.map((suggestion: { name: any; place_formatted: any; full_address: any; mapbox_id: any; }) => ({
          name: suggestion.name,
          place_formatted: suggestion.place_formatted,
          full_address: suggestion.full_address,
          mapbox_id: suggestion.mapbox_id
        }));
        setAddressList({ searchResults: { suggestions } });
      } else if (destination.length > 0) {
        setIsLoading(true);
        const response = await fetch(`api/search-address?q=${destination}`);
        if (!response.ok) {
          console.error("Error fetching destination suggestions:", response.statusText);
          setIsLoading(false);
          return;
        }

        const result = await response.json();
        const suggestions = result.searchResults.suggestions.map((suggestion: { name: any; place_formatted: any; full_address: any; mapbox_id: any; }) => ({
          name: suggestion.name,
          place_formatted: suggestion.place_formatted,
          full_address: suggestion.full_address,
          mapbox_id: suggestion.mapbox_id
        }));
        setDestinationList({ searchResults: { suggestions } });
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(debounceFn);
  }, [source, destination]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "whereFrom") {
      setSource(event.target.value);
    } else if (event.target.name === "whereTo") {
      setDestination(event.target.value);
    }
    setAddressList(null);
    setDestinationList(null); // Clear suggestions on new search
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

  const handleDestinationClick = async (suggestion: Suggestion) => {
    setDestination(`${suggestion.name} ${suggestion.place_formatted}`);
    setAddressList(null);
  
    const res=await fetch(MAPBOX_RETRIEVE_URL+suggestion.mapbox_id+"?session_token="+session_token+"&access_token="+process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN)

    const result=await res.json();

    setDestinationCoordinates({
      lng:result.features[0].geometry.coordinates[0],
      lat:result.features[0].geometry.coordinates[1],
    })

    console.log(result);
   
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
          value={destination}
          onChange={handleInputChange}
          name="whereTo"
        />
         {isLoading && <p>Loading suggestions...</p>}
        {destinationList && destinationList.searchResults.suggestions.length > 0 && (
          <ul>
            {destinationList.searchResults.suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleDestinationClick(suggestion)} className="p-3 hover:bg-gray-100 cursor-pointer">
                {suggestion.name} - {suggestion.place_formatted}
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
