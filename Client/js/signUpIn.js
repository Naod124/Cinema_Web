async function getLogInfo() {
    let div = document.querySelector('.register-and-login-links');
    // check if you are logged in
    let loggedIn;
    try {
      loggedIn = await (await fetch('/api/login')).json();
    }
    catch (ignore) { }
    // if not logged in
    if (!loggedIn || loggedIn._error) {
      div.innerHTML = `
      <li><a type="button" class="data-link" value="home" href="/">Home</a></li>
      <li><a class="data-link" value="movies" type="button" href="/movies">Movies</a></li>
      <li><a class="data-link" value="tickets" type="button" href="/tickets">Tickets</a></li>
      <li><a id="login" class="data-link" value="signIn" type="button" href="/signin">Log in</a></li>
      <li><a id="signup" class="data-link" value="signup" type="button" href="/signup">Sign Up</a></li>
      `
    }
    // you are logged in
    else {
      div.innerHTML = `
      <li><a type="button" class="data-link" value="home" href="/">Home</a></li>
      <li><a class="data-link" value="movies" type="button" href="/movies">Movies</a></li>
      <li><a class="data-link" value="tickets" type="button" href="/tickets">Tickets</a></li>
      <li><a class="data-link" value="mybooking" type="button" href="/mybooking" onclick="showHistory()">My bookings</a></li>
      <li><a> Logged in as ${loggedIn.firstName} ${loggedIn.lastName} </a></li>
      <li><a href="/logout">Logout</a></li>
      `;
    }
  
    // Show the dashboard / start page for logged in users
  }
  getLogInfo();
  // Delegated event listener for logout
  document.querySelector('body').addEventListener('click', async (event) => {
  
    if (!event.target.closest('a[href="/logout"]')) { return; }
  
    // do not follow the link
    event.preventDefault();
  
    // log out using our REST-api
    let result;
    try {
      result = await (await fetch('/api/login', { method: 'DELETE' })).json();
    }
    catch (ignore) { }
  
    // Reload the page
    location.reload();
  
  });
  