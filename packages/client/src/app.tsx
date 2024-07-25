import { useState, type ChangeEvent } from "react";
import { getCodeSandboxHost } from "@codesandbox/utils";

type Hotel = {
  _id: string;
  chain_name: string;
  hotel_name: string;
  city: string;
  country: string;
};

type Country = {
  countryisocode: string;
  country: string;
};

type City = {
  name: string;
};

type Accomodation = {
  hotels: [],
  countries: [],
  cities: []
}

const codeSandboxHost = getCodeSandboxHost(3001);
const API_URL = codeSandboxHost
  ? `https://${codeSandboxHost}`
  : "http://localhost:3001";

const fetchAccomodations = async (query: string) => {
  const response = await fetch(`${API_URL}/accomodations`, {
    method: "POST",
    body: JSON.stringify({
      query,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  console.log('Fetched Accomodations:', response);
  return response.json();
};

function App() {

  // set the required local states to render the search result
  const [showClearBtn, setShowClearBtn] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [accommodations, setAccomodations] = useState<Accomodation | null>();
  

  const fetchData = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setSearchQuery('');
      setShowClearBtn(false);
      setAccomodations(null);
      return;
    }
    
    setSearchQuery(event.target.value);
    const filteredAccomodations = await fetchAccomodations(event.target.value);
    setShowClearBtn(true);
    setAccomodations(filteredAccomodations);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setAccomodations(null);
    setShowClearBtn(false)
  };
  
  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="dropdown">
              <div className="form">
                <i className="fa fa-search"></i>
                <input
                  type="text"
                  className="form-control form-input"
                  placeholder="Search accommodation..."
                  value={searchQuery}
                  onChange={fetchData}
                />
                {showClearBtn && (
                  <span className="left-pan" onClick={clearSearch}>
                    <i className="fa fa-close"></i>
                  </span>
                )}
              </div>
              {!!accommodations && (
                <div className="search-dropdown-menu dropdown-menu w-100 show p-2">
                  <h2>Hotels</h2>
                  {accommodations?.hotels?.length ? (
                    accommodations?.hotels.map((hotel: Hotel, index) => (
                      <li key={index}>
                        <a
                          href={`/hotels/${hotel?._id}`}
                          className="dropdown-item"
                        >
                          <i className="fa fa-building mr-2"></i>
                          {hotel?.hotel_name}
                        </a>
                        <hr className="divider" />
                      </li>
                    ))
                  ) : (
                    <p>No hotels matched</p>
                  )}
                  <h2>Countries</h2>
                  {accommodations?.countries?.length ? (
                    accommodations?.countries.map((country: Country, index) => (
                      <li key={index}>
                        <a
                          href={`/countries/${country?.countryisocode}`}
                          className="dropdown-item"
                        >
                          <i className="fa fa-building mr-2"></i>
                          {country?.country}
                        </a>
                        <hr className="divider" />
                      </li>
                    ))
                  ) : (
                    <p>No countries matched</p>
                  )}
                  <h2>Cities</h2>
                  {accommodations?.cities?.length ? (
                    accommodations?.cities.map((city: City, index) => (
                      <li key={index}>
                        <a
                          href={`/cities/${city}`}
                          className="dropdown-item"
                        >
                          <i className="fa fa-building mr-2"></i>
                          {city?.name}
                        </a>
                        <hr className="divider" />
                      </li>
                    ))
                  ) : (
                    <p>No cities matched</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
