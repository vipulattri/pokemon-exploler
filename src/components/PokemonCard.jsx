function PokemonCard({ pokemon }) {
    return (
      <div className="pokemon-card">
        <img src={pokemon.image} alt={pokemon.name} />
        <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <p><strong>ID:</strong> {pokemon.id}</p>
        <p><strong>Type:</strong> {pokemon.types.join(', ')}</p>
      </div>
    );
  }
  
  export default PokemonCard;
  