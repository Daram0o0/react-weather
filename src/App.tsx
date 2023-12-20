import React from 'react';
// import './App.css';
const api = {
  key: "6532b4792b61f46e3d8d3d9b274da010",
  base: "https://api.openweathermap.org/data/2.5/"
}


function App() {
  return (
    <div className="app">
      <main>
        <div className="search-box">
          <input type='text'
            className='search-bar'
            placeholder='Search...'
          />
        </div>
      </main>
    </div>
  );
}

export default App;
