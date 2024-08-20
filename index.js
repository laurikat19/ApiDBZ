// Función para obtener todos los personajes manejando la paginación
function fetchAllCharacters(url, allData = []) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            allData = allData.concat(data.items); // Añadir datos de la página actual

            // Verifica si hay una página siguiente
            if (data.links.next) {
                // Llama recursivamente para obtener la siguiente página
                return fetchAllCharacters(data.links.next, allData);
            } else {
                // Retorna todos los datos cuando no hay más páginas
                return allData;
            }
        });
}

// Función para obtener personajes y manejar la paginación
function getCharacters(done) {
    fetchAllCharacters("https://dragonball-api.com/api/characters?limit=10")
        .then(data => {
            done(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Función para mostrar los personajes en el HTML
function displayCharacters(data) {
    const main = document.querySelector("main");
    
    if (main) {
        data.forEach(personaje => {
            const articleHTML = `
                <article>
                    <div class="image-container">
                        <img src="${personaje.image}" alt="${personaje.name}">
                    </div>
                    <h2>Personaje: ${personaje.name}</h2>
                    <br>
                    <span>Ki: ${personaje.ki}</span>
                    <br>
                    <span>Raza: ${personaje.race}</span>
                </article>
            `;
            
            // Crea un nuevo elemento del DOM a partir del HTML generado
            const articleFragment = document.createRange().createContextualFragment(articleHTML);
            
            // Añade el nuevo elemento al main
            main.appendChild(articleFragment);
        });
    } else {
        console.error('Elemento <main> no encontrado en el documento.');
    }
}

// Función para recolectar datos del formulario y combinar con datos de la API
function createCombinedJSON() {
    // Recolecta los datos del formulario
    const formData = {
        id: document.querySelector("#id") ? document.querySelector("#id").value : '',
        name: document.querySelector("#name") ? document.querySelector("#name").value : '',
        ki: document.querySelector("#ki") ? document.querySelector("#ki").value : '',
        description: document.querySelector("#description") ? document.querySelector("#description").value : '',
    };

    // Obtiene los datos de la API
    getCharacters(data => {
        // Crea un objeto JSON que combine los datos del formulario y los datos de la API
        const combinedData = {
            formData: formData,
            apiData: data
        };

        // Convierte el objeto combinado a JSON
        const jsonData = JSON.stringify(combinedData, null, 2);

        // Imprime el JSON en la consola
        console.log(jsonData);

        // Opcional: Descargar el JSON como archivo
        downloadJSON(jsonData);

        // Mostrar los personajes en el HTML
        displayCharacters(data);
    });
}

// Función para descargar el JSON como archivo
function downloadJSON(jsonData) {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'combinedData.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Llama a la función para crear el JSON combinado y opcionalmente descargarlo
createCombinedJSON();
