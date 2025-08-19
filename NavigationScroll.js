 
const scriptTag = document.currentScript

const thresholdData = parseFloat(scriptTag.getAttribute("data-threshold")) // this gets the threhold vairable so its configurable from the html



// ------ Scroll nav ------ //
window.addEventListener('scroll', function () {
const navbar = document.getElementById('navbar');
    if (window.scrollY > window.innerHeight * thresholdData) {
        return
    }
    if (window.scrollY > window.innerHeight * thresholdData) { // goes below a certain height, + lower - higher
    navbar.classList.add('scrolled');
    } else { // if scroll isn't higher than innerheight
    navbar.classList.remove('scrolled');
    }
});


