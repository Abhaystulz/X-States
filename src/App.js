import "./App.css";
import { useState, useEffect, useCallback } from "react";

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
  });

  const fetchCountries = useCallback(async () => {
    try {
      const response = await fetch(
        `https://crio-location-selector.onrender.com/countries`
      );
      const data = await response.json();
      setCountries(data);
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  const fetchStates = useCallback(async () => {
    try {
      const response = await fetch(
        `https://crio-location-selector.onrender.com/country=${formData.country}/states`
      );
      const data = await response.json();
      setStates(data);
    } catch (err) {
      console.log(err.message);
    }
  }, [formData.country]);

  const fetchCities = useCallback(async () => {
    try {
      const response = await fetch(
        `https://crio-location-selector.onrender.com/country=${formData.country}/state=${formData.state}/cities`
      );
      const data = await response.json();
      setCities(data);
    } catch (err) {
      console.log(err.message);
    }
  }, [formData.country, formData.state]);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  useEffect(() => {
    if (formData.country) {
      fetchStates();
      setCities([]);
      setFormData((data) => ({ ...data, state: "", city: "" }));
    }
  }, [formData.country, fetchStates]);

  useEffect(() => {
    if (formData.state) {
      fetchCities();
      setFormData((data) => ({ ...data, city: "" }));
    }
  }, [formData.state, fetchCities]);

  return (
    <div className="App">
      <h1>Select Location</h1>
      <div className="App-data">
        <select
          value={formData.country}
          onChange={(e) =>
            setFormData((data) => ({ ...data, country: e.target.value }))
          }
        >
          <option value="" disabled>
            Select Country
          </option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          value={formData.state}
          onChange={(e) =>
            setFormData((data) => ({ ...data, state: e.target.value }))
          }
        >
          <option value="" disabled>
            Select State
          </option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          value={formData.city}
          onChange={(e) =>
            setFormData((data) => ({ ...data, city: e.target.value }))
          }
        >
          <option value="" disabled>
            Select City
          </option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {formData.city && (
        <p>
          You selected {formData.city}, {formData.state}, {formData.country}
        </p>
      )}
    </div>
  );
}

export default App;

