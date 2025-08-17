 



// ------ Scroll nav ------ //
window.addEventListener('scroll', function () {
const navbar = document.getElementById('navbar');
    if (window.scrollY > window.innerHeight * 0.2) { // goes below a certain height, + lower - higher
    navbar.classList.add('scrolled');
    } else { // if scroll isn't higher than innerheight
    navbar.classList.remove('scrolled');
    }
});


