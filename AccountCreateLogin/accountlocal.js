/** 
* client side account system
* for recieving server requests from the account signup/login and updating on client
*
* 
*
*
*
* 
* 
*/


document.addEventListener("DOMContentLoaded", () => {
  
    //** ------- variables ------- **//
    const form = document.querySelector('form');
    const errorBox = document.getElementById('error-text');


    
    //** ------- Form submit event ------- **//
    form.addEventListener('submit', async (e) => {
      // get form data
      e.preventDefault(); // stops the page reload
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      //** ------------------------ **//

    // whether form is login or sign up
    const action = form.getAttribute('action');
    

    try {
      // SEND DATA TO SERVER
        const res = await fetch(action, { // send post request to login/sign up
          method: "POST",
          headers: { "Content-Type": "application/json" }, // server expects json
          body: JSON.stringify(data) // convert js object to json
        });
        
        
        
        const result = await res.json(); // server response to js object
        

        // ------- HANDLE SERVER RESPONSE ------- //
        if (result.success) {
          window.location.href = "../homepage/index.html"; // redirect to homepage
        } else { // if not success, show error msg 
          errorBox.textContent = result.message;
          errorBox.style.display = "block";
        }
      // debuggging. if network/server error occurs
      } catch (err) {
        console.error("Client error:", err)
        errorBox.textContent = "Something went wrong. Please try again.";
        errorBox.style.display = "block";
      }
    });
  });