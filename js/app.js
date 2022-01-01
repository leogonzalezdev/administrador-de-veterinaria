// Campos del formulario
const mascotaInput = document.querySelector('#mascota'),
      propietarioInput = document.querySelector('#propietario'),
      telefonoInput = document.querySelector('#telefono'),
      fechaInput = document.querySelector('#fecha'),
      horaInput = document.querySelector('#hora'),
      sintomasInput = document.querySelector('#sintomas');

// UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;
// Clases
class Citas {
  constructor(){
    this.citas = [];
  }
  agregarCita(cita){
    this.citas = [...this.citas, cita];
  }
  eliminarCita(id){
    this.citas = this.citas.filter(cita => cita.id !== id);
  }
  editarCita(citaActualizada){
    this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
  }
}

class UI{
  imprimirAlerta(mensaje, tipo){
    // Crea la alerta en un div y agrega sus clases de css
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
    
    // Valida de que tipo es la alerta y asigna la clase segun corresponda
    if (tipo === 'error') {
      divMensaje.classList.add('alert-danger');
    }else{
      divMensaje.classList.add('alert-success')
    }
    
    // Insertamos el mensaje 
    divMensaje.textContent = mensaje;
    
    // Agregar al DOM
    document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));
    
    // Quita la alerta del DOM
    setTimeout(() => {
      divMensaje.remove();
    }, 2000);
  }

  imprimirCitas({citas}){
    // Limpia el HTML previo
    this.limpiarHTML();

    citas.forEach(cita => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
      const divCita = document.createElement('div');
      divCita.classList.add('cita','p-3');
      divCita.dataset.id = id;
      // Scripting
      // Mascota Parrafo
      const mascotaParrafo = document.createElement('h2');
      mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
      mascotaParrafo.textContent = mascota;

      // Propietario Parrafo
      const propietarioParrafo = document.createElement('p');
      propietarioParrafo.innerHTML = `
        <span class="font-weight-bolder">Propietario: </span>${propietario}
      `;

      // Telefono Parrafo
      const telefonoParrafo = document.createElement('p');
      telefonoParrafo.innerHTML = `
        <span class="font-weight-bolder">Telefono: </span>${telefono}
      `;

      // Fecha Parrafo
      const fechaParrafo = document.createElement('p');
      fechaParrafo.innerHTML = `
        <span class="font-weight-bolder">Fecha: </span>${fecha}
      `;

      // Hora Parrafo
      const horaParrafo = document.createElement('p');
      horaParrafo.innerHTML = `
        <span class="font-weight-bolder">Hora: </span>${hora}
      `;

      // Sintomas Parrafo
      const sintomasParrafo = document.createElement('p');
      sintomasParrafo.innerHTML = `
        <span class="font-weight-bolder">Sintomas: </span>${sintomas}
      `;
      // Boton para eliminar cita
      const btnEliminar = document.createElement('button');
      btnEliminar.classList.add('btn', 'btn-danger', 'mx-2');
      btnEliminar.innerHTML = `
        Eliminar 
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      `;
      btnEliminar.onclick = () => eliminarCita(id);

      // Boton para editar cita
      const btnEditar = document.createElement('button');
      btnEditar.classList.add('btn', 'btn-info', 'mx-2');
      btnEditar.innerHTML = `
        Editar 
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      `;
      btnEditar.onclick = () => cargarEdicion(cita);

      // Agregar los parrafos a divCita
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);
      divCita.appendChild(btnEditar);

      // Agregar las citas al HTML
      contenedorCitas.appendChild(divCita);
    });
  }
  limpiarHTML(){
    while (contenedorCitas.firstChild) {
      contenedorCitas.firstChild.remove();
    }
  }
}

const ui = new UI();
const administrarCitas = new Citas();

// Escuchar eventos
eventListener();

function eventListener(){
  mascotaInput.addEventListener('input', datosCita);
  propietarioInput.addEventListener('input', datosCita);
  telefonoInput.addEventListener('input', datosCita);
  fechaInput.addEventListener('input', datosCita);
  horaInput.addEventListener('input', datosCita);
  sintomasInput.addEventListener('input', datosCita);
  mascotaInput.addEventListener('input', datosCita);
  formulario.addEventListener('submit', nuevaCita);
}

const citaObj = {
  mascota:'',
  propietario:'',
  telefono:'',
  fecha:'',
  hora:'',
  sintomas:''
}

// Agrega la informacion del paciente, a un objeto
function datosCita(e){
  citaObj[e.target.name] = e.target.value;
}

// Valida y agrega una nueva cita a la clase
function nuevaCita(e){
  e.preventDefault();
  // Extraer con destructuring
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

  // Validacion
  if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
    ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
    return;
  }
  if (editando) {
    ui.imprimirAlerta('Se edito correctamente');
    // Pasar el objeto a edicion
    administrarCitas.editarCita({...citaObj});
    formulario.querySelector('button[type="submit"]').innerHTML = `
      Crear Cita 
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    `;
    editando = false;
  } else {
     // Generar un id
    citaObj.id = Date.now();
    // Crea nueva cita
    administrarCitas.agregarCita({...citaObj});
    // Imprimir alerta
    ui.imprimirAlerta('Se agregó correctamente');
  }


  // Reiniciar Objeto
  reiniciarObjeto();

  // Reinicia el Formulario
  formulario.reset();

  // Mostrar el HTML
  ui.imprimirCitas(administrarCitas);
}

function reiniciarObjeto(){
  citaObj.mascota = '';
  citaObj.propietario = '';
  citaObj.telefono = '';
  citaObj.fecha = '';
  citaObj.hora = '';
  citaObj.sintomas = '';  
}

function eliminarCita(id) {
  // Elimnar Cita
  administrarCitas.eliminarCita(id);

  // Mostrar mensaje
  ui.imprimirAlerta('La cita se eliminó correctamente');

  // Imprimir Citas
  ui.imprimirCitas(administrarCitas);
}
function cargarEdicion(cita) {

  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

  // Llenar los inputs
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  // Llenar el objeto
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;
  // Cambiar button
  formulario.querySelector('button[type="submit"]').innerHTML = `Guardar Cambios <i class='bx bx-save'></i>`;

  editando = true;
}