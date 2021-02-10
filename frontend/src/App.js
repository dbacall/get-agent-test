import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  /* This is example of how to fetch data from API */
  const [propertyData, setPropertyData] = useState(null);
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

    const resp = await fetch(`/lrProperty/${searchQuery}`);
    const json = await resp.json();
    console.log('response', json);

    if (json.success) {
      setPropertyData(json.lrProperty);
      setSearchQuery('');
    }
  };

  const renderSearchBar = () => {
    return (
      <Form inline onSubmit={findProperties}>
        <Form.Control
          className="mb-2 mr-sm-2"
          placeholder="Search by property id"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
                {/* <p> */}
                {transaction.date} - £{transaction.price}
                {/* </p> */}
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
      <div className="search">{renderSearchBar()}</div>
      <div className="properties-container">{renderPropertyDetails()}</div>
    </div>
  );
}

export default App;
