import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from "../servicios/api";
function Crear() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [errores, setErrores] = useState([]);
  const navigate = useNavigate();

  const cambioValor = (e) => {
    const { name, value } = e.target;
    if (name === 'nombre') {
      setNombre(value);
    } else if (name === 'correo') {
      setCorreo(value);
    }
    setErrores([]);
  }
  const verificarError=(elemento)=>{
    return errores.indexOf(elemento)!==-1;
  }

  const enviarDatos = (e) => {
    e.preventDefault();
    console.log("Formulario enviado...");
    console.log(nombre);
    console.log(correo);
    var errores=[];
    if(!nombre)errores.push("error_nombre");
    if(!correo)errores.push("error_correo");
    setErrores(errores);
    if(errores.length>0)return false;
    const datosEnviar = { nombre, correo };
    
    fetch(Api+"?insertar=1", {
      method: "POST",
      body: JSON.stringify(datosEnviar)
    })
      .then(respuesta => respuesta.json())
      .then((datosRespuesta) => {
        console.log(datosRespuesta);
        navigate("/"); // Redirige al componente raíz
      })
      .catch(console.log);
  }

  return (
    <div className="card">
      <div className="card-header">
        Empleados
      </div>
      <div className="card-body">
        <form onSubmit={enviarDatos}>
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre:</label>
            <input type="text" name="nombre" onChange={cambioValor} value={nombre} id="nombre" className={((verificarError("error_nombre"))?"is-invalid":"")+" form-control"} placeholder="" aria-describedby="helpId" />
            <small id="helpId" className="invalid-feedback">Escribe el nombre del empleado</small>
          </div>

          <div className="form-group">
            <label htmlFor="correo" className="form-label">Correo:</label>
            <input type="text" name="correo" value={correo} onChange={cambioValor} id="correo" className={((verificarError("error_correo"))?"is-invalid":"")+" form-control"} placeholder="" aria-describedby="helpId" />
            <small id="helpId" className="invalid-feedback ">Escribe el correo del empleado</small>
          </div>

          <div className="btn-group" role="group" aria-label="Button group name">
            <button type="submit" className="btn btn-success">Agregar nuevo empleado</button>
            <Link to={"/"} className="btn btn-primary">Cancelar</Link>
          </div>
        </form>
      </div>
      <div className="card-footer text-muted">
        
      </div>
    </div>
  );
}

export default Crear;
