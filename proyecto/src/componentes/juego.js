import { db } from '../firebaseConfig.js';
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

export default async function mostrarJuego() {

    // ---------------------------
    // IMPORTAR CSS
    // ---------------------------
    const link = document.createElement("link");
    link.href = "./style.css";
    document.head.appendChild(link);

    // ---------------------------
    // CREAR UI DEL JUEGO
    // ---------------------------
    const container = document.createElement("div");
    container.id = "gameContainer";

    container.innerHTML = `
        <h2>Adivina el Digimon</h2>

        <label>Dificultad:</label>
        <select id="dificultad">
            <option value="facil">Fácil</option>
            <option value="normal" selected>Normal</option>
            <option value="dificil">Difícil</option>
        </select>

        <img id="digimonImg">

        <p id="pista" style="opacity:0.8; margin: 4px 0;"></p>

        <input id="respuesta" placeholder="Escribe el nombre...">
        <button id="btnEnviar">Enviar</button>
        <button id="btnNuevo">Nuevo Digimon</button>

        <div id="scoreboard">
            <h3>Puntajes</h3>
            <ul id="scoreList"></ul>
        </div>
    `;

    document.body.appendChild(container);

    const img = document.getElementById("digimonImg");
    const pista = document.getElementById("pista");
    const input = document.getElementById("respuesta");
    const btnEnviar = document.getElementById("btnEnviar");
    const btnNuevo = document.getElementById("btnNuevo");
    const difSelect = document.getElementById("dificultad");
    const scoreList = document.getElementById("scoreList");

    // ---------------------------
    // VARIABLES
    // ---------------------------
    let digimons = [];
    let actual = null;
    let score = 0;
    let jugando = false;
    let timer = null;

    // ---------------------------
    // CARGAR API
    // ---------------------------
    async function cargarAPI() {
        const res = await fetch("https://digimon-api.vercel.app/api/digimon");
        digimons = await res.json();
    }

    // ---------------------------
    // MOSTRAR DIGIMON ALEATORIO
    // ---------------------------
    function nuevoDigimon() {
        jugando = true;
        input.value = "";
        pista.textContent = "";
        clearTimeout(timer);

        const random = Math.floor(Math.random() * digimons.length);
        actual = digimons[random];

        img.src = actual.img;

        aplicarDificultad();

        iniciarTimer();
    }

    // ---------------------------
    // APLICAR DIFICULTAD
    // ---------------------------
    function aplicarDificultad() {
        const d = difSelect.value;
        const nombre = actual.name;

        if (d === "facil") {
            pista.textContent = `Pista: empieza con "${nombre[0]}"`;
        } else {
            pista.textContent = "";
        }
    }

    // ---------------------------
    // TIMER SEGÚN DIFICULTAD
    // ---------------------------
    function iniciarTimer() {
        const d = difSelect.value;

        let tiempo = 0;

        if (d === "normal") tiempo = 7000;      // 7s
        if (d === "dificil") tiempo = 4000;     // 4s

        if (tiempo > 0) {
            timer = setTimeout(() => {
                jugando = false;
                alert(`⏰ Se acabó el tiempo!\nEra: ${actual.name}\nPuntaje: ${score}`);
                guardarScore();
                score = 0;
            }, tiempo);
        }
    }

    // ---------------------------
    // VALIDAR RESPUESTA
    // ---------------------------
    function validar() {
        if (!jugando) return;

        const respuesta = input.value.trim().toLowerCase();
        const nombreReal = actual.name.toLowerCase();

        if (respuesta === nombreReal) {
            score++;
            clearTimeout(timer);
            alert("✔ Correcto! Puntos: " + score);
            nuevoDigimon();
        } else {
            jugando = false;
            clearTimeout(timer);
            alert(`❌ Incorrecto!\nEra: ${actual.name}\nPuntaje final: ${score}`);
            guardarScore();
            score = 0;
        }
    }

    // ---------------------------
    // GUARDAR SCORE EN FIREBASE
    // ---------------------------
    async function guardarScore() {
        await addDoc(collection(db, "scoresDigimon"), {
            puntos: score,
            fecha: new Date(),
            dificultad: difSelect.value
        });

        cargarScores();
    }

    // ---------------------------
    // CARGAR SCORES ORDENADOS
    // ---------------------------
    async function cargarScores() {
        scoreList.innerHTML = "";

        const q = query(
            collection(db, "scoresDigimon"),
            orderBy("puntos", "desc")
        );

        const snap = await getDocs(q);

        snap.forEach(doc => {
            const data = doc.data();
            const li = document.createElement("li");

            li.textContent = `Puntos: ${data.puntos} | Dificultad: ${data.dificultad}`;
            scoreList.appendChild(li);
        });
    }

    // ---------------------------
    // EVENTOS
    // ---------------------------
    btnEnviar.onclick = validar;
    btnNuevo.onclick = nuevoDigimon;
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") validar();
    });

    // ---------------------------
    // INICIO
    // ---------------------------
    await cargarAPI();
    cargarScores();
    nuevoDigimon();
}
