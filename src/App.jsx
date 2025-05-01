import { useEffect, useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import TypeFilter from './components/TypeFilter';
import PokemonList from './components/PokemonList';
import './App.css';
import axios from 'axios';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch Pokémon data
  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
        const promises = response.data.results.map(async (pokemon) => {
          const details = await axios.get(pokemon.url);
          return {
            id: details.data.id,
            name: details.data.name,
            image: details.data.sprites.front_default,
            types: details.data.types.map((t) => t.type.name),
          };
        });
        const results = await Promise.all(promises);
        setPokemonList(results);
        setFilteredList(results);
      } catch (err) {
        setError('Failed to fetch Pokémon data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  // Filter logic
  useEffect(() => {
    let list = pokemonList;

    if (searchTerm) {
      list = list.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedType) {
      list = list.filter((p) => p.types.includes(selectedType));
    }

    setFilteredList(list);
  }, [searchTerm, selectedType, pokemonList]);

  return (
    <div className="App">
      <Header />
      <div className="controls">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <TypeFilter selectedType={selectedType} setSelectedType={setSelectedType} />
      </div>

      {loading ? (
        <p className="info">Loading...</p>
      ) : error ? (
        <p className="info error">{error}</p>
      ) : filteredList.length === 0 ? (
        <p className="info">No Pokémon found.</p>
      ) : (
        <PokemonList pokemon={filteredList} />
      )}
    </div>
  );
}

export default App;
