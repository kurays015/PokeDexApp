const fetchTypeModal = document.querySelector('.fetchTypeModal');

const allPokemons = async () => {

  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=1281')
    const data = await response.json()
    filterPokemon(data.results)
    pokemonAbilitiesData(data.results)
    
  }catch (error) {
    console.log(error)
  }
}
allPokemons()


function filterPokemon(pokemonsData) {

  // Store the array of pokemons in a variable called pokemons
  // const pokemons = pokemonsData;

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

  }

  // Fetch and display pokemons based on selected checkboxes
  async function fetchAndDisplayPokemons(typeName) {
    
    const filteredPokemons = [];
  
    //every click of pokemon types icon, the container will reset.
    pokemonsContainer.innerHTML = '';

    for(const pokemon of pokemonsData) {
      const response = await fetch(pokemon.url);

      if(response.ok) {
        const pokemonAbilityData = await response.json();
        const pokemonTypes = pokemonAbilityData.types;
        const hasValidImage = pokemonAbilityData.sprites.other.dream_world.front_default !== null;
        
        const filteredPokemonTypes = [];
        
        for(const types of pokemonTypes) {
          if(types.type.name === typeName) {
            filteredPokemonTypes.push(types);
            filteredPokemons.push({ 
              name: pokemonAbilityData.name, 
              img: pokemonAbilityData.sprites.other.home.front_default, 
              abilities: pokemonAbilityData.abilities, 
              types: pokemonAbilityData.types,
              stats: pokemonAbilityData.stats
            });
          }
        }
   
        for(const type of filteredPokemonTypes) {
          if(hasValidImage) {
            createPokemonCard(pokemonAbilityData, type.type.name)
            const cards = document.querySelectorAll('.cards');
            cards.forEach(card => {
              applyCardStyles(card, type.type.name);
            });
          }
        }
         
      } else {
        // Handle non-OK response (e.g., 404)
        throw new Error('Request failed with status ' + response.status);
      }
    }

    const pokemonImage = document.querySelectorAll('.poke-img');
    pokemonImage.forEach((img) => {
      img.addEventListener('click', () => {
        fetchTypeModal.innerHTML = '';  

        const pokemonName = img.nextElementSibling.textContent;        
        const filtered = filteredPokemons.find(pokemon => pokemon.name === pokemonName);
        filteredTypes(filtered);

        //show modal for every pokemon clicked
        fetchTypeModal.showModal();
        //add class animation to modal
        fetchTypeModal.classList.add('zoom-in')
      })
    })
  }

  icons.forEach(icon => {
    //aside targeted
    const iconParent = icon.parentNode.parentNode;
   
    //back icon
    const backIcon = document.querySelector('.back-icon');

    icon.addEventListener('click', () => {
      backIcon.classList.add('right');

      sideBarDisplayNone(iconParent)

      const loaderContainer = document.querySelector('#loaderContainer');
      loaderContainer.style.display = 'block';
      
      //rendered each pokemon types
      const typeName = icon.nextElementSibling.getAttribute('data-value');
      fetchAndDisplayPokemons(typeName)
      renderedPokemons.style.display = 'none';

      setTimeout(() => {
        //loader will be hidden
        loaderContainer.style.display = 'none';
      }, 3000)    
    });

    backIcon.addEventListener('click', (e) => {
      backIcon.href = 'index.html';   
    });
  });

 

  const sideBarDisplayNone = (iconParent) => {
    iconParent.classList.add('remove')
  } 


}

//filtered pokemon in modal pop up
const filteredTypes = async (filtered) => {

  //destructuring
  const { name, stats, types, abilities } = filtered;
  //types
  const typeName = types.map(type => type.type.name).join(', ');
  //ability name
  const abilityName = abilities.map(ability => ability.ability.name).join(', ');


  //stats icons
  const HP = 'https://cdn4.iconfinder.com/data/icons/general-office/91/General_Office_54-64.png';
  const ATTACK = 'https://cdn2.iconfinder.com/data/icons/gaming-solid/32/sword_battle_rpg_weapon_attack_game-512.png';
  const SPECIAL_ATTACK = 'https://cdn2.iconfinder.com/data/icons/game-42/56/sword__battle__game__design__play-512.png';
  const DEFENSE = 'https://cdn0.iconfinder.com/data/icons/essentials-solid-glyphs-vol-1/100/Protection-Shield-Security-512.png';       
  const SPECIAL_DEFENSE = 'https://cdn2.iconfinder.com/data/icons/rpg-fantasy-game-basic-ui/512/weapon_game_ui_fantasy_shield-512.png';
  const SPEED = 'https://cdn2.iconfinder.com/data/icons/rpg-fantasy-game-basic-ui/512/game_ui_speed_increase_foot_run-256.png';

  for(const ability of filtered.abilities) {
    try{
      const response = await fetch(ability.ability.url);
      const abilityData = await response.json();
      const { effect_entries } = abilityData;

    //append to html
    const dialogAppendHTML = `
      <i class="fa-regular fa-circle-xmark modal-exit3"></i>
      <div class="main-container">
        <div class="pokemon-name-effect-container">
          <div>
            <img class="sprite" src="${filtered.img}">
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
              class="moves">Pokemon Moves</div>                     
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

    fetchTypeModal.innerHTML = dialogAppendHTML;

    } catch(error) {
      console.log(error)
    }
  }


   //modal close
   const modalExit3 = document.querySelector('.modal-exit3');

   modalExit3.addEventListener('click', () => {
     
     fetchTypeModal.classList.add('zoom-out');

     fetchTypeModal.addEventListener('animationend', () => {
       fetchTypeModal.classList.remove('zoom-out')
       fetchTypeModal.close();
     }, {once : true})
   });

   const moves = document.querySelectorAll('.moves');
   moves.forEach(move => {
     move.addEventListener('click', () => {
       alert('Not done yet')
     })
   });
}

