import {crearDB, datosCita, nuevaCita } from '../funciones.js';
import {
  mascotaInput, 
  propietarioInput,
  telefonoInput, 
  fechaInput, 
  horaInput, 
  sintomasInput, 
  formulario, 
  contenedorCitas
} from '../selectores.js';

export default class App{
  constructor(){
    this.initApp();
  } 
  initApp(){
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);
    mascotaInput.addEventListener('input', datosCita);
    formulario.addEventListener('submit', nuevaCita);
    crearDB();
  }
}