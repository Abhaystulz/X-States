import "./App.css";
import { useState, useEffect } from "react";

const BASE_URL = "https://location-selector.labs.crio.do";

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (formData.country) {
      fetchStates();
      setFormData((data) => ({ ...data, state: "", city: "" }));
      setCities([]);
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      fetchCities();
      setFormData((data) => ({ ...data, city: "" }));
    }
  }, [formData.state]);

  const fetchCountries = async () => {
    try {
      const res = await fetch(`${BASE_URL}/countries`);
      const data = await res.json();
      setCountries(data);
      setError("");
    } catch {
      setError("Failed to load countries");
    }
  };

  const fetchStates = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/country=${formData.country}/states`
      );
      const data = await res.json();
      setStates(data);
      setError("");
    } catch {
      setError("Failed to load states");
    }
  };

  const fetchCities = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/country=${formData.country}/state=${formData.state}/cities`
      );
      const data = await res.json();
      setCities(data);
      setError("");
    } catch {
      setError("Failed to load cities");
    }
  };

  return (
    <div className="App">
      <h1>Select Location</h1>

      {error && <p className="error">{error}</p>}

      <div className="App-data">
        <select
          data-testid="country-select"
          value={formData.country}
          onChange={(e) =>
            setFormData((data) => ({ ...data, country: e.target.value }))
          }
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          data-testid="state-select"
          disabled={!formData.country}
          value={formData.state}
          onChange={(e) =>
            setFormData((data) => ({ ...data, state: e.target.value }))
          }
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          data-testid="city-select"
          disabled={!formData.state}
          value={formData.city}
          onChange={(e) =>
            setFormData((data) => ({ ...data, city: e.target.value }))
          }
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {formData.city && (
        <p data-testid="selected-location">
          You selected {formData.city}, {formData.state}, {formData.country}
        </p>
      )}
    </div>
  );
}

export default App;


