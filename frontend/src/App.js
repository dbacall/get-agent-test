import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [propertyData, setPropertyData] = useState(null);
  const [searchType, setSearchType] = useState('property id');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const findProperties = async (e) => {
    e.preventDefault();
    setError('');

    let path = '';

    if (searchType === 'property id') path = searchQuery;
    if (searchType === 'postcode') path = `outcode/${getOutcode(searchQuery)}`;
    if (searchType === 'street') path = `street/${searchQuery}`;

    const resp = await fetch(`/lrProperty/${path}`);
    const json = await resp.json();

    if (json.success) {
      setPropertyData(json.lrProperty);
      setSearchQuery('');
    } else {
      setError('No properties found.');
    }
  };

  const getOutcode = (postcode) => {
    return postcode
      .split(' ')
      .join('')
      .substring(0, postcode.length - 4);
  };

  const handleSearchOption = (e) => {
    setSearchType(e.target.value);
    setSearchQuery('');
  };

  const renderSearchOptions = () => {
    return (
      <ButtonGroup className="mb-2">
        <Button value="property id" onClick={handleSearchOption}>
          Property Id
        </Button>
        <Button value="postcode" onClick={handleSearchOption}>
          Postcode
        </Button>
        <Button value="street" onClick={handleSearchOption}>
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
    if (error) {
      return (
        <div>
          <h3>{error}</h3>
        </div>
      );
    }
    if (propertyData) {
      if (Array.isArray(propertyData)) {
        return propertyData.map((property, index) => {
          const {
            outcode,
            incode,
            paon,
            saon,
            street,
            lrTransactions,
          } = property;
          return (
            <div className="property-details" key={index}>
              <h5>
                {paon}, {saon ? `${saon}, ` : null}
                {street}, {outcode} {incode}
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
        });
      } else {
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
