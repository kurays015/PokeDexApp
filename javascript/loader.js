window.onload = () => {

  // Function to hide the loader and show the main content
  function showMainContent() {
      const loaderContainer = document.querySelector('#loaderContainer');
      loaderContainer.style.display = 'none';
  }
  
  // Use setTimeout to add a delay
  setTimeout(showMainContent, 1000);
}
