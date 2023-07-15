//function that shows modal
function initializeModal(addedPokemon, modalInfo, modalContainer, modalExit) {
  
  //when the displayed count of added pokemons clicked, the modal will show
  addedPokemon.addEventListener('click', () => {
    modalInfo.innerHTML = '';
    
    selectedPokemons.map(selectedPokemon => {
      const modalHTML = `
        <div class="modal-pokemons" 
        data-aos-duration="700"
        data-aos="zoom-in">
        <i class="fa-regular fa-circle-xmark remove-btn" style="color: #492c6d;"></i>
          <img src="${selectedPokemon.img}">
          <p class="modal-poke-names">${selectedPokemon.name}</p>
          <p class="modal-poke-types">${selectedPokemon.type}</p>  
        </div>
      `
      modalInfo.innerHTML += modalHTML;
    })

    modalContainer.classList.add('zoom-in')
    modalContainer.showModal();
  });

  //modal close
  modalExit.addEventListener('click', () => {
   
    modalContainer.classList.add('zoom-out')


    modalContainer.addEventListener('animationend', () => {
      
      modalContainer.classList.remove('zoom-out')
      modalContainer.close();
    }, {once : true})
  });
}

//function that push the pokemon details to the selectedPokemons empty array using the plus icon button
function setupPlusIconClickEvent(selectedPokemons) {

  const plusIcons = document.querySelectorAll('.fetchAllTypes-plusIcon, .displayAll-plusIcon, .searchPokemon-plusIcon');

  plusIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      if(selectedPokemons.length < 10) {
        const pokemonNames = icon.parentNode.parentNode.querySelector('.pokemon-name').textContent;
        const pokemonTypes = icon.parentNode.parentNode.querySelector('.poke-types').textContent;
        const pokemonImg = icon.parentNode.parentNode.querySelector('.poke-img').src;
        const isDuplicate = selectedPokemons.some(pokemon => pokemon.name === pokemonNames);

        if (!isDuplicate) {

          const selectedPokemon = {
            name: pokemonNames,
            type: pokemonTypes,
            img: pokemonImg
          };

          selectedPokemons.push(selectedPokemon);
  
          //pokemon added counter
          document.querySelector('.pokemon-count').innerHTML = selectedPokemons.length;

        }
      }

      addedPokemon.classList.add('active');
    });
  });


  //remove element/pokemon from selectedPokemons array
  const removeElement = document.querySelectorAll('.remove-btn');

  // Add a click event listener to each "x" button
  removeElement.forEach(button => {
    button.addEventListener('click', e => {


      // Get the parent element (div) of the remove element button
      const item = e.target.parentNode;

      // Get the text content of the item to remove
      const itemText = item.querySelector('p').textContent;

      // Find the index of the item in the array and compare the clicked pokemon name and itemText Content
      const index = selectedPokemons.findIndex(pokemon => pokemon.name === itemText);

      // Remove the item from the array
      if (index > -1) {
        selectedPokemons.splice(index, 1);
      }

      //pokemon remove counter
      document.querySelector('.pokemon-count').innerHTML = selectedPokemons.length;

      // Remove the item from the DOM
      item.remove();
    });
  });

}


//screenshot code below
const container = document.querySelector('.modal');
const screenshotBtn = document.querySelector('.screenshot');

function screenShot() {
  html2canvas(container, { useCORS: true }).then(canvas => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'screenshot.png';
    link.click();
  });
}

screenshotBtn.addEventListener('click', screenShot);




