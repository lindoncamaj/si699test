import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Form() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [carType, setCarType] = useState({
    sedan: false,
    suv: false,
    truck: false,
  });
  const [carMake, setCarMake] = useState([]);
  const [makes, setMakes] = useState([]);
  // const [recommendations, setRecommendations] = useState({});

  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/makes")
      .then((response) => {
        setMakes(response.data.data || []); // Store the "data" array from API response
      })
      .catch((err) => {
        console.error("API Error:", err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(minPrice, maxPrice, location, carMake, carType);

    // Validation check: Ensure all fields are filled
    if (!minPrice || !maxPrice || !location || !carMake || !Object.values(carType).includes(true)) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    const data = {
      minPrice,
      maxPrice,
      location,
      carType,
      carMake
    };

    // Navigate to Recs page and pass form data
    axios.post("http://localhost:8080/recommend", data).then((response) => {navigate("/recs", {state: response.data})});
  };

  const handleCarTypeChange = (sub) => {
    setCarType((prev) => ({
      ...prev,
      [sub]: !prev[sub],
    }));
  };
  const handleReset = () => {
    // Reset all state variables here
    setMinPrice("");
    setMaxPrice("");
    setLocation("");
    setCarType({
      sedan: true,
      suv: false,
      truck: false,
    });
    setCarMake("");
  };
  return (
    <div className="Form">
      <h1>Match My Car</h1>
      <fieldset>
        <form action="#" method="get">
          <label htmlFor="minPrice">Minimum Price ($)</label>
          <input
            type="number"
            name="minPrice"
            id="minPrice"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Enter min price"
            required
          />
          <label htmlFor="maxPrice">Maximum Price ($)</label>
          <input
            type="number"
            name="maxPrice"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Enter max price"
            required
          />
          <label htmlFor="location">Location*</label>
          <input
            type="text"
            name="location"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter City or Zip Code"
            required
          />
          <label htmlFor="carType">Car Type</label>
          <input
            type="checkbox"
            name="carType"
            id="sedan"
            checked={carType.sedan === true}
            onChange={(e) => handleCarTypeChange("sedan")}
          />
          Sedan
          <input
            type="checkbox"
            name="carType"
            id="suv"
            checked={carType.suv === true}
            onChange={(e) => handleCarTypeChange("suv")}
          />
          SUV
          <input
            type="checkbox"
            name="carType"
            id="truck"
            checked={carType.truck === true}
            onChange={(e) => handleCarTypeChange("truck")}
          />
          Truck
          <label>Car Make</label>
          <select
            name="select"
            id="select"
            value={carMake}
            onChange={(e) => setCarMake(e.target.value)}
          >
            <option value="" disabled selected={carMake === ""}>
              Select an Option
            </option>

            {makes.map((make) => (
              <option key={make.id} value={make.name}>
                {make.name}
              </option>
            ))}
          </select>
          <button
            id="reset"
            type="reset"
            value="reset"
            onClick={() => handleReset()}
          >
            Reset
          </button>
          <button
            id="submit"
            type="submit"
            value="Submit"
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </button>
        </form>
      </fieldset>
    </div>
  );
}

export default Form;
