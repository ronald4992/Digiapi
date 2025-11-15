import { db } from '../firebaseConfig.js';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

export default async function mostrarOriginal() {

    const contenedor = document.getElementById("app");
    contenedor.innerHTML = "";

    const titulo = document.createElement("h2");
    titulo.textContent = "Guardar puntuación del juego + Ranking";
    contenedor.appendChild(titulo);

    // Objeto base
    let puntuacion = {
        jugador: "",
        puntos: 0,
        fecha: new Date().toISOString()
    };

    // Inputs
    const inputJugador = document.createElement("input");
    inputJugador.placeholder = "Nombre del jugador";

    const inputPuntos = document.createElement("input");
    inputPuntos.placeholder = "Puntuación";
    inputPuntos.type = "number";

    contenedor.appendChild(inputJugador);
    contenedor.appendChild(document.createElement("br"));
    contenedor.appendChild(inputPuntos);
    contenedor.appendChild(document.createElement("br"));

    // Botón guardar
    const botonGuardar = document.createElement("button");
    botonGuardar.textContent = "Guardar puntuación";

    botonGuardar.onclick = async () => {
        if (!inputJugador.value || !inputPuntos.value) {
            alert("⚠️ Llena todos los campos.");
            return;
        }

        // Actualizar el objeto
        puntuacion.jugador = inputJugador.value;
        puntuacion.puntos = parseInt(inputPuntos.value);
        puntuacion.fecha = new Date().toISOString();

        try {
            await addDoc(collection(db, "puntuaciones"), puntuacion);
            alert("✅ Puntuación guardada!");
            cargarRanking(); // refrescar tabla
        } catch (error) {
            console.error("Error:", error);
            alert("❌ No se pudo guardar.");
        }
    };

    contenedor.appendChild(botonGuardar);

    // JSON en vivo
    const salida = document.createElement("pre");
    salida.textContent = JSON.stringify(puntuacion, null, 2);
    contenedor.appendChild(salida);

    inputJugador.oninput = () => {
        puntuacion.jugador = inputJugador.value;
        salida.textContent = JSON.stringify(puntuacion, null, 2);
    };

    inputPuntos.oninput = () => {
        puntuacion.puntos = inputPuntos.value;
        salida.textContent = JSON.stringify(puntuacion, null, 2);
    };

    // Contenedor ranking
    const rankingTitulo = document.createElement("h3");
    rankingTitulo.textContent = "🏆 Ranking (mayor a menor)";
    contenedor.appendChild(rankingTitulo);

    const rankingTabla = document.createElement("div");
    rankingTabla.id = "ranking";
    contenedor.appendChild(rankingTabla);

    // Función para cargar ranking desde Firestore
    async function cargarRanking() {
        rankingTabla.innerHTML = "Cargando ranking...";

        const q = query(
            collection(db, "puntuaciones"),
            orderBy("puntos", "desc") // ordenar mayor a menor
        );

        const querySnapshot = await getDocs(q);

        let html = `
            <table border="1" style="margin-top:10px; width:100%; border-collapse: collapse; text-align:center;">
                <tr>
                    <th>Jugador</th>
                    <th>Puntos</th>
                    <th>Fecha</th>
                </tr>
        `;

        querySnapshot.forEach(doc => {
            const data = doc.data();
            html += `
                <tr>
                    <td>${data.jugador}</td>
                    <td>${data.puntos}</td>
                    <td>${data.fecha.split("T")[0]}</td>
                </tr>
            `;
        });

        html += "</table>";

        rankingTabla.innerHTML = html;
    }

    // Cargar al iniciar
    cargarRanking();
}
