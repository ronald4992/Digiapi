export default async function mostrarHome() {
    const appContainer = document.getElementById("app");
    appContainer.innerHTML = "<h2>Cargando Digimons...</h2>";

    // Crear buscador antes del contenedor
    crearBuscador();

    try {
        const response = await fetch("https://digimon-api.vercel.app/api/digimon");
        const digimons = await response.json();

        appContainer.innerHTML = "";

        digimons.forEach((digi) => {
            const card = document.createElement("div");
            card.classList.add("app-card");

            card.innerHTML = `
                <img src="${digi.img}" alt="${digi.name}">
                <div class="app-info">
                    <h2>${digi.name}</h2>
                    <p><strong>Nivel:</strong> ${digi.level}</p>
                </div>
            `;

            // Al hacer clic → vista individual
            card.addEventListener("click", () => mostrarDetalle(digi));

            appContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Error al cargar los digimons:", error);
        appContainer.innerHTML = "<p>Error al cargar la información 😢</p>";
    }
}



/* ---------------------------------------------------
   BUSCADOR PARA FILTRAR DIGIMONS
---------------------------------------------------- */
function crearBuscador() {
    // Evitar crear el buscador dos veces
    if (document.getElementById("searchBox")) return;

    const input = document.createElement("input");
    input.id = "searchBox";
    input.placeholder = "Buscar Digimon...";

    // Insertar antes del contenedor
    const app = document.getElementById("app");
    app.parentNode.insertBefore(input, app);

    input.addEventListener("input", () => {
        const valor = input.value.toLowerCase();
        const tarjetas = document.querySelectorAll(".app-card");

        tarjetas.forEach(card => {
            const nombre = card.querySelector("h2").textContent.toLowerCase();
            card.style.display = nombre.includes(valor) ? "block" : "none";
        });
    });
}



/* ---------------------------------------------------
   VISTA DETALLADA DE UN DIGIMON
---------------------------------------------------- */
function mostrarDetalle(digi) {
    const app = document.getElementById("app");

    app.innerHTML = `
        <button id="volverBtn" style="
            margin-bottom:15px;
            padding:10px 15px;
            border:none;
            background:#007bff;
            color:white;
            border-radius:10px;
            cursor:pointer;
        ">Volver</button>

        <div style="text-align:center;">
            <img src="${digi.img}" style="width:170px;">
            <h2>${digi.name}</h2>
            <p><strong>Nivel:</strong> ${digi.level}</p>
        </div>
    `;

    document.getElementById("volverBtn").onclick = () => mostrarHome();
}
