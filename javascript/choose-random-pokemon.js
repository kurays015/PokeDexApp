const chooseRandomPokemon = document.querySelector('.select-pokemon')
const stopButton = document.querySelector('.stop')
const icons = document.querySelectorAll('.icon')
const pokemonSVG = document.querySelector('.pokemon-svg')

//plus icon
const displayAllPlusIcon = '<i class="fa-solid fa-square-plus displayAll-plusIcon"></i>'; 
const fetchAllTypesPlusIcon = '<i class="fa-solid fa-square-plus fetchAllTypes-plusIcon"></i>';
const searchPokemonPlusIcon = '<i class="fa-solid fa-square-plus searchPokemon-plusIcon"></i>';

//modal
const modalContainer = document.querySelector('.modal');
const addedPokemon = document.querySelector('.add-to-team')
const modalInfo = document.querySelector('.modal-info')
const modalExit = document.querySelector('.modal-exit')



//containers
const pokemonsContainer = document.querySelector('.pokemons-container')
const renderedPokemons = document.querySelector('.rendered-pokemons')
const pokemonContainer = document.querySelector('.container')


const pokeData = async () => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=500&offset=500');
    //all of the pokemon data
    const data = await response.json();
    // when chooseRandomPokemon button was clicked, renderRandomPokemon function runs every 10 miliseconds
    chooseRandomPokemon.addEventListener('click', () => {

      chooseRandomPokemon.style.display = 'none'
      stopButton.style.display = 'block'

        const stop = setInterval(async () => {
          //renderRandomPokemon function runs every 10 miliseconds
          renderRandomPokemon(data)
      }, 100) 
      //when stop button was clicked, the stop variable of renderRandomPokemon will stop running
      stopButton.addEventListener('click', () => {
        //the interval every 10ms will stop
        clearInterval(stop)
        stopButton.style.display = 'none'
      })
    })

  } catch (error) {
    console.log(error);
  }
}
pokeData()

//render random pokemon every 10 mili seconds - pass the data from pokeData as a parameter
const renderRandomPokemon = async (data) => {
  //this is the random pokemon generated in a variable
  const pokemons = getRandomPokemon(data)
  //iterate  each of that pokemon and fetch it's pokemon.url
  const pokemonPromises = pokemons.map(async pokemon => {
  const response = await fetch(pokemon.url)
  return response.json()      
})     
  //return pokemonPromises as a promise in a variable pokemonData
  const pokemonData = await Promise.all(pokemonPromises)
  console.log(pokemonData)
  //iterate each of it's pokemon.url and get the 'data.sprites.other.dream_world.front_default'
  const pokemonHTML = pokemonData
  .map(data =>  `
    <div class="card">
      <img src="${data.sprites.other.dream_world.front_default}">    
    </div>`
  )
  .join('')
  //append it to pokemonContainer
  pokemonContainer.innerHTML = pokemonHTML;
}


//generate one random pokemon
function getRandomPokemon(data) {

  const selectedPokemons = [];
  const numberOfPokemonsToSelect = 1;
  
  //if this while loop is true, generate one pokemon in data.results, 1000 pokemon array
  while (selectedPokemons.length < numberOfPokemonsToSelect) {
    const pokemons = data.results;
    //multiply the random number to pokemon.length to determine the pokemon which will generate.
    const randomPokemon = Math.floor(Math.random() * pokemons.length);
    //make it the new array
    const newPokemonArray = pokemons[randomPokemon];
    //if selectedPokemons doesn't have elements inside
    if (!selectedPokemons.includes(newPokemonArray)) {
    //push the newPokemonArray
      selectedPokemons.push(newPokemonArray);
    }  
  }
 return selectedPokemons;
}



pokemonSVG.addEventListener('click', () => {
  location.reload();
});