import React, { useEffect, useState } from "react";

interface Suggestion {
  name: string;
  place_formatted: string;
}

interface AutocompleteProps {
  onSelectSuggestion?: (suggestion: Suggestion) => void; // Optional callback for handling selected suggestion
}

const AutocompleteAddress: React.FC<AutocompleteProps> = ({ onSelectSuggestion }) => {
  const [source, setSource] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [addressList, setAddressList] = useState<({ searchResults: { suggestions: Suggestion[] } }) | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state

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
        const suggestions = result.searchResults.suggestions.map((suggestion: { name: any; place_formatted: any; }) => ({
          name: suggestion.name,
          place_formatted: suggestion.place_formatted,
        }));
        setAddressList({ searchResults: { suggestions } });
      } else if (destination.length > 0) {
        // Fetch suggestions for "Where To?" (optional logic)
        setIsLoading(true);
        const response = await fetch(`api/search-address-to?q=${destination}`); // Modify API endpoint (example)
        if (!response.ok) {
          console.error("Error fetching address suggestions:", response.statusText);
          setIsLoading(false);
          return;
        }

        const result = await response.json();
        const suggestions = result.searchResults.suggestions.map((suggestion: { name: any; place_formatted: any; }) => ({
          name: suggestion.name,
          place_formatted: suggestion.place_formatted,
        }));
        setAddressList({ searchResults: { suggestions } });
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
    setAddressList(null); // Clear suggestions on new search
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    }
    // Optionally clear suggestions or set source/destination to selected address
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
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
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
        
      </div>
    </div>
  );
};

export default AutocompleteAddress;