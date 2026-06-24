import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const API_KEY = 'AIzaSyD-FAKE-TEST-KEY-1234567890abcdefghi';
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZmFrZSIsImEiOiJja2Zha2V0b2tlbiJ9.fakefakefake';

function App() {
  const [html, setHtml] = useState('<img src=x onerror=alert(1)>');
  const [query, setQuery] = useState('admin');
  const [users, setUsers] = useState([]);

  async function search() {
    const res = await axios.get('/api/search?q=' + query);
    setUsers(res.data);
  }

  function evalFeatureFlag(flagExpression) {
    // SAST: eval on user-controlled input
    return eval(flagExpression);
  }

  return (
    <div>
      <h1>Vulnerable Fullstack Lab</h1>
      <p>Fake public API key: {API_KEY}</p>
      <p>Fake map token: {MAPBOX_TOKEN}</p>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={search}>Search</button>
      <button onClick={() => alert(evalFeatureFlag('1+1'))}>Eval flag</button>
      <textarea value={html} onChange={e => setHtml(e.target.value)} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
