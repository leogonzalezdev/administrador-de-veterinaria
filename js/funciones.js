import Citas from './classes/Citas.js';
import UI from './classes/Ui.js';
import {mascotaInput,  propietarioInput,telefonoInput, fechaInput, horaInput, sintomasInput, formulario, contenedorCitas} from './selectores.js';

const ui = new UI();
const administrarCitas = new Citas();

let editando;

const citaObj = {
  mascota:'',
  propietario:'',
  telefono:'',
  fecha:'',
  hora:'',
  sintomas:''
}

// Agrega la informacion del paciente, a un objeto
export function datosCita(e){
  citaObj[e.target.name] = e.target.value;
}

// Valida y agrega una nueva cita a la clase
export function nuevaCita(e){
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

// Reinicia los objetos
export function reiniciarObjeto(){
  citaObj.mascota = '';
  citaObj.propietario = '';
  citaObj.telefono = '';
  citaObj.fecha = '';
  citaObj.hora = '';
  citaObj.sintomas = '';  
}

//Elimina las citas del HTML
export function eliminarCita(id) {
  // Elimnar Cita
  administrarCitas.eliminarCita(id);

  // Mostrar mensaje
  ui.imprimirAlerta('La cita se eliminó correctamente');

  // Imprimir Citas
  ui.imprimirCitas(administrarCitas);
}





export function cargarEdicion(cita) {

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