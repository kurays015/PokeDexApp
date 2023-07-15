const displayAllModal = document.querySelector('.displayAllModal');
const alertMessage = document.querySelectorAll('.alert')

alertMessage.forEach(message => {
  message.addEventListener('click', () => {
  alert('DI KO PA TAPOS ITO HAHAHA');
  });
});

async function allPokemonModalShow(pokemonImg, pokemonsData) {

  pokemonImg.forEach((img, index) => {
    img.addEventListener('click', async () => {
      displayAllModal.innerHTML = '';   

      const pokemons = pokemonsData[index];

      fetchPokemonAbilities(pokemons);
      //show modal for every pokemon clicked
      displayAllModal.showModal();
      //add class animation to modal
      displayAllModal.classList.add('zoom-in')
    })
  })
}

async function fetchPokemonAbilities(pokemons) {
  try {
    const response = await fetch(pokemons.url);
    const pokemonAbilitiesData = await response.json();
    displayModal(pokemonAbilitiesData);
  } catch(error) {
    console.log(error)
  }
}

async function displayModal(pokemonAbilitiesData) {

  //destructuring
  const { abilities, types, stats, sprites, name } = pokemonAbilitiesData;
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
      <i class="fa-regular fa-circle-xmark modal-exit2"></i>
      <div class="main-container">
        <div class="pokemon-name-effect-container">
          <div>
            <img class="sprite" src="${sprites.other.home.front_default}">
            <div class="types">
              <p>${typeName}</p>
            </div>
            <h1 class="modal2-pokeName">${name}</h1>
          </div>

          <div class="abilities-container">
            <h1>Abilities</h1>
              <p class="ability-name">${abilityName}</p>
              <p class="effect">${effect_entries[1].effect}</p> 
              <div class="moves">Moves</div>                     
          </div>
        </div>

        <div>
          <div class="stats-container">
            <div class="stats-logo" >
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
            <div class="stats-logo" >
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

    displayAllModal.innerHTML = dialogAppendHTML;

    
    //modal close
    const modalExit2 = document.querySelector('.modal-exit2');

    modalExit2.addEventListener('click', () => {
      
      displayAllModal.classList.add('zoom-out');

      displayAllModal.addEventListener('animationend', () => {
        displayAllModal.classList.remove('zoom-out')
        displayAllModal.close();
      }, {once : true})
    });

    const moves = document.querySelectorAll('.moves');
    moves.forEach(move => {
      move.addEventListener('click', () => {
        alert('DI KO PA TAPOS ITO HAHAHA)
      })
    }
  });
}




