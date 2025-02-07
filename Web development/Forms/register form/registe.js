document.getElementById("sb").onclick = function(event) {
    alert("Form is being submitted!");
};
function dobChanged() {
    alert("DOB has been changed!");
}
function changeColor(element) {
    element.style.color = element.style.color === "crimson" ? "blue" : "crimson";
}
document.getElementById("username").onkeydown = function(event) {
    console.log("Key Down: " + event.key);
};
document.getElementById("username").onkeypress = function(event) {
    console.log("Key Pressed: " + event.key);
};
document.getElementById("username").onkeyup = function(event) {
    console.log("Key Up: " + event.key);
};
let button = document.getElementById("sb");
button.onmouseover = function() {
    button.style.backgroundColor = "red";
};
button.onmouseout = function() {
    button.style.backgroundColor = "blue";
};
document.getElementById("registrationForm").addEventListener("click", function() {
    console.log("Bubbling: Form Clicked!");
}, false);
document.getElementById("registrationForm").addEventListener("click", function() {
    console.log("Capturing: Form Clicked!");
}, true);
document.getElementById("sb").addEventListener("click", function() {
    console.log("Button Clicked!");
});
document.getElementById("username").addEventListener("blur", function() {
    sessionStorage.setItem("username", this.value);
});
document.getElementById("gmail").addEventListener("blur", function() {
    sessionStorage.setItem("email", this.value);
});
window.onload = function() {
    if (sessionStorage.getItem("username")) {
        document.getElementById("username").value = sessionStorage.getItem("username");
    }
    if (sessionStorage.getItem("email")) {
        document.getElementById("gmail").value = sessionStorage.getItem("email");
    }
};
