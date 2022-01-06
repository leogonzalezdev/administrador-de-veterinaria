import Citas from './classes/Citas.js';
import UI from './classes/Ui.js';
import {mascotaInput,  propietarioInput,telefonoInput, fechaInput, horaInput, sintomasInput, formulario, contenedorCitas} from './selectores.js';

const ui = new UI();
const administrarCitas = new Citas();

let editando;
export let DB;

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
    // Pasar el objeto a edicion
    administrarCitas.editarCita({...citaObj});

    // Edita en Index DB
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');

    objectStore.put(citaObj);
    transaction.oncomplete = () => {
      // Cambia el boton submit del formulario
      formulario.querySelector('button[type="submit"]').innerHTML = `
      Crear Cita 
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
      `;

      ui.imprimirAlerta('Se edito correctamente');

      editando = false;
    }
    transaction.onerror = () => {
      console.log('Hubo un error');
    }

  } else {
     // Generar un id
    citaObj.id = Date.now();
    // Crea nueva cita
    administrarCitas.agregarCita({...citaObj});

    // INSERTAR REGISTRO EN INDEX DB
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');
    objectStore.add(citaObj);
    transaction.oncomplete = function () {
      console.log('cita agregada');
      // Imprimir alerta
      ui.imprimirAlerta('Se agregó correctamente');
    }

  }


  // Reiniciar Objeto
  reiniciarObjeto();

  // Reinicia el Formulario
  formulario.reset();

  // Mostrar el HTML
  ui.imprimirCitas();
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
  const transaction = DB.transaction(['citas'], 'readwrite');
  const objectStore = transaction.objectStore('citas');
  objectStore.delete(id);

  transaction.oncomplete = () => {
    // Imprimir Citas
    ui.imprimirCitas();
    // Mostrar mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente.');
  }

  transaction.onerror = () => {
    ui.imprimirAlerta('Hubo un problema al eliminar la cita.', 'error');
  }


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
// Crea la base de datos
export function crearDB(){
  console.log('Creando database');

  // Abre la base de datos
  const crearDB = window.indexedDB.open('citas', 1);

  // Si hubo un error al crearla
  crearDB.onerror = function () {
    console.log('Hubo un error al crear la base de datos.');
  }

  // Si se creo correctamente
  crearDB.onsuccess = function () {
    console.log('La base de datos se creo correctamente.');
    DB = crearDB.result;
    ui.imprimirCitas();
  }

  // Definir el schema
  crearDB.onupgradeneeded = function (e) {
    const db = e.target.result;

    const objectStore = db.createObjectStore('citas', {
      keyPath:'id',
      autoIncrement: true
    });
    // Definir todas las columnas
    objectStore.createIndex('mascota','mascota',{unique:false});
    objectStore.createIndex('propietario','propietario',{unique:false});
    objectStore.createIndex('telefono','telefono',{unique:false});
    objectStore.createIndex('fecha','fecha',{unique:false});
    objectStore.createIndex('hora','hora',{unique:false});
    objectStore.createIndex('sintomas','sintomas',{unique:false});
    objectStore.createIndex('id','id',{unique:true});
  }
  

}