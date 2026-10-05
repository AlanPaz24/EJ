// Número de WhatsApp de Esteban 
const WHATSAPP_NUMERO = "5491150082797";
const TASA_ANUAL_FIJA = 0.07;

const $ = id => document.getElementById(id);
const inputEdadActual = $('edad-actual');
const inputEdadRetiro = $('edad-retiro');
const inputAhorroInicial = $('ahorro-inicial');
const inputAhorroMensual = $('ahorro-mensual');
const btnWhatsappCalc = $('btn-whatsapp-calc');

const ids = ['monto-final','anios-totales','monto-aportado','monto-ganancia','renta-10','renta-15','renta-20','renta-25'];
const out = Object.fromEntries(ids.map(id => [id, $(id)]));

const usd = n => `$${Math.round(n).toLocaleString('es-AR')} USD`;
const abrirWhatsapp = texto => window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`, '_blank');

// Botón flotante
$('float-whatsapp').href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent("Hola Esteban, estuve navegando en tu sitio web y me gustaría coordinar una reunión para agendar mi asesoría personalizada.")}`;

// Renta constante consumiendo el capital durante X años (tasa conservadora)
function calcularCuotaTemporal(capital, anios, tasaAnual = 0.04) {
  const meses = anios * 12, i = tasaAnual / 12;
  return (capital * i) / (1 - Math.pow(1 + i, -meses));
}

function calcularProyeccion() {
  const edadActual = parseInt(inputEdadActual.value) || 0;
  const edadRetiro = parseInt(inputEdadRetiro.value) || 0;
  const ahorroInicial = parseFloat(inputAhorroInicial.value) || 0;
  const ahorroMensual = parseFloat(inputAhorroMensual.value) || 0;

  if (edadRetiro <= edadActual || (ahorroMensual <= 0 && ahorroInicial <= 0)) {
    ids.forEach(id => out[id].textContent = '-');
    out['monto-final'].textContent = 'Verificar valores';
    btnWhatsappCalc.onclick = null;
    return;
  }

  const anios = edadRetiro - edadActual;
  const meses = anios * 12;
  const i = TASA_ANUAL_FIJA / 12;

  let capital = ahorroInicial * Math.pow(1 + i, meses);
  for (let m = 0; m < meses; m++) capital = (capital + ahorroMensual) * (1 + i);

  const aportado = ahorroInicial + ahorroMensual * meses;
  const r10 = calcularCuotaTemporal(capital, 10);
  const r15 = calcularCuotaTemporal(capital, 15);
  const r20 = calcularCuotaTemporal(capital, 20);
  const r25 = calcularCuotaTemporal(capital, 25);

  out['monto-final'].textContent = usd(capital);
  out['anios-totales'].textContent = `${anios} años`;
  out['monto-aportado'].textContent = usd(aportado);
  out['monto-ganancia'].textContent = usd(capital - aportado);
  out['renta-10'].textContent = `${usd(r10)}/mes`;
  out['renta-15'].textContent = `${usd(r15)}/mes`;
  out['renta-20'].textContent = `${usd(r20)}/mes`;
  out['renta-25'].textContent = `${usd(r25)}/mes`;

  btnWhatsappCalc.onclick = () => {
    let t = `Hola Esteban, estuve en tu sitio web y proyecté mi retiro:\n\n` +
      `• *Edad actual:* ${edadActual} años\n` +
      `• *Edad de retiro:* ${edadRetiro} años (${anios} años de plazo)\n`;
    if (ahorroInicial > 0) t += `• *Ahorro previo inicial:* ${usd(ahorroInicial)}\n`;
    t += `• *Ahorro mensual:* ${usd(ahorroMensual)}/mes\n` +
      `• *Capital proyectado:* ${usd(capital)}\n\n` +
      `*Opciones de Renta:*\n` +
      `- Renta 10 años: ${usd(r10)}/mes\n` +
      `- Renta 20 años: ${usd(r20)}/mes\n\n` +
      `Quisiera coordinar una reunión para analizar mi caso.`;
    abrirWhatsapp(t);
  };
}

[inputEdadActual, inputEdadRetiro, inputAhorroInicial, inputAhorroMensual]
  .forEach(el => el.addEventListener('input', calcularProyeccion));

// Pestañas Personas / Empresas
function switchTab(tabName, event) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  $(`tab-${tabName}`).classList.add('active');
  if (event && event.currentTarget) event.currentTarget.classList.add('active');
}

// Cotizaciones por WhatsApp
function solicitarCotizacion(tipoSeguro) {
  abrirWhatsapp(`Hola Esteban, quisiera solicitar información y cotización para un seguro de *${tipoSeguro}*.`);
}

// Formulario de contacto
$('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const nombre = $('nombre').value;
  const telefono = $('telefono').value;
  const email = $('email').value;
  const disponibilidad = $('disponibilidad').value;

  abrirWhatsapp(
    `Hola Esteban, mi nombre es ${nombre}. Quisiera solicitar una entrevista para armar un plan financiero personalizado.\n\n` +
    `• *Teléfono:* ${telefono}\n` +
    `• *Email:* ${email}\n` +
    `• *Horarios preferidos:* ${disponibilidad}`
  );
});

// Menú hamburguesa
const navToggle = $('nav-toggle');
const navActions = $('nav-actions');
function cerrarMenu() {
  navActions.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}
navToggle.addEventListener('click', () => {
  const abierto = navActions.classList.toggle('open');
  navToggle.classList.toggle('open', abierto);
  navToggle.setAttribute('aria-expanded', abierto);
});
navActions.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 850) cerrarMenu(); });

// Imágenes de respaldo
const heroImg = $('hero-img-fallback');
const aboutImg = $('about-img-fallback');
heroImg.onerror = function () {
  this.parentElement.innerHTML = '<div style="font-size:2.5rem;color:#fff;display:flex;align-items:center;justify-content:center;height:100%;font-weight:700">EJ</div>';
};
aboutImg.onerror = function () {
  this.onerror = null;
  this.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800';
};

calcularProyeccion();