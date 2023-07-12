const allPokemons = async () => {

  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=500')
    const data = await response.json()
    filterPokemon(data.results)
    pokemonAbilitiesData(data.results)
    // addPokemonToTeam(data.results)
    
  }catch (error) {
    console.log(error)
  }
}
allPokemons()


function filterPokemon(pokemonAbilities) {
  // Store the array of pokemons in a variable called pokemons
  const pokemons = pokemonAbilities;

  // Create a Pokemon card HTML string
  function createPokemonCard(pokemonAbilityData, typeNames) {


    const pokemonHTML = `
    <div class="cards"
    data-aos-duration="700"
    data-aos="zoom-in">
      <img class="poke-img" src="${pokemonAbilityData.sprites.other.dream_world.front_default}">
      <h1 class="pokemon-name">${pokemonAbilityData.name}</h1>
      <p class="poke-types" title="Add to team">${fetchAllTypesPlusIcon} ${typeNames}</p>
    </div>
    `;
  
    pokemonsContainer.innerHTML += pokemonHTML;

    //each clicked on the plus icon is added to the selectedPokemons empty array
    setupPlusIconClickEvent(selectedPokemons);
    
    const pokemonImg = document.querySelectorAll('.poke-img');
    allPokemonModalShow(pokemonImg, pokemonAbilities);
  }
  
  // Fetch and display pokemons based on selected checkboxes
  async function fetchAndDisplayPokemons(typeName) {
    
    //every click of pokemon types icon, the container will reset.
    pokemonsContainer.innerHTML = '';

    for(const pokemon of pokemons) {
      const response = await fetch(pokemon.url);

      if(response.ok) {
        const pokemonAbilityData = await response.json()
        const pokemonTypes = pokemonAbilityData.types;
        const hasValidImage = pokemonAbilityData.sprites.other.dream_world.front_default !== null;
        
        const filteredPokemonTypes = [];
        for(const types of pokemonTypes) {
          if(types.type.name === typeName) {
            filteredPokemonTypes.push(types)
          }
        }

        for(const type of filteredPokemonTypes) {
          if(hasValidImage) {
            createPokemonCard(pokemonAbilityData, type.type.name)
            const cards = document.querySelectorAll('.cards')
            cards.forEach(card => {
              applyCardStyles(card, type.type.name)
            })
          }
        }

      } else {
        // Handle non-OK response (e.g., 404)
        throw new Error('Request failed with status ' + response.status);
      }
    }

  }

  icons.forEach(icon => {
    icon.addEventListener('click', () => {
      const typeName = icon.nextElementSibling.getAttribute('data-value')
      fetchAndDisplayPokemons(typeName)
      renderedPokemons.style.display = 'none';
    })
  })

}



























