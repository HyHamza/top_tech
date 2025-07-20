
document.querySelector(".btnn").addEventListener("click", function (e) {
    e.preventDefault();
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if (email && password) {
        localStorage.setItem("isLoggedIn", "true");
        alert("Login successful!");
        window.location.href = "home.html";
    } else {
        alert("Please enter both email and password.");
    }
});



