//everytime you clicked the plus icon, the pokemon data will push to this array
const selectedPokemons = [];



async function pokemonAbilitiesData(pokemonsData) {

   //function to display pokemons
  function displayAllPokemon(pokemonAbilitiesData, typeNames) {
    
    const pokemonHTML = `
      <div class="page-load-cards"
      data-aos-duration="700"
      data-aos="zoom-in">
        <img class="poke-img" src="${pokemonAbilitiesData.sprites.other.dream_world.front_default}">
        <h1 class="pokemon-name">${pokemonAbilitiesData.name}</h1>
        <p class="poke-types" title="Add to team">${displayAllPlusIcon} ${typeNames}</p>
      </div>
      `;

    renderedPokemons.innerHTML += pokemonHTML

    //each clicked on the plus icon is added to the selectedPokemons empty array
    setupPlusIconClickEvent(selectedPokemons);
    
    const pokemonImage = document.querySelectorAll('.poke-img');
    allPokemonModalShow(pokemonImage, pokemonsData)
 }
 
 //show modal
 initializeModal(addedPokemon, modalInfo, modalContainer, modalExit);


  //iterate to pokemonData that contains pokemons URL who also have a data
  for(const pokemonData of pokemonsData) {
    const response = await fetch(pokemonData.url)
    if(response.ok) {
      const pokemonAbilitiesData = await response.json();
      const pokemonTypes = pokemonAbilitiesData.types;
      const typeNames = pokemonTypes.map(types => types.type.name).join(', ')
      
      //pass the pokemonAbilitiesData and typeNames as arguments
      displayAllPokemon(pokemonAbilitiesData, typeNames)

      } else {
        throw new Error('Request failed with status ' + response.status);
      }
    }
   
}

