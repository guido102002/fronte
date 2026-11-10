// La página ya sabe leer el reporte, recibir el formulario y pintar los estados.
const formulario = document.getElementById("formulario-ruta");
const mensaje = document.getElementById("mensaje");
const postal = document.getElementById("postal");
const selectorReporte = document.getElementById("reporte-activo");

function reporteActual() {
  return reportesParque[selectorReporte.value];
}

function buscarRuta(id) {
  return reporteActual()?.rutas.find((ruta) => ruta.id === id);
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.dataset.tipo = tipo;
}

function pintarReporte() {
  postal.hidden = true;
  mostrarMensaje("", "");
  document.getElementById("nombre-reporte").textContent = reporteActual()?.nombre ?? "Reporte pendiente";
  for (const etiqueta of document.querySelectorAll("[data-estado-ruta]")) {
    const ruta = buscarRuta(etiqueta.dataset.estadoRuta);
    etiqueta.textContent = ruta ? (ruta.disponible ? "Disponible" : "Cerrada") : "Reporte pendiente";
    etiqueta.dataset.estado = ruta ? (ruta.disponible ? "abierta" : "cerrada") : "pendiente";
  }
}

function confirmarRuta(evento) {
  evento.preventDefault();
  postal.hidden = true;
  const seleccion = formulario.querySelector('input[name="ruta"]:checked');

  if (!seleccion) {
    mostrarMensaje("Elige una ruta para consultar su estado.", "aviso");
    return;
  }

  const ruta = buscarRuta(seleccion.value);
  if (!ruta) {
    mostrarMensaje("El reporte de esta ruta todavía está pendiente.", "aviso");
    return;
  }

  responderRuta(ruta);
}

if (window.parent !== window) {
  document.body.classList.add("vista-expedicion");
  const opciones = new URLSearchParams(location.search);
  const preferido = opciones.get("reporte");
  if (["A", "B", "C"].includes(preferido)) selectorReporte.value = preferido;
  if (Number(opciones.get("parada")) < 5) {
    selectorReporte.querySelector('option[value="C"]').hidden = true;
  }
}
pintarReporte();
selectorReporte.addEventListener("change", pintarReporte);
formulario.addEventListener("submit", confirmarRuta);
