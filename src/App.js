import { useEffect, useState } from "react";

export default function CitySelector() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [error, setError] = useState("");

  // Fetch Countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setError("");
        const res = await fetch("https://location-selector.labs.crio.do/countries");
        if (!res.ok) throw new Error("Failed Country API");
        const data = await res.json();
        setCountries(data);
      } catch (err) {
        setError("Unable to load countries");
        setCountries([]);
      }
    };
    fetchCountries();
  }, []);

  // Fetch States when country changes
  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState("");
    setSelectedCity("");
    setStates([]);
    setCities([]);

    if (!country) return;

    try {
      setError("");
      const res = await fetch(
        `https://location-selector.labs.crio.do/country=${country}/states`
      );
      if (!res.ok) throw new Error("Failed State API");
      const data = await res.json();
      setStates(data);
    } catch (err) {
      setError("Unable to load states");
      setStates([]);
    }
  };

  // Fetch Cities when state changes
  const handleStateChange = async (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity("");
    setCities([]);

    if (!state) return;

    try {
      setError("");
      const res = await fetch(
        `https://location-selector.labs.crio.do/country=${selectedCountry}/state=${state}/cities`
      );
      if (!res.ok) throw new Error("Failed City API");
      const data = await res.json();
      setCities(data);
    } catch (err) {
      setError("Unable to load cities");
      setCities([]);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h3>City Selector</h3>

      {/* Country */}
      <select
        data-testid="country-dropdown"
        value={selectedCountry}
        onChange={handleCountryChange}
      >
        <option value="">Select Country</option>
        {countries.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* State */}
      <select
        data-testid="state-dropdown"
        disabled={!selectedCountry}
        value={selectedState}
        onChange={handleStateChange}
      >
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* City */}
      <select
        data-testid="city-dropdown"
        disabled={!selectedState}
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        <option value="">Select City</option>
        {cities.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Corrected Selected Location Display */}
      {selectedCity && selectedState && selectedCountry && (
        <p data-testid="selected-location">
          You selected {selectedCity}, {selectedState}, {selectedCountry}
        </p>
      )}

      {error && <p data-testid="error-message">{error}</p>}
    </div>
  );
}
