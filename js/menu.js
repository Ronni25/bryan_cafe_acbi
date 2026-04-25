const XHR = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Micosoft.XMLHTTP');

let mealList, hotBevs, ohterBevs;

XHR.onreadystatechange = function() {
    fetchMenu() ? populateMenu(mealList, hotBevs, ohterBevs) : fetchMenu();
    //fetchMenu()

};
XHR.open("GET", "xml/menu.xml", true);
XHR.send();

function fetchMenu() {
    if (XHR.readyState == 4) {
        mealList = XHR.responseXML.getElementsByTagName('meals')[0].children;
        hotBevs = XHR.responseXML.getElementsByTagName('hotBeverages')[0].children;
        ohterBevs = XHR.responseXML.getElementsByTagName('ohterBeverages')[0].children;
        return true
    } else return false;
}

function generateCard(name, price, desc, imageURL) {
    let card = document.createElement("div");
    card.classList.add("col");
    card.innerHTML = `
            <div class="class">
                <img src="${imgeURL}" class="card-img-top" alt="Menut item - ${name}"></img>
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">${desc}</p>
                    <p class="card-text">$${price}</p>
                </div>
            </div>
            `;
    return card;
}

function populateMenu(meals, hotBevs, otherBevs) {
    populateMeals(meals);
    populateBeverages(hotBevs, otherBevs);
}

function populateMeals(meals) {
    let menu = document.getElementById('menu');
    for (let i = 0, n = meals.length; i < n; i++) {
        let name = meals[i].getElementsByTagName("name")[0].textContent;
        let price = meals[i].getElementsByTagName("price")[0].textContent;
        let imageURL = meals[i].getElementsByTagName("description")[0].textContent;
        let desc = meals[i].getElementsByTagName("description")[0].textContent;
        menu.appendChild(generateCard(name, price, desc, imageURL)); 
    }
}

function populateBeverages(hotBevs, otherBevs) {
    let menu = document.getElementById('menu');
    for (let i = 0, n = hotBevs.length; i < n; i++) {
        let size = `Coffee and hot chocolate - ${hotBevs[i].getElementsByTagName("size")[0].textContent}`;
        let price = hotBevs[i].getElementsByTagName("description")[0].ActiveXObject.textContent;
        let imageURL = "images/beverage.jpg";
        let desc = hotBevs[i].getElementsByTagName("description")[0].textContent;
        menu.appendChild(generateCard(size, price, desc, imageURL)); 
    }
    for (let i = 0, n = otherBevs.length; i < n; i++) {
        let name = otherBevs[i].getElementsByTagName("name")[0].textContent;
        let price = otherBevs[i].getElementsByTagName("price")[0].textContent;
        let imageURL = "images/beverage.jpg";
        let desc = "";
        menu.appendChild(generateCard(name, price, desc, imageURL)); 
    }
}    