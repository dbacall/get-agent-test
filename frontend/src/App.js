import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  /* This is example of how to fetch data from API */
  const [propertyData, setPropertyData] = useState(null);
  const [searchType, setSearchType] = useState('property id');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      // demo request to API (ensure it is running!)
      const resp = await fetch('/lrProperty/17401');
      const json = await resp.json();

      // if (json.success) setPropertyData(json.lrProperty);
    }

    fetchData();
  }, []);
  /* end example */

  const findProperties = async (e) => {
    e.preventDefault();

    let path = '';

    if (searchType === 'property id') path = searchQuery;
    if (searchType === 'street') path = `street/${searchQuery}`;

    const resp = await fetch(`/lrProperty/${path}`);
    const json = await resp.json();
    console.log('response', json);

    if (json.success) {
      setPropertyData(json.lrProperty);
      setSearchQuery('');
    }
  };

  const renderSearchOptions = () => {
    return (
      <ButtonGroup className="mb-2">
        <Button
          value="property id"
          onClick={(e) => setSearchType(e.target.value)}
        >
          Property Id
        </Button>
        <Button value="postcode" onClick={(e) => setSearchType(e.target.value)}>
          Postcode
        </Button>
        <Button value="street" onClick={(e) => setSearchType(e.target.value)}>
          Street
        </Button>
      </ButtonGroup>
    );
  };

  const renderSearchBar = () => {
    return (
      <Form inline onSubmit={findProperties}>
        <Form.Control
          className="mb-2 mr-sm-2"
          placeholder={`Search by ${searchType}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
        />
        <Button type="submit" className="mb-2">
          Search
        </Button>
      </Form>
    );
  };

  const renderPropertyDetails = () => {
    if (propertyData) {
      const {
        outcode,
        incode,
        paon,
        saon,
        street,
        lrTransactions,
      } = propertyData;
      return (
        <div className="property-details">
          <h5>
            {paon}, {saon}, {street}, {outcode} {incode}
          </h5>
          <h6>Transaction History</h6>
          {lrTransactions.map((transaction, index) => {
            return (
              <p key={index} className="transaction">
                {transaction.date} - £{transaction.price}
              </p>
            );
          })}
        </div>
      );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>GetAgent Search</h1>
      </header>
      <div className="search-options">
        <p>Search By:</p>
        {renderSearchOptions()}
      </div>
      <div className="search">{renderSearchBar()}</div>
      <div className="properties-container">{renderPropertyDetails()}</div>
    </div>
  );
}

export default App;
