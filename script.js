
var hierarchy = {};

function saveHierarchy(hierarchy) {
    localStorage.setItem('hierarchy', JSON.stringify(hierarchy));
    alert('Hijerarhija sačuvana!');
}

function loadHierarchy() {
    var loadedHierarchy = localStorage.getItem('hierarchy');
    if (loadedHierarchy) {
        hierarchy = JSON.parse(loadedHierarchy);
        showHierarchy();
    } else {
        alert('Nema prethodno sačuvane hijerarhije.');
    }
}

function loadHierarchyFromFile() {
    console.log("load")
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];

    if (!file) {
        alert('Molimo izaberite datoteku.');
        return;
    }

    console.log("stigao ovde")

    var reader = new FileReader();
    reader.onload = function () {
        console.log("a i stigao ovde")
        try {
            var loadedHierarchy = JSON.parse(reader.result);
            hierarchy = loadedHierarchy;
            showHierarchy();
            saveHierarchy(hierarchy);
            alert('Hijerarhija učitana iz datoteke!');
        } catch (error) {
            alert('Greška prilikom čitanja datoteke. Molimo provjerite da je datoteka u ispravnom formatu.');
        }
    };

    reader.readAsText(file);
}


function showHierarchy() {
    var element = document.getElementById('hierarchy');
    element.innerHTML = '';
    printHierarchy(hierarchy, element);
}

function addElementPrompt() {
    var path = prompt("Unesite putanju do novog elementa (npr., Programiranje/Python): ").split('/');
    addElement(hierarchy, document.getElementById('hierarchy'), path);
}

function createNewElement(part) {
    var div = document.createElement('div');
    div.className = 'level';
    div.innerText = part;
    div.onclick = function (e) {
        toggleChildrenVisibility(e.target);
        e.stopPropagation();
    };
    var childrenContainer = document.createElement('div');
    childrenContainer.className = 'children';
    div.appendChild(childrenContainer);
    return div;
}

function addElement(node, element, path) {
    if (path.length === 0) return;
    var part = path.shift();

    if (!node[part]) {
        node[part] = {};
        var div = createNewElement(part);
        element.appendChild(div);
        element = div.querySelector('.children');
    } else {
        var childElements = Array.from(element.children);
        var matchingDiv = childElements.find(child => child.innerText.includes(part));
        element = matchingDiv.querySelector('.children');
    }

    addElement(node[part], element, path);
}


function printHierarchy(node, element) {
    for (var key in node) {
        var div = createNewElement(key);
        element.appendChild(div);
        printHierarchy(node[key], div.querySelector('.children'));
    }
}

function toggleChildrenVisibility(element) {
    var children = element.querySelector('.children');
    if (children.style.display === 'none') {
        children.style.display = 'block';
    } else {
        children.style.display = 'none';
    }
}
