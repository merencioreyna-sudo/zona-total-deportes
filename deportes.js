// ========== DEPORTES - CON GOOGLE SHEETS (ESPAÑOL) ==========

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJpv1h9XBYo7gJPLBx4U_1IiRkf0v-y2W2Z_o-O3V67aPSqAzvBdAomO7SPy-dVSYw3cyUwD3C0oVJ/pub?gid=831267840&single=true&output=csv&t=" + new Date().getTime();

const cardsGrid = document.getElementById('cardsGrid');
const fussballGrid = document.getElementById('fussballGrid');
const basketballGrid = document.getElementById('basketballGrid');
const playerOverlay = document.getElementById('playerOverlay');
const videoFrame = document.getElementById('videoFrame');
const closePlayerBtn = document.getElementById('closePlayerBtn');
const heroPlayBtn = document.getElementById('heroPlayBtn');

// Variables globales para los datos
let liveItems = [];
let futbolItems = [];
let baloncestoItems = [];
let tenisItems = [];
let boxeoItems = [];
let motorItems = [];
let extremeItems = [];
let beisbolItems = [];

let ultimaCategoria = null;
let ultimoTitulo = null;
let ultimosItems = null;

// Reproductor
closePlayerBtn.addEventListener('click', () => {
  playerOverlay.style.display = 'none';
  videoFrame.src = '';
});

function abrirVideo(url) {
  videoFrame.src = url;
  playerOverlay.style.display = 'flex';
}

// Hero play
heroPlayBtn.addEventListener('click', () => {
  const heroVideo = "https://www.youtube.com/embed/7NPsqFA14eQ";
  abrirVideo(heroVideo);
});

// Botón Inicio
document.getElementById('btnHome').addEventListener('click', () => {
  window.location.href = 'https://merencioreyna-sudo.github.io/zona-total-peliculas/';
});

// Cargar datos desde Google Sheets
function renderizarCard(item) {
  let badgeTexto = '';
  let badgeColor = '';

  // Si es de la sección "live" (EN VIVO Y DESTACADOS)
  if (item.categoria === 'live') {
    if (item.etiqueta === 'live') {
      badgeTexto = '🔴 EN VIVO';
      badgeColor = '#dc2626';
    } else if (item.etiqueta.toLowerCase() === 'destacado') {
      badgeTexto = '🔥 DESTACADO';
      badgeColor = '#f59e0b';
    }
  } else {
    // Para otras categorías (fútbol, baloncesto, etc.) usamos el tipo
    badgeTexto = item.tipo === 'video' ? '🎬 VIDEO' : '📰 NOTICIA';
    badgeColor = item.tipo === 'video' ? '#dc2626' : '#3b82f6';
  }

  return `
    <div class="sport-card">
      <div style="position: relative;">
        <img class="card-img" src="${item.imagen}" alt="${item.titulo}" onerror="this.src='https://placehold.co/600x400/1e293b/3b82f6?text=Deporte'">
        <span style="position: absolute; top: 8px; right: 8px; background: ${badgeColor}; color: white; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 20px; z-index: 5;">${badgeTexto}</span>
      </div>
      <div class="card-content">
        <div class="card-title">${item.titulo}</div><div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">

  <div style="
    font-size:11px;
    color:#dc2626;
    font-weight:600;
  ">
    ${item.fecha || ''}
  </div>

  <button class="card-btn" onclick="abrirModalTarjeta('${item.titulo}', '${item.imagen}', '${item.url}', '${item.fecha}', '${item.tipo}')">
    Ver ahora ▶
  </button>

</div>
      </div>
    </div>
  `;
}

