import mostrarRegistro from './componentes/registro.js';
import mostrarLogin from './componentes/login.js';
import mostrarOriginal from './componentes/original.js';
import mostrarHome from './componentes/home.js';
import mostrarLogout from './componentes/logout.js';

import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';
import mostrarJuego from './componentes/juego.js';

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("menu").innerHTML = `
      <nav>
        <button id="menuHome">Home</button>
        <button id="menuOriginal">Original</button>
        <button id="menuLogout">Logout</button>
        <button id="menuJuego">Juego</button>
      </nav>
    `;

    document.getElementById("menuHome").addEventListener("click", mostrarHome);
    document.getElementById("menuOriginal").addEventListener("click", mostrarOriginal);
    document.getElementById("menuLogout").addEventListener("click", mostrarLogout);
    document.getElementById("menuJuego").addEventListener("click", mostrarJuego);

    mostrarHome()
  } else{
    document.getElementById("menu").innerHTML = `
    
      <nav>
        <button id="menuLogin">Login</button>
        <button id="menuRegistro">Registro</button>
      </nav>
    `;

    document.getElementById("menuLogin").addEventListener("click", mostrarLogin);
    document.getElementById("menuRegistro").addEventListener("click", mostrarRegistro);

    mostrarLogin();
  }
})