function changeCss() {
    var navElement = document.querySelector(".navbar");
    var links = document.querySelectorAll(".navbar .links a");

    if (window.scrollY > 0) {
        navElement.classList.add("scrolled");
        // Add class to links to change their color
        links.forEach(link => link.classList.add("scrolled"));
    } else {
        navElement.classList.remove("scrolled");
        // Remove class from links to restore their original color
        links.forEach(link => link.classList.remove("scrolled"));
    }
}

window.addEventListener("scroll", changeCss, false);
