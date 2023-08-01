const generationsBtn = document.querySelectorAll('.generation')
const container = document.querySelector('.container')
const choices1 = document.querySelector('.choices1')
const choices2 = document.querySelector('.choices2')
const choices3 = document.querySelector('.choices3')
const leaderboard = document.querySelector('.leaderboard') 
const pokemonAbilitiesDataArray = [];


leaderboard.addEventListener('click', () => alert('Coming soon!'))


const fetchAllPokemon = async () => {
  try {
    //fetch all pokemons
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=1281');
    const data = await response.json();
    const pokemons = data.results;
    //fetch each url's
    for(const pokemon of pokemons) {
      const abilityDataResponse = await fetch(pokemon.url);
      const pokemonAbilitiesData = await abilityDataResponse.json();
      pokemonAbilitiesDataArray.push(pokemonAbilitiesData);
    }
  } catch(error) {
    console.log(error)
  }
}

//--------------------------------------------------------------------------------

const pokemonGenerations = async () => {
    const generationURLs = [
    'https://pokeapi.co/api/v2/generation/1',
    'https://pokeapi.co/api/v2/generation/2',
    'https://pokeapi.co/api/v2/generation/3',
    'https://pokeapi.co/api/v2/generation/4',
    'https://pokeapi.co/api/v2/generation/5',
    'https://pokeapi.co/api/v2/generation/6',
    'https://pokeapi.co/api/v2/generation/7',
    'https://pokeapi.co/api/v2/generation/8'
  ];  
  const responses = await Promise.all(generationURLs.map(url => fetch(url)));
  const generationsData = await Promise.all(responses.map(response => response.json()));
  return generationsData;
}

//--------------------------------------------------------------------------------

const getRandomPokemon = async () => {
  try {
    const generationsArray = await pokemonGenerations();
    await fetchAllPokemon();
    
    generationsBtn.forEach((generation, index) => {
      const pokemonData = generationsArray[index].pokemon_species;
      generation.addEventListener('click', () => findRandomPokemon(pokemonData));
    });

  } catch(error) {
    console.log(error)
  }      
}
getRandomPokemon();

//-------------------------------------------------------------------------------
const mobileLogo = document.querySelector('.pokemon-logo'); 
const gameOverModal = document.querySelector('.gameOverModal');
//hamburger nav
const hamburgerMenu = document.querySelector('.hamburger-menu');
const btnContainer = document.querySelector(' .buttons-container ');
//HP life
const firstLife = document.querySelector('.firstLife'); 
const secondLife = document.querySelector('.secondLife'); 
const thirdLife = document.querySelector('.thirdLife'); 

hamburgerMenu.addEventListener('click', () => {
  hamburgerMenu.classList.toggle('active');
  btnContainer.classList.toggle('show');
});



//---------------------------------------------------------------------------

const findRandomPokemon = async (pokemonData) => {
  //add and remove classes
  hamburgerMenu.classList.remove('active');
  btnContainer.classList.remove('show');
  mobileLogo.classList.add('spin');

  //get one random pokemon
  const random = Math.floor(Math.random() * pokemonData.length);
  //correct answer
  const generateRandomPokemon = pokemonData[random];

  //find that random pokemon in pokemonAbilitiesDataArray
  const found = pokemonAbilitiesDataArray.find(pokemon => pokemon.name === generateRandomPokemon.name);
  //remove the null and undefined
  const hasValidData = pokemonAbilitiesDataArray.some(pokemon =>
  pokemon !== undefined && pokemon.sprites.other.dream_world.front_default !== null);

  //clear container
  container.innerHTML = '';

  if(found && hasValidData) {
    const pokeHTML = await renderRandomPokemon(found);
    setTimeout(() => {
      container.innerHTML = pokeHTML;
      mobileLogo.classList.remove('spin');
    }, 300);
  }

  //return value of chooseAnswer function
  const twoRandomPokemon = chooseAnswer(pokemonData);
  //combine the 2 random, and correct answer to single array 
  const threeChoices = [...twoRandomPokemon, generateRandomPokemon]; 

  //pass the combined choices as argument to renderChoices
  renderChoices(threeChoices, generateRandomPokemon.name, pokemonData);

}