fetch(SHEET_URL)
  .then(res => res.text())
  .then(csv => {
    const lineas = csv.match(/(?:[^\n"]+|"[^"]*")+/g).slice(1);
    liveItems = [];
    futbolItems = [];
    baloncestoItems = [];
    tenisItems = [];
    boxeoItems = [];
    motorItems = [];
    extremeItems = [];

    for (let i = lineas.length - 1; i >= 0; i--) {
      const linea = lineas[i].trim();
      if (linea === "") continue;

      const partes = linea.split(',');
      if (partes.length < 7) continue;

      const tipo = partes[0]?.trim() || "";
      const titulo = partes[1]?.trim() || "Sin título";
      const url = partes[2]?.trim() || "";
      const imagen = partes[3]?.trim() || "https://placehold.co/600x400/1e293b/3b82f6?text=Deporte";
      const fecha = partes[4]?.trim() || "";
            const categoria = partes[5]?.trim()?.toLowerCase() || "";
      const etiqueta = partes[6]?.trim() || "";
      const descripcion = partes.slice(7).join(',').replace(/^"|"$/g, '').trim() || "Sin descripción disponible.";

      if (!url) continue;

      const item = { 
  tipo, 
  titulo, 
  url, 
  imagen, 
  fecha, 
  categoria, 
  etiqueta,
  descripcion
};

      // Debug: ver qué items llegan
      console.log('Item leído:', item.titulo, 'categoria:', item.categoria, 'etiqueta:', item.etiqueta);

      if (categoria === 'live') liveItems.push(item);
      else if (categoria === 'fútbol') futbolItems.push(item);
      else if (categoria === 'baloncesto') baloncestoItems.push(item);
      else if (categoria === 'tenis') tenisItems.push(item);
      else if (categoria === 'boxeo') boxeoItems.push(item);
      else if (categoria === 'motor') motorItems.push(item);
      else if (categoria === 'extreme') extremeItems.push(item);
      else if (categoria === 'beisbol') beisbolItems.push(item);

console.log("Boxeo items:", boxeoItems);
    }

    // Renderizar secciones
    cardsGrid.innerHTML = liveItems.length ? liveItems.map(renderizarCard).join('') : '<p style="color:white; text-align:center;">No hay contenido en vivo</p>';
    fussballGrid.innerHTML = futbolItems.length ? futbolItems.slice(0,6).map(renderizarCard).join('') : '<p style="color:white; text-align:center;">No hay contenido de fútbol</p>';
    basketballGrid.innerHTML = baloncestoItems.length ? baloncestoItems.slice(0,6).map(renderizarCard).join('') : '<p style="color:white; text-align:center;">No hay contenido de baloncesto</p>';
    
    // Nuevas secciones
    const tenisGrid = document.getElementById('tenisGrid');
    const boxeoGrid = document.getElementById('boxeoGrid');
    const motorGrid = document.getElementById('motorGrid');
    const extremeGrid = document.getElementById('extremeGrid');
    
    if (tenisGrid) tenisGrid.innerHTML = tenisItems.length ? tenisItems.slice(0,6).map(renderizarCard).join('') : '<p style="color:white; text-align:center;">No hay contenido de tenis</p>';
    if (boxeoGrid) boxeoGrid.innerHTML = boxeoItems.length ? boxeoItems.slice(0,6).map(renderizarCard).join('') : '<p style="color:white; text-align:center;">No hay contenido de boxeo</p>';
    if (motorGrid) motorGrid.innerHTML = motorItems.length ? motorItems.slice(0,6).map(renderizarCard).join('') : '<p style="color:white; text-align:center;">No hay contenido de motor</p>';
   if (extremeGrid) extremeGrid.innerHTML = extremeItems.length ? extremeItems.slice(0,6).map(renderizarCard).join('') : '<p style="color:white; text-align:center;">No hay contenido extreme</p>';

    const beisbolGrid = document.getElementById('beisbolGrid');if (beisbolGrid) beisbolGrid.innerHTML = beisbolItems.length ? beisbolItems.slice(0,6).map(renderizarCard).join('') : '<p style="color:white; text-align:center;">No hay contenido de béisbol</p>';
  })

  .catch(err => {
    console.error('Error cargando datos:', err);
    cardsGrid.innerHTML = '<p style="color:white; text-align:center;">Error al cargar contenido</p>';
    fussballGrid.innerHTML = '<p style="color:white; text-align:center;">Error al cargar contenido</p>';
    basketballGrid.innerHTML = '<p style="color:white; text-align:center;">Error al cargar contenido</p>';
  });


// ========== FILTRAR POR CATEGORÍA EN EL MENÚ ==========
const navBtns = document.querySelectorAll('.nav-btn');

function mostrarCategoria(categoria) {
  console.log('Categoría seleccionada:', categoria); // Debug
  const todasLasSecciones = document.querySelectorAll('.container');
  
  todasLasSecciones.forEach(seccion => {
    seccion.style.display = 'none';
  });

  if (categoria === 'todos') {
    todasLasSecciones.forEach(seccion => {
      seccion.style.display = 'block';
    });
  } else if (categoria === 'futbol' || categoria === 'fútbol') {
    if (todasLasSecciones[1]) todasLasSecciones[1].style.display = 'block';
  } else if (categoria === 'beisbol' || categoria === 'béisbol') {
    if (todasLasSecciones[2]) todasLasSecciones[2].style.display = 'block';
  } else if (categoria === 'baloncesto') {
    if (todasLasSecciones[3]) todasLasSecciones[3].style.display = 'block';
  } else if (categoria === 'tenis') {
    if (todasLasSecciones[4]) todasLasSecciones[4].style.display = 'block';
  } else if (categoria === 'boxeo') {
    if (todasLasSecciones[5]) todasLasSecciones[5].style.display = 'block';
  } else if (categoria === 'motor') {
    if (todasLasSecciones[6]) todasLasSecciones[6].style.display = 'block';
  } else if (categoria === 'extreme') {
    if (todasLasSecciones[7]) todasLasSecciones[7].style.display = 'block';
  }
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    let categoria = btn.textContent.trim().toLowerCase();
    categoria = categoria.replace(/[^a-záéíóúñ]/g, '');
    console.log('Categoría desde botón:', categoria); // 👈 Agrega esta línea
    mostrarCategoria(categoria);
  });
});


