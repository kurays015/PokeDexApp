const pokemonSearch = document.querySelector('.pokemon-search');
const pokeSearchModal = document.querySelector('.pokeSearchModal');

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

  renderedPokemons.innerHTML = '';

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

  const pokemonImage = document.querySelectorAll('.poke-img');
  pokemonImage.forEach(img => {
    img.addEventListener('click', () => {
      pokeSearchModal.innerHTML = '';  
      pokemonSearchModal(pokemonAbilitiesData)

      pokeSearchModal.showModal();
      pokeSearchModal.classList.add('zoom-in');
    });
  });
}

//poke search modal pop up
async function pokemonSearchModal(pokemonAbilitiesData) {

  //destructuring
  const { abilities, types, stats, name } = pokemonAbilitiesData;
  //ability name and types
  const abilityName = abilities.map(ability => ability.ability.name).join(', ');
  const typeName = types.map(type => type.type.name).join(', ');

  //stats icons
  const HP = 'https://cdn4.iconfinder.com/data/icons/general-office/91/General_Office_54-64.png';
  const ATTACK = 'https://cdn2.iconfinder.com/data/icons/gaming-solid/32/sword_battle_rpg_weapon_attack_game-512.png';
  const SPECIAL_ATTACK = 'https://cdn2.iconfinder.com/data/icons/game-42/56/sword__battle__game__design__play-512.png';
  const DEFENSE = 'https://cdn0.iconfinder.com/data/icons/essentials-solid-glyphs-vol-1/100/Protection-Shield-Security-512.png';       
  const SPECIAL_DEFENSE = 'https://cdn2.iconfinder.com/data/icons/rpg-fantasy-game-basic-ui/512/weapon_game_ui_fantasy_shield-512.png';
  const SPEED = 'https://cdn2.iconfinder.com/data/icons/rpg-fantasy-game-basic-ui/512/game_ui_speed_increase_foot_run-256.png';


  abilities.map(async ability => {
    const response = await fetch(ability.ability.url);
    const abilityData = await response.json();
    const { effect_entries } = abilityData;

     //append to html
    const dialogAppendHTML = `
      <i class="fa-regular fa-circle-xmark modal-exit4"></i>
      <div class="main-container">
        <div class="pokemon-name-effect-container">
          <div>
            <img class="sprite" src="${pokemonAbilitiesData.sprites.other.home.front_default}">
            <div class="types">
              <p>${typeName}</p>
            </div>
            <h1 class="modal2-pokeName">${name}</h1>
          </div>

          <div class="abilities-container">
            <h1>Abilities</h1>
              <p class="ability-name">${abilityName}</p>
              <p class="effect">${effect_entries[1].effect}</p> 
              <div           
              class="moves">Moves</div>                     
          </div>
        </div>

        <div>
          <div class="stats-container">
            <div class="stats-logo">
              <div class="stats-center">
                <h1>HP</h1>
                <div> <img class="HP-icon" src="${HP}"> </div>
              </div>
              <p>base stat: ${stats[0].base_stat}</p>
              <p>effort: ${stats[0].effort}</p>
            </div>
            <div class="stats-logo">
              <div class="stats-center">
                <h1>ATTACK</h1>
                <div> <img class="attack-icon" src="${ATTACK}"> </div>                       
              </div>
              <p>base stat: ${stats[1].base_stat}</p>
              <p>effort: ${stats[1].effort}</p>
            </div>
            <div class="stats-logo">
              <div class="stats-center">
                <h1>SPECIAL ATTACK</h1>
                <div> <img class="special-attack-icon" src="${SPECIAL_ATTACK}"> </div>                        
              </div>
              <p>base stat: ${stats[2].base_stat}</p>
              <p>effort: ${stats[2].effort}</p>
            </div>
            <div class="stats-logo">
              <div class="stats-center">
                <h1>DEFENSE</h1>
                <div> <img class="defense-icon" src="${DEFENSE}"> </div>                        
              </div>
              <p>base stat: ${stats[3].base_stat}</p>
              <p>effort: ${stats[3].effort}</p>
            </div>
            <div class="stats-logo">
              <div class="stats-center">
                <h1>SPECIAL DEFENSE</h1>
                <div> <img class="special-defense-icon" src="${SPECIAL_DEFENSE}"> </div>                        
              </div>
              <p>base stat: ${stats[4].base_stat}</p>
              <p>effort: ${stats[4].effort}</p>
            </div>
            <div class="stats-logo">
              <div class="stats-center">
                <h1>SPEED</h1>
                <div> <img class="speed-icon" src="${SPEED}"> </div>                        
              </div>
              <p>base stat: ${stats[5].base_stat}</p>
              <p>effort: ${stats[5].effort}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    pokeSearchModal.innerHTML = dialogAppendHTML;

    
    //modal close
    const modalExit4 = document.querySelector('.modal-exit4');

    modalExit4.addEventListener('click', () => {
      
      pokeSearchModal.classList.add('zoom-out');

      pokeSearchModal.addEventListener('animationend', () => {
        pokeSearchModal.classList.remove('zoom-out')
        pokeSearchModal.close();
      }, {once : true})
    });
  
    const moves = document.querySelectorAll('.moves');
    moves.forEach(move => {
      move.addEventListener('click', () => {
        alert('DI KO PA TAPOS ITO HAHAHA')
      })
    }
  });

}
