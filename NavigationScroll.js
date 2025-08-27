 /** 
* Navigation scroll background
* All html pages
*
* 
*
*
*
* 
* 
*/


// variables
const scriptTag = document.currentScript
const thresholdData = parseFloat(scriptTag.getAttribute("data-threshold")) // this gets the threhold vairable so its configurable from the html
//

window.addEventListener("scroll", () => {
    // activates if it goes below a certain height. If it isn't higher than inner height, scroll will be toggled off.
    navbar.classList.toggle("scrolled", window.scrollY > window.innerHeight * thresholdData)
});
