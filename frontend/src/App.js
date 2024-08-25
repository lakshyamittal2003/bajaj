import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [options, setOptions] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const dropdownOptions = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' },
  ];

  const handleSubmit = async () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (!parsedJson.data || !Array.isArray(parsedJson.data)) {
        throw new Error('Invalid JSON format: "data" array is required.');
      }

      setError(null);

      const response = await axios.post('https://flask-mocha.vercel.app/bfhl', parsedJson);

      setResponseData(response.data);
    } catch (err) {
      setError(err.message);
      setResponseData(null);
    }
  };

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleOptionsChange = (selectedOptions) => {
    setOptions(selectedOptions);
  };

  const renderResponseData = () => {
    if (!responseData) return null;

    return (
      <div className="response">
        {options.some(opt => opt.value === 'alphabets') && (
          <div><strong>Alphabets:</strong> {responseData.alphabets.join(', ')}</div>
        )}
        {options.some(opt => opt.value === 'numbers') && (
          <div><strong>Numbers:</strong> {responseData.numbers.join(', ')}</div>
        )}
        {options.some(opt => opt.value === 'highest_lowercase_alphabet') && (
          <div><strong>Highest Lowercase Alphabet:</strong> {responseData.highest_lowercase_alphabet.join(', ')}</div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Data Processor</h1>
      <textarea
        value={jsonInput}
        onChange={handleJsonInputChange}
        placeholder='Enter JSON (e.g., { "data": ["A", "C", "z"] })'
        rows="6"
        cols="50"
      />
      <button onClick={handleSubmit}>Submit</button>
      {error && <div className="error">{error}</div>}

      {responseData && (
        <>
          <Select
            isMulti
            options={dropdownOptions}
            onChange={handleOptionsChange}
            className="dropdown"
            placeholder="Select what to display"
          />
          {renderResponseData()}
        </>
      )}
    </div>
  );
};

export default App;
