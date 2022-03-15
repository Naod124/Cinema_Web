document.querySelector('body').addEventListener('submit', async (event) => {
    let target = event.target;
    if (!target.closest('form[name="registration"]')) { return; }
    alert("HI there");
    event.preventDefault();

    let formElements = document.forms.registration.elements;
  // loop through the elements and read their names and values
  let requestBody = {};
  for (let element of formElements) {
    if (element.type === 'submit') { continue; }
    requestBody[element.name] = element.value;
  }
 
 
  console.log(requestBody);

 if (requestBody.password !== requestBody.confirm) {
    alert('The passwords doesn\'t match!\nPlease fill in the same password twice!');
    return;
  }

    delete requestBody.confirm;
    console.log(requestBody);
    let result = {};
    try {
        result = await (await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })).json();
    }
    catch (ignore) { }

    if (!result.changes) {
        document.querySelector('body').innerHTML = `
          <h3>Something went wrong!</h3>
          <p>We could not register you right now because of a technical problem.</p>
          <p>Please try again later!</p>
        `;
        return;
      }
    
      document.querySelector('body').innerHTML = `
        <h3>Welcome ${JSON.stringify(requestBody.firstName)}!</h3>
        <p>You are now successfully registrered as a member!</p>
      `;
}); 
