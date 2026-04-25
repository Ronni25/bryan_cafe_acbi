const XHR = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
let cards = document.getElementsByClassName('cardDeck')[0];
let branchList;

XHR.onreadystatechange = function() {
    fetchBranches() ? populateBranches(branchList) : fetchBranches();

};
XHR.open("GET", "xml/branches.xml", true);
XHR.send();

function fetchBranches() {
    if(XHR.readyState == 4) {
        //console.log('pizzas fetched');
        branchList = XHR.responseXML.getElementsByTagName('branch');
        return true
    } else return false;
}

function generateCard(address, contact, hours, mapsLink) {
    let card = document.createElement("div");
    card.classList.add("col");
    card.innerHTML = `
        <div class="card">
            <iframe id="branch1" src="${mapsLink}"
                width="100%" height="300px" style="border:0;margin:auto" allowfullscreen="" loading="lazy" class="card-img-top"></iframe>
            <div class="card-body">
                <h5 class="card-title">${address}</h5>
                <p class="card-text">${contact}</p>
                <p class="card-text">${hours}</p>
            </div>
        </div>
        `;
    return card;
}

function populateBranches(branches) {
    Array.from(branches).forEach(branch => {
        let address = branch.getElementsByTagName("address")[0].textContent;
        let contact = branch.getElementsByTagName("contact")[0].textContent;
        let hours = branch.getElementsByTagName("hours")[0].textContent;
        let mapsLink = branch.getElementsByTagName("mapsLink")[0].textContent;
        cards.appendChild(generateCard(address, contact, hours, mapsLink));
    })
    
}