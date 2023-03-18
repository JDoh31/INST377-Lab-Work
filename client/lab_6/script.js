/* eslint-disable max-len */

/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/

/*
  ## Utility Functions
    Under this comment place any utility functions you need - like an inclusive random number selector
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
*/


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
  // The maximum is inclusive and the minimum is inclusive
}

function injectHTML(list) {
  console.log('fired injectHTML');
  const target = document.querySelector('#restaurant_list');
  target.innerHTML = '';
  list.forEach((item) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str
  })
}

function processRestaurants(list) {
  console.log('fired restaurants list');

  /*
    ## Process Data Separately From Injecting It
      This function should accept your 1,000 records
      then select 15 random records
      and return an object containing only the restaurant's name, category, and geocoded location
      So we can inject them using the HTML injection function
      You can find the column names by carefully looking at your single returned record
      https://data.princegeorgescountymd.gov/Health/Food-Inspection/umjn-t2iz
    ## What to do in this function:
    - Create an array of 15 empty elements (there are a lot of fun ways to do this, and also very basic ways)
    - using a .map function on that range,
    - Make a list of 15 random restaurants from your list of 100 from your data request
    - Return only their name, category, and location
    - Return the new list of 15 restaurants so we can work on it separately in the HTML injector
  */
}

function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  })
}

async function mainEvent() { // the async keyword means we can make API requests
  const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
  const filterButton = document.querySelector('.filter_button');
  // Add a querySelector that targets your filter button here

  let currentList = []; // this is "scoped" to the main event function
  
  /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
  mainForm.addEventListener('submit', async (submitEvent) => { // async has to be declared on every function that needs to "await" something
    
    // This prevents your page from becoming a list of 1000 records from the county, even if your form still has an action set on it
    submitEvent.preventDefault(); 
    
    // this is substituting for a "breakpoint" - it prints to the browser to tell us we successfully submitted the form
    console.log('form submission'); 

    /*
      ## GET requests and Javascript
        We would like to send our GET request so we can control what we do with the results
        Let's get those form results before sending off our GET request using the Fetch API
    
      ## Retrieving information from an API
        The Fetch API is relatively new,
        and is much more convenient than previous data handling methods.
        Here we make a basic GET request to the server using the Fetch method to the county
    */

    // Basic GET request - this replaces the form Action
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');

    // This changes the response from the GET into data we can use - an "object"
    currentList = await results.json();
    console.table(currentList); 
    injectHTML(currentList);
  });

filterButton.addEventListener('click', (event) => {
  console.log('clicked FilterButton');

  const formData = new FormData(mainForm);
  const formProps = Object.fromEntries(formData);

  console.log(formProps);
  const newList = filterList(currentList, formProps.resto);

  console.log(newList);
})
  /*
    Now that you HAVE a list loaded, write an event listener set to your filter button
    it should use the 'new FormData(target-form)' method to read the contents of your main form
    and the Object.fromEntries() method to convert that data to an object we can work with
    When you have the contents of the form, use the placeholder at line 7
    to write a list filter
    Fire it here and filter for the word "pizza"
    you should get approximately 46 results
  */
}

/*
  This adds an event listener that fires our main event only once our page elements have loaded
  The use of the async keyword means we can "await" events before continuing in our scripts
  In this case, we load some data when the form has submitted
*/
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
