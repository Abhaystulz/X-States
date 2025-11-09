import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!!formData.country) fetchStates();
    setCities([]);
  }, [formData.country]);

  useEffect(() => {
    if (!!formData.state) fetchCities();
    setFormData((data) => ({ ...data, city: "" }));
  }, [formData.state]);

  const fetchCountries = async () => {
    try {
      const country = await fetch(
        `https://crio-location-selector.onrender.com/countries`
      );
      const respCountry = await country.json();
      setCountries(respCountry);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchStates = async () => {
    try {
      const state = await fetch(
        `https://crio-location-selector.onrender.com/country=${formData.country}/states`
      );
      const respState = await state.json();
      setStates(respState);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchCities = async () => {
    try {
      const city = await fetch(
        `https://crio-location-selector.onrender.com/country=${formData.country}/state=${formData.state}/cities`
      );
      const respCity = await city.json();
      setCities(respCity);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="App">
      <h1>Select Location</h1>
      <div className="App-data">
        <select
          value={formData.country}
          onChange={(e) => {
            setFormData((data) => ({ ...data, country: e.target.value }));
          }}
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
      {!!formData.city && (
        <p>
          You selected {formData.city}, {formData.state}, {formData.country}
        </p>
      )}
    </div>
  );
}

export default App;
