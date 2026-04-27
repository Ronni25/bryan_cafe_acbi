const XHR = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

// 1. Espera que o HTML carregue totalmente antes de executar
window.onload = function() {
    let branchContainer = document.getElementById('branchesContainer');
    if (!branchContainer) return;

    XHR.onreadystatechange = function() {
        if (XHR.readyState == 4 && (XHR.status == 200 || XHR.status == 0)) {
            let xmlDoc = XHR.responseXML;
            
            // Se o responseXML falhar por segurança local, tentamos converter o texto à força
            if (!xmlDoc && XHR.responseText) {
                let parser = new DOMParser();
                xmlDoc = parser.parseFromString(XHR.responseText, "text/xml");
            }

            // Verifica se conseguimos ter um XML válido e se ele não tem erros de sintaxe (parsererror)
            if (xmlDoc && xmlDoc.getElementsByTagName("parsererror").length === 0) {
                let branchList = xmlDoc.getElementsByTagName('branch');
                
                // Limpa a mensagem de erro (se existir)
                branchContainer.innerHTML = ""; 
                
                populateBranches(branchList, branchContainer);
            } else {
                branchContainer.innerHTML = "<p style='color:red; text-align:center;'>Erro: O ficheiro XML não pôde ser lido. Verifique o console (F12) para detalhes.</p>";
                console.error("Falha ao analisar o XML. O texto recebido foi:", XHR.responseText);
            }
        }
    };

    XHR.open("GET", "xml/branch.xml", true);
    XHR.send();
};

function generateBranchHTML(address, contact, hours, mapsLink) {
    let row = document.createElement("div");
    row.classList.add("row", "align-items-center", "mb-4", "pb-3", "border-bottom");
    
    row.innerHTML = `
        <div class="col-12 d-md-none mb-3">
            <iframe src="${mapsLink}" width="100%" height="200" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
        
        <div class="col-12 col-md-3 mb-3 mb-md-0 text-center text-md-start">
            <strong class="d-md-none text-uppercase small text-muted">Address:</strong><br class="d-md-none">
            ${address}
        </div>
        
        <div class="col-12 col-md-2 mb-3 mb-md-0 text-center text-md-start">
            <strong class="d-md-none text-uppercase small text-muted">Contact:</strong><br class="d-md-none">
            ${contact}
        </div>
        
        <div class="col-12 col-md-4 mb-3 mb-md-0 text-center text-md-start">
            <strong class="d-md-none text-uppercase small text-muted">Opening Hours:</strong><br class="d-md-none">
            ${hours}
        </div>
        
        <div class="col-md-3 d-none d-md-block">
            <iframe src="${mapsLink}" width="100%" height="100" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
    `;
    return row;
}

function populateBranches(branches, container) {
    Array.from(branches).forEach(branch => {
        let address = branch.getElementsByTagName("address")[0]?.textContent.trim() || "";
        let contact = branch.getElementsByTagName("contact")[0]?.textContent.trim() || "";
        let hours = branch.getElementsByTagName("hours")[0]?.textContent.trim() || "";
        let mapsLink = branch.getElementsByTagName("mapsLink")[0]?.textContent.trim() || "";
        
        container.appendChild(generateBranchHTML(address, contact, hours, mapsLink));
    });
}