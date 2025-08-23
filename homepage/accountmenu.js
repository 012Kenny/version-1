
document.addEventListener("DOMContentLoaded", async () => {
  const accountIcon = document.getElementById("account-icon");
  const dropdown = document.getElementById("account-dropdown"); 
  const usernameBox = document.getElementById("account-username"); 
  const signupBtn = document.getElementById("signup-btn");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  let loggedIn = false;

  // account dropdown toggle
  accountIcon.addEventListener("click", () => {
    dropdown.style.visibility =
        dropdown.style.visibility === "visible" ? "hidden" : "visible";
    });


    
    // get sesssion information

    try {
    const res = await fetch("/session");
    const data = await res.json();

    if (data.loggedIn) {
      loggedIn = true;
      usernameBox.textContent = data.username;
      signupBtn.style.display = "none";
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
    } else {
      loggedIn = false;
      usernameBox.textContent = "Guest";
      signupBtn.style.display = "block";
      loginBtn.style.display = "block";
      logoutBtn.style.display = "none";
    }
  } catch (err) {
    console.error(err);
  }

  // Button actions
  signupBtn.addEventListener("click", () => {
    if (!loggedIn) window.location.href = "../AccountCreateLogin/accountcreate.html";
  });

  loginBtn.addEventListener("click", () => {
    if (!loggedIn) window.location.href = "../AccountCreateLogin/accountlogin.html";
  });

  logoutBtn.addEventListener("click", async () => {
    await fetch("/logout");
    window.location.reload(); // refresh page after logout
  });
});