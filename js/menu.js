/**
 * Bryan's Café - Lógica do Menu (Versão Final e Estável)
 * Resolve o problema de largura usando catBox com w-100.
 */
const XHR = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

document.addEventListener("DOMContentLoaded", function() {
    let menuContainer = document.getElementById('menuContainer');
    if (!menuContainer) return;

    XHR.onreadystatechange = function() {
        if (XHR.readyState == 4 && (XHR.status == 200 || XHR.status == 0)) {
            let xmlDoc = XHR.responseXML;
            if (!xmlDoc && XHR.responseText) {
                let parser = new DOMParser();
                xmlDoc = parser.parseFromString(XHR.responseText, "text/xml");
            }

            if (xmlDoc && xmlDoc.getElementsByTagName("parsererror").length === 0) {
                menuContainer.innerHTML = ""; 
                populateMenu(xmlDoc, menuContainer);
            }
        }
    };
    XHR.open("GET", "xml/menu.xml", true);
    XHR.send();
});

// Função para gerar o cabeçalho (Ajusta a largura com w-100)
function generateCategoryHeader(title, icon, targetId) {
    let header = document.createElement("div");
    header.className = "w-100"; 
    header.innerHTML = `
        <div class="p-2 mt-4 d-none d-md-block user-select-none w-100" 
             data-bs-toggle="collapse" data-bs-target="#${targetId}" 
             style="background-color: #d3d3d3; color: black; font-weight: bold; border-top: 2px solid white; cursor: pointer;">
            <i class="fas fa-caret-${icon} me-2 fs-4 align-middle"></i>
            <span class="fs-5">${title}</span>
            <span class="float-end fw-normal small mt-1 me-2">(Click to expand/collapse)</span>
        </div>
        <div class="mt-5 mb-3 d-md-none user-select-none w-100"
             data-bs-toggle="collapse" data-bs-target="#${targetId}" 
             style="cursor: pointer; border-bottom: 2px solid #835361; padding-bottom: 5px;">
             <h4 class="fw-bold text-black d-inline-block m-0">${title}</h4>
             <i class="fas fa-caret-${icon} ms-2 fs-4 align-middle text-black"></i>
        </div>
    `;
    return header;
}

// Função para gerar o item individual
function generateMenuItem(name, price, desc, imageURL) {
    let row = document.createElement("div");
    row.classList.add("row", "align-items-center", "mb-4", "pb-2");
    row.innerHTML = `
        <div class="col-md-9 d-none d-md-flex align-items-center justify-content-between pe-4">
            <div class="fw-bold fs-5" style="width: 30%;">${name}</div>
            <div class="fw-bold fs-3 mx-2">|</div>
            <div class="fw-bold fs-5 text-center" style="width: 15%;">${price}</div>
            <div class="fw-bold fs-3 mx-2">|</div>
            <div class="fw-bold" style="width: 45%;">${desc}</div>
        </div>
        <div class="col-7 d-md-none">
            <div class="fw-bold fs-5 mb-1">${name}</div>
            <div class="fw-bold mb-1">Price: ${price}</div>
            <div class="small fw-bold">${desc}</div>
        </div>
        <div class="col-5 col-md-3">
            <img src="${imageURL}" alt="${name}" class="img-fluid w-100 border border-dark rounded" style="object-fit: cover; height: 130px;">
        </div>
    `;
    return row;
}

// Função para popular o menu (Usa o catBox para travar a largura)
function populateMenu(xml, container) {
    const categories = [
        { tag: 'meals', label: 'Meals', icon: 'down', id: 'collapseMeals' },
        { tag: 'hotBeverages', label: 'Hot Beverages', icon: 'down', id: 'collapseHotBevs' },
        { tag: 'otherBeverages', label: 'Other Beverages', icon: 'down', id: 'collapseOtherBevs' }
    ];

    categories.forEach(cat => {
        let list = xml.getElementsByTagName(cat.tag)[0];
        if (list && list.getElementsByTagName('menuItem').length > 0) {
            
            // Contentor pai que impede o encolhimento
            let catBox = document.createElement("div");
            catBox.className = "w-100 mb-2"; 
            
            catBox.appendChild(generateCategoryHeader(cat.label, cat.icon, cat.id));
            
            let collapseArea = document.createElement("div");
            collapseArea.className = "collapse bg-light p-3 p-md-4 mb-4 w-100"; 
            collapseArea.id = cat.id; 
            
            let items = list.getElementsByTagName('menuItem');
            Array.from(items).forEach(item => {
                let name = item.getElementsByTagName("name")[0]?.textContent.trim() || "";
                let price = item.getElementsByTagName("price")[0]?.textContent.trim() || "";
                let desc = item.getElementsByTagName("description")[0]?.textContent.trim() || "";
                let image = item.getElementsByTagName("imageURL")[0]?.textContent.trim() || "images/default.jpg";
                let size = item.getElementsByTagName("size")[0]?.textContent.trim() || "";
                let displayName = size ? `${name} - ${size}` : name;
                
                collapseArea.appendChild(generateMenuItem(displayName, price, desc, image));
            });
            
            catBox.appendChild(collapseArea);
            container.appendChild(catBox);
        }
    });
}