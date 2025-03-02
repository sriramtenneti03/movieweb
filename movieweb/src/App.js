import React, { useEffect, useState } from 'react';

const baseurl = "http://www.omdbapi.com?apikey=e0b94e8c";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchItems, setSearchItems] = useState('');
  const [Sortoptions, setSortOptions] = useState('Title');

  const fetchMovies = async (query) => {
    setLoading(true);
    const response = await fetch(`${baseurl}&s=${query}&type=${filter}`);
    const data = await response.json();
    
    if (data.Search) {
      const sortedMovies = sortMovies(data.Search);
      setMovies(sortedMovies);
    }
    setLoading(false);
  };

  const fetchDefaultMovies = async () => {
    setLoading(true);
    const keywords = ['action', 'adventure', 'horror', 'crime', 'thriller', 'sci-fi'];
    let allMovies = [];

    for (const keyword of keywords) {
      const response = await fetch(`${baseurl}&s=${keyword}&type=${filter}`);
      const data = await response.json();

      if (data.Search) {
        allMovies = [...allMovies, ...data.Search];
      }
    }
    
    setMovies(sortMovies(allMovies));
    setLoading(false);
  };

  const sortMovies = (movies) => {
    return [...movies].sort((a, b) => {
      if (Sortoptions === 'Year') {
        return parseInt(b.Year) - parseInt(a.Year);
      }
      return a.Title.localeCompare(b.Title);
    });
  };

  useEffect(() => {
    fetchDefaultMovies();
  }, []);

  useEffect(() => {
    if (searchItems.trim() !== '') {
      fetchMovies(searchItems);
    }
  }, [searchItems, filter, Sortoptions]);

  return (
    <div>
      <h1>Movie Finder</h1>
      <input
        type="text"
        placeholder="Search for a movie..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={() => fetchMovies(search)}>Search</button>
      {loading ? <p>Loading...</p> : (
        <ul>
          {movies.map((movie) => (
            <li key={movie.imdbID}>
              {movie.Title} ({movie.Year})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
