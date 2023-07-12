const pokemonSearch = document.querySelector('.pokemon-search');

pokemonSearch.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const pokemon = pokemonSearch.value;
    pokemonSearch.value = '';
    searchPokemon(pokemon);
  }
});

const searchPokemon = async (pokemon) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if(response.ok) {
      const pokemonAbilitiesData = await response.json();
      const typeNames = pokemonAbilitiesData.types.map(type => type.type.name).join(', ');
      displaySearchedPokemons(pokemonAbilitiesData, typeNames);
    } else {
      throw new Error('Request failed with status ' + response.status);
    }
   
  } catch (error) {
    // alert('POKEMON NOT FOUND')
    console.log(error)
  }
};

// Function to display pokemon
function displaySearchedPokemons(pokemonAbilitiesData, typeNames) {

  const pokemonHTML = `
    <div class="page-load-cards">
      <img class="poke-img" src="${pokemonAbilitiesData.sprites.other.dream_world.front_default}">
      <h1 class="pokemon-name">${pokemonAbilitiesData.name}</h1>
      <p class="poke-types" title="Add to team">${searchPokemonPlusIcon} ${typeNames}</p>
    </div>
  `;
  renderedPokemons.innerHTML = pokemonHTML;

  //each clicked on the plus icon is added to the selectedPokemons empty array
  setupPlusIconClickEvent(selectedPokemons);

  const pokemonImg = document.querySelectorAll('.poke-img');
  allPokemonModalShow(pokemonImg, pokemonAbilitiesData);
}
