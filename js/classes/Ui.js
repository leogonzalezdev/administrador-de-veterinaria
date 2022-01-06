import { eliminarCita, cargarEdicion, DB } from '../funciones.js';
import { contenedorCitas } from '../selectores.js';

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

  imprimirCitas(){
    // Limpia el HTML previo
    this.limpiarHTML();
    const objectStore = DB.transaction('citas').objectStore('citas');
    objectStore.openCursor().onsuccess = function (e) {
      const cursor = e.target.result;
      if(cursor){
        const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cursor.value;
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
        const cita = cursor.value;
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

        // Ve al siguiente elemento
        cursor.continue();
      }
    }
  }
  limpiarHTML(){
    while (contenedorCitas.firstChild) {
      contenedorCitas.firstChild.remove();
    }
  }
}

export default UI;