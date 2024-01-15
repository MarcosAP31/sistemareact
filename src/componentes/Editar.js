import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link,useNavigate } from 'react-router-dom';
import Api from "../servicios/api";
function Editar() {
  const { id } = useParams();
  const [datosCargados, setDatosCargados] = useState(false);
  const [empleado, setEmpleado] = useState({});
  const navigate = useNavigate();
  const cambioValor = (e) => {
    const { name, value } = e.target;
    setEmpleado((prevEmpleado) => ({
      ...prevEmpleado,
      [name]: value,
    }))
  }
  const enviarDatos = (e) => {
    e.preventDefault();
    console.log("Formulario enviado...");
    const{id,nombre,correo}=empleado;
    console.log(id);
    console.log(nombre);
    console.log(correo);
    const datosEnviar = {id, nombre, correo };
    fetch(Api+"?actualizar=1", {
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
  useEffect(() => {
    fetch(Api+"?consultar=" + id)
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        console.log("=>" + datosRespuesta);
        setDatosCargados(true);
        setEmpleado(datosRespuesta[0]);
      })
      .catch(console.log);
  }, [id]);
  if (!datosCargados) { return (<div>Cargando...</div>); }
  else {
    return (
      <div className="card">
        <div className="card-header">Editar empleados</div>
        <div className="card-body">


          <form onSubmit={enviarDatos}>
            
            <div className="form-group">
              <label htmlFor="" className="form-label">Clave:</label>
              <input type="text" readOnly
                className="form-control" value={empleado.id} name="id" id="id" aria-describedby="helpId" placeholder=""/>
                <small id="helpId" className="form-text text-muted">Clave</small>
            </div>
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">Nombre:</label>
              <input required type="text" name="nombre" onChange={cambioValor} value={empleado.nombre} id="nombre" className="form-control" placeholder="" aria-describedby="helpId" />
              <small id="helpId" className="text-muted">Escribe el nombre del empleado</small>
            </div>

            <div className="form-group">
              <label htmlFor="correo" className="form-label">Correo:</label>
              <input required type="text" name="correo" onChange={cambioValor} value={empleado.correo} id="correo" className="form-control" placeholder="" aria-describedby="helpId" />
              <small id="helpId" className="text-muted">Escribe el correo del empleado</small>
            </div>

            <div className="btn-group" role="group" aria-label="Button group name">
              <button type="submit" className="btn btn-success">Actualizar empleado</button>
              <Link to={"/"} className="btn btn-primary">Cancelar</Link>
            </div>
          </form>
        </div>
        <div className="card-footer text-muted">

        </div>
      </div>
    );
  }
}

export default Editar;