// ========== MODAL PÁGINA COMPLETA ==========
function abrirModal(categoria, titulo, items) {
  modalTitle.textContent = titulo;

  if (items.length) {
    modalCardsGrid.innerHTML = items.map(item => {
      let badgeTexto = '';
      let badgeColor = '';

      // Si es de la sección "live" (EN VIVO Y DESTACADOS)
      if (item.categoria === 'live') {
        if (item.etiqueta === 'live') {
          badgeTexto = '🔴 EN VIVO';
          badgeColor = '#dc2626';
        } else if (item.etiqueta && item.etiqueta.toLowerCase() === 'destacado') {
          badgeTexto = '🔥 DESTACADO';
          badgeColor = '#f59e0b';
        }
      } else {
        // Para otras categorías usamos el tipo
        badgeTexto = item.tipo === 'video' ? '🎬 VIDEO' : '📰 NOTICIA';
        badgeColor = item.tipo === 'video' ? '#dc2626' : '#3b82f6';
      }

      return `
        <div class="sport-card">
          <div style="position: relative;">
            <img class="card-img" src="${item.imagen}" alt="${item.titulo}" onerror="this.src='https://placehold.co/600x400/1e293b/3b82f6?text=Deporte'">
            <span style="position: absolute; top: 8px; right: 8px; background: ${badgeColor}; color: white; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 20px; z-index: 5;">${badgeTexto}</span>
          </div>
          <div class="card-content">
            <div class="card-title">${item.titulo}</div>
            <button class="card-btn" onclick="abrirModalTarjeta('${item.titulo}', '${item.imagen}', '${item.url}', '${item.fecha}', '${item.tipo}')">Ver ahora ▶</button>
          </div>
        </div>
      `;
    }).join('');
  } else {
    modalCardsGrid.innerHTML = '<p style="color:white; text-align:center;">No hay contenido disponible</p>';
  }

  modalCardsGrid.style.display = 'grid';
  modalCardsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
  modalCardsGrid.style.gap = '20px';
  modalCardsGrid.style.padding = '20px';
  modalCardsGrid.style.height = 'auto';

  ultimaCategoria = categoria;
  ultimoTitulo = titulo;
  ultimosItems = items;

  fullscreenModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// ========== CONECTAR BOTONES "VER MÁS" CON EL MODAL ==========
const btnVerTodos = document.querySelectorAll('.view-all');

btnVerTodos.forEach((btn, index) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (index === 0) abrirModal('live', '📺 EN VIVO Y DESTACADOS - Todos', liveItems);
    else if (index === 1) abrirModal('futbol', '⚽ FÚTBOL - Todos los contenidos', futbolItems);
    else if (index === 2) abrirModal('beisbol', '⚾ BÉISBOL - Todos los contenidos', beisbolItems);
    else if (index === 3) abrirModal('baloncesto', '🏀 BALONCESTO - Todos los contenidos', baloncestoItems);
    else if (index === 4) abrirModal('tenis', '🎾 TENIS - Todos los contenidos', tenisItems);
    else if (index === 5) abrirModal('boxeo', '🥊 BOXEO - Todos los contenidos', boxeoItems);
    else if (index === 6) abrirModal('motor', '🏎️ MOTOR - Todos los contenidos', motorItems);
    else if (index === 7) abrirModal('extreme', '🔥 EXTREME - Todos los contenidos', extremeItems);
  });
});

// ========== ABRIR MODAL CON INFORMACIÓN COMPLETA DE LA TARJETA ==========
function abrirModalTarjeta(titulo, imagen, url, fecha, tipo, categoriaItems, categoriaTitulo) {
  modalTitle.textContent = titulo;

  if (tipo === 'video') {
    let videoUrl = url;
    if (url.includes("youtube.com/watch?v=")) {
      videoUrl = url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("/").pop().split("?")[0];
      videoUrl = `https://www.youtube.com/embed/${id}`;
    }

    modalCardsGrid.innerHTML = `
      <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background-color: #000; position: relative;">
        <div style="flex: 1; position: relative; min-height: 0;">
          <iframe src="${videoUrl}" 
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" 
                  allow="autoplay; fullscreen" 
                  allowfullscreen>
          </iframe>
        </div>
        
      </div>
    `;
  } 
 else if (tipo === 'noticia') {

  const noticia = [...liveItems, ...futbolItems, ...baloncestoItems, ...tenisItems, ...boxeoItems, ...motorItems, ...extremeItems, ...beisbolItems]
    .find(n => n.titulo === titulo);

  modalCardsGrid.innerHTML = `
  
    <div style="
      width: 100%;
      background: #ffffff;
      color: #111827;
      border-radius: 20px;
      overflow-y: auto;
      padding: 24px;
    ">

      <img 
        src="${imagen}" 
        style="
          width: 100%;
          max-height: 400px;
          object-fit: cover;
          border-radius: 16px;
          margin-bottom: 20px;
        "
      >

      <h2 style="
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 12px;
        color: #dc2626;
      ">
        ${titulo}
      </h2>

      <p style="
        color: #64748b;
        margin-bottom: 20px;
        font-size: 14px;
      ">
        ${fecha}
      </p>

      <p style="
  font-size: 17px;
  line-height: 1.8;
  color: #1e293b;
">
  ${(noticia?.descripcion || 'Sin descripción disponible.')
    .replace(/\r?\n/g, '<br><br>')}
</p>

    </div>
    
  `;
}

  modalCardsGrid.style.display = "flex";
  modalCardsGrid.style.flexDirection = "column";
  modalCardsGrid.style.height = "calc(100vh - 80px)";
  modalCardsGrid.style.padding = "0";
  modalCardsGrid.style.margin = "0";

  fullscreenModal.style.display = "block";
  document.body.style.overflow = "hidden";
}

// Función para regresar al modal de categoría
function regresarACategoria(titulo, items) {
  abrirModal('categoria', titulo, items);
}

// ========== ASEGURAR QUE EL BOTÓN CERRAR SIEMPRE FUNCIONE ==========
function cerrarModal() {

  // Detectar si estamos dentro de una noticia
  const viendoContenido =
  modalCardsGrid.innerHTML.includes('<iframe') ||
  modalCardsGrid.innerHTML.includes('line-height: 1.8');

  // Si estamos viendo noticia → volver al catálogo
  if (viendoContenido && ultimosItems && ultimosItems.length > 0) {

    abrirModal(
      ultimaCategoria,
      ultimoTitulo,
      ultimosItems
    );

    return;
  }

  // Si estamos en el catálogo → cerrar completamente
  fullscreenModal.style.display = 'none';
  document.body.style.overflow = '';

  // Limpiar datos
  ultimaCategoria = null;
  ultimoTitulo = null;
  ultimosItems = null;
}


// Eliminar eventos antiguos para evitar duplicados
const oldCloseBtn = document.getElementById('closeModalBtn');
if (oldCloseBtn) {
  const newCloseBtn = oldCloseBtn.cloneNode(true);
  oldCloseBtn.parentNode.replaceChild(newCloseBtn, oldCloseBtn);
  newCloseBtn.addEventListener('click', cerrarModal);
} else {
  const closeBtn = document.getElementById('closeModalBtn');
  if (closeBtn) closeBtn.addEventListener('click', cerrarModal);
}

// Cerrar al hacer clic fuera del contenido
fullscreenModal.addEventListener('click', function(e) {
  if (e.target === fullscreenModal) {
    cerrarModal();
  }
});