//-------------------------------------------------------------------------------
const img = 'qmark.png'

const renderRandomPokemon = async (found) => {
  const { sprites } = found;
  return `
  <div>
    <img class="random-pokeImg" style="filter: brightness(0%);" width="300px" src="${sprites.other.home.front_default}">
  </div>
  
  <div>
    <img class="qmark" width="80px" src="${img}">
  </div>
  `;
}

//-------------------------------------------------------------------------------

const chooseAnswer = (pokemonData) => {
  const threeChoices = [];

  while(threeChoices.length < 2) {
    const random = Math.floor(Math.random() * pokemonData.length);
    const randomPoke = pokemonData[random];
    if(!threeChoices.includes(randomPoke)) {
      threeChoices.push(randomPoke)
    }
  }
  return threeChoices;
}

//------------------------------------------------------------------------------
let remainingLives = 3;
let removeUserEvent = null;
let userScore = 0;

const renderChoices = (threeChoices, correctAnswer, pokemonData) => {

  //shuffle choices
  for (let i = threeChoices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [threeChoices[i], threeChoices[j]] = [threeChoices[j], threeChoices[i]];
  }

  if(removeUserEvent) {
    const choicesBtn = document.querySelectorAll('.choices1, .choices2, .choices3');
    choicesBtn.forEach(choice => {
      choice.removeEventListener('click', removeUserEvent);
    })
  }

  removeUserEvent = (e) => handleChoicesClick(e, correctAnswer, pokemonData);

  // Get all choice buttons and add event listeners to each one
  const choicesBtn = document.querySelectorAll('.choices1, .choices2, .choices3');
  const hasDuplicate = threeChoices.some((choice, index) => threeChoices.indexOf(choice.name) !== index);

  choicesBtn.forEach((choice, index) => {
    choice.addEventListener('click', removeUserEvent, {once : true});
    if(hasDuplicate) {
      choice.innerHTML = threeChoices[index].name;
    } 
  });
};


const handleChoicesClick = async (e, correctAnswer, pokemonData) => {

  const img = document.querySelector('.random-pokeImg');

  // Get the text content of the clicked choices
  const clickedChoice = e.target.textContent;

  // Check if the clicked choice is the correct answer
  if (clickedChoice === correctAnswer) {
    //increment score
    userScore++;
    //dispaly pc score
    document.querySelector('.score').innerHTML = userScore;
    //display mobile score
    document.querySelector('.points').innerHTML = userScore;
    //display final score in modal
    document.querySelector('.modalScore').innerHTML = userScore;

    //show the pokemon
    img.style.filter = 'brightness(100%)';

  } else {
    remainingLives--;

    if(remainingLives === 2) {
      firstLife.classList.add('fadeOut');
      setTimeout(() => firstLife.remove(), 1000);
    } else if(remainingLives === 1) {
      secondLife.classList.add('fadeOut');
      setTimeout(() => secondLife.remove(), 1000);
    } else if(remainingLives === 0) {
      thirdLife.classList.add('fadeOut');
      setTimeout(() => thirdLife.remove(), 1000);
      gameOverModal.showModal();
    }
  }
  //load next random pokemon
  setTimeout(() => findRandomPokemon(pokemonData), 300);


    //reset
  const tryAgainBtn = document.querySelector('#tryAgain');

  const resetGame = async () => {
    //close modal
    gameOverModal.close();

    userScore = 0;
    //display mobile score
    document.querySelector('.points').innerHTML = userScore;
    remainingLives = 3; // Reset remaining lives to 3

    // Remove fadeOut class from all life elements to make them visible again
    firstLife.classList.remove('fadeOut');
    secondLife.classList.remove('fadeOut');
    thirdLife.classList.remove('fadeOut');  

    
    // Append all the removed elements back to the container
    const lifeContainer = document.querySelector('.life');
    lifeContainer.appendChild(firstLife);
    lifeContainer.appendChild(secondLife);
    lifeContainer.appendChild(thirdLife);

    //generate new random pokemon
    await findRandomPokemon(pokemonData);
  }

  tryAgainBtn.addEventListener('click', resetGame);
};
//---------------
