document.addEventListener("DOMContentLoaded", async () => {
  const accountIcon = document.getElementById("account-icon");
  const dropdown = document.getElementById("account-dropdown"); 
  const usernameBox = document.getElementById("account-username"); 
  const signUpBtn = document.getElementById("signup-btn");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  let loggedIn = false;

  // account dropdown toggle
  accountIcon.addEventListener("click", () => {
    dropdown.style.visibility =
        dropdown.style.visibility === "visible" ? "hidden" : "visible";
    });

    
})