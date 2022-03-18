/* import movies from "./js/movies.js";
import tickets from "./js/tickets.js";
import signin from "./js/signIn.js";
import signup from "./js/signUp.js";
 */
/* 
window.onload = function()
{
    const path = window.location.pathname.split("/");

    switch(path[1])
    {
        case "":
        {
            loadPage("home");
            break;
        }
        case "movies":
        {
            loadPage("movies");
            break;
        }
        case "tickets":
        {
            loadPage("tickets");
            break;
        }
        case "mybooking":
          {
              loadPage("mybooking");
              break;
          }
          case "signIn":
            {
                loadPage("signIn");
                break;
            }
            case "signup":
            {
                loadPage("signup");
                break;
            }
        default:
        {
            loadPage("404");
            break;
        }
    }

    document.querySelectorAll(".links").forEach((item) =>
    {
        item.addEventListener("click", async (event)=>
        {
            const path = item.getAttribute("value");
            event.preventDefault();
            loadPage(path);
             
            if(path == "home")
            {
                window.history.pushState("", "", "/");
                return;
            }

            window.history.pushState("", "", path);
        });
    });
    
      
    function loadPage($path)
    {
        if($path == "") return;
        const container = document.getElementById("maincontainer");
        
        const request = new XMLHttpRequest();
        request.open("GET", "./pages/" + $path + ".html");
        request.send();
        request.onload = function()
        {
            if(request.status == 200)
            {
                container.innerHTML = request.responseText;
                document.title = $path;
            }
        }
    }

} */
document.querySelector('body').addEventListener('click', function (event) {
  // event = an object with info about the event
  // event.target = the innermost HTML-element I clicked
  // closest - a method all HTML-element have
  // that you can send a selector to to see if it matches
  // the element or any of its parents

  let aTag = event.target.closest('a');

  // do nothing if not click on an atag
  if (!aTag) { return; }

  let href = aTag.getAttribute('href');

  // check if external link then open in a new window
  if (href.indexOf('http') === 0) {
    aTag.setAttribute('target', '_blank');
    return;
  }

  // it's an internal link

  // prevent the default behavior of the browser
  // (that is - follow the link/reload the page)
  event.preventDefault();

  // Use HTML5 history and push a new state
  history.pushState(null, null, href);

  // Call the router
  router();
});

function makeMenuChoiceActive(route) {
  // change active link in the menu
  let aTagsInNav = document.querySelectorAll('nav a');
  for (let aTag of aTagsInNav) {
    aTag.classList.remove('active');
    let href = aTag.getAttribute('href');
    if (href === route) {
      aTag.classList.add('active');
    }
  }
}

async function router() {
  let route = location.pathname;
  makeMenuChoiceActive(route);
  // transform route to be a path to a partial
  route = route === '/' ? '/home' : route;
  route = './pages' + route + '.html';
  // load the content from the partial
  let content = await (await fetch(route)).text();
  // if no content found then load the start page
  content.includes('<title>Error</title>') && location.replace('/');
  // replace the content of the main element
  document.querySelector('main').innerHTML = content;
  // run the productLister function (in another file)
  // if the route is '/partials/products.html';
  //route === '/partials/products.html' && loadJsonAndDisplayProducts();
}
// runt the router when using the back/forward buttons
window.addEventListener('popstate', router);

// run the router on page load
router();

const toggleButton = document.getElementsByClassName("toggle-button")[0];
const navbarLinks = document.getElementsByClassName("navbar-links")[0];

toggleButton.addEventListener("click", () => {
  navbarLinks.classList.toggle("active");
});


