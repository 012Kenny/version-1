/** 
* Client-side Account Menu
* this is for the drop down menu functionaility
*
* 
*
*
*
* 
* 
*/


// DomContentLoaded waits for the whole page to load before running the code.
document.addEventListener("DOMContentLoaded", async () => {

  
  //** ------- VARIABLES ------- **//
  const accountIcon = document.getElementById("account-icon");
  const dropdown = document.getElementById("account-dropdown"); 
  const usernameBox = document.getElementById("account-username"); 
  const signupBtn = document.getElementById("signup-btn");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  let loggedIn = false;
  //** ------------------------ **//
  /*
  *
  *
  */
  //** ------- Account dropdown toggle ------- **//
  accountIcon.addEventListener("click", () => {

    // when user clicks the account icon, it shows or hides the menu.
    // If visible > hide, if hidden > show
    dropdown.style.visibility =
        dropdown.style.visibility === "visible" ? "hidden" : "visible";
    });


    //** ------------------------ **//
    
    //* Fetches session information from the server *//
    // checks if user is already logged in
    try {
    const res = await fetch("/session"); // asks server: Who's logged in
    const data = await res.json(); // converts to JSON format

    //* -- Update page depending on login status -- *//
    if (data.loggedIn) { // If user is logged in
      // Show username, hide signup, hide login, show logout.
      loggedIn = true;
      usernameBox.textContent = data.username;
      signupBtn.style.display = "none";
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
    } else { // If user is not logged in
      // change username to guest, show sign up, show login, hide logout.
      loggedIn = false;
      usernameBox.textContent = "Guest";
      signupBtn.style.display = "block";
      loginBtn.style.display = "block";
      logoutBtn.style.display = "none";
    }
  } catch (err) { // for bug testing. if there's an error
    console.error(err);
  }


  //** ------- Button actions ------- **//

  // Sign up > Takes user to sign up page if not logged in
  signupBtn.addEventListener("click", () => {
    if (!loggedIn) window.location.href = "../AccountCreateLogin/accountcreate.html";
  });

  // Login > Takes user to login page if not logged in
  loginBtn.addEventListener("click", () => {
    if (!loggedIn) window.location.href = "../AccountCreateLogin/accountlogin.html";
  });

  // Log out > Logs user out, then refreshes page and redirects them to homepage
  logoutBtn.addEventListener("click", async () => {
    await fetch("/logout");
    window.location.reload(); // refresh page after logout
    window.location.href =  "../homepage/index.html"; 
  });



});