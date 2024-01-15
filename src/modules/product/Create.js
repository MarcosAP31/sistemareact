import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from "../../services/api";
function Create() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [Description, setDescription] = useState('');
  const [Category, setCategory] = useState('');
  const [Amount, setAmount] = useState('');
  const [PurchasePrice, setPurchasePrice] = useState('');
  const [SalePrice, setSalePrice] = useState('');
  const [SupplierId, setSupplierId] = useState('');
  const [Image, setImage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [File, setFile] = useState(null);
  const [mistakes, setMistakes] = useState([]);
  const navigate = useNavigate();
  const valueChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Description') {
      setDescription(value);
    } else if (name === 'Category') {
      setCategory(value);
    } else if (name === 'Amount') {
      setAmount(value);
    } else if (name === 'PurchasePrice') {
      setPurchasePrice(value);
    } else if (name === 'SalePrice') {
      setSalePrice(value);
    } else if (name === 'SupplierId') {
      setSupplierId(value);
    } 
    setMistakes([]);
  }
  const checkError = (element) => {
    return mistakes.indexOf(element) !== -1;
  }
  useEffect(() => {
    // Realiza una solicitud a tu API para obtener los datos.
    fetch(Api + '/supplier') // Reemplaza con la URL de tu API
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudieron obtener los datos');
        }
        return response.json();
      })
      .then((data) => {
        // Almacena los datos en el estado.
        setSuppliers(data);
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
        // Puedes manejar el error de acuerdo a tus necesidades, como mostrar un mensaje de error.
      });
  }, []); // El segundo argumento vacío asegura que esta solicitud se realice solo una vez al montar el componente.

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedSupplier(selectedValue);
    // Si deseas asignar el valor de selectedSupplier a SupplierId, puedes hacerlo aquí
    setSupplierId(selectedValue);
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setFile(file);
        setSelectedImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
    console.log(file.name)
    setImage(file.name);
  };

  const handleImageUpload = async () => {
    // Aquí debes implementar la lógica para subir la imagen a tu API
  };
  const sendData = async (e) => {
    e.preventDefault();
    console.log("Formulario enviado...");
    console.log(Description);
    console.log(Category);
    var mistakes = [];
    if (!Description) mistakes.push("error_Description");
    if (!Category) mistakes.push("error_Category");
    if (!Amount) mistakes.push("error_Amount");
    if (!PurchasePrice) mistakes.push("error_PurchasePrice");
    if (!SalePrice) mistakes.push("error_SalePrice");
    if (!SupplierId) mistakes.push("error_SupplierId");
    setMistakes(mistakes);
    if (mistakes.length > 0) return false;
    const dataSend = { Description, Category, Amount, PurchasePrice, SalePrice, SupplierId, Image };
    try {
      // Realizar la solicitud POST a la API para insertar un nuevo registro
      const productResponse = await fetch(Api + '/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Puedes incluir otros encabezados si es necesario, como token de autenticación
        },
        body: JSON.stringify(dataSend),
      });

      if (!productResponse.ok) {
        throw new Error('No se pudo insertar el registro');
      }
      

      const formData = new FormData();
      formData.append('file', File);

      const imageResponse = await fetch(Api+'/saveimg', {
        method: 'POST',
        body: formData,
      });

      if (imageResponse.ok) {
        // La imagen se ha subido correctamente
        // Puedes manejar la respuesta del servidor aquí si es necesario
      } else {
        // Manejar errores de la solicitud
      }
      navigate("/"); // Redirige al componente raíz
      // Aquí puedes realizar cualquier acción adicional, como actualizar la lista de registros.
      // Si deseas refrescar la lista de registros después de la inserción, puedes hacer otra solicitud GET.
    } catch (error) {
      console.error('Error al insertar el registro o subir la imagen:', error);
      // Puedes manejar el error de acuerdo a tus necesidades (por ejemplo, mostrar un mensaje de error).
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        Productos
      </div>
      <div className="card-body">
        <form onSubmit={sendData}>
          <div className="form-group">
            <label htmlFor="Description" className="form-label">Descripción:</label>
            <input type="text" name="Description" onChange={valueChange} value={Description} id="Description" className={((checkError("error_Description")) ? "is-invalid" : "") + " form-control"} placeholder="" aria-describedby="helpId" />
            <small id="helpId" className="invalid-feedback">Descripción</small>
          </div>
          <div className="form-group">
            <label htmlFor="Category" className="form-label">Categoria:</label>
            <input type="text" name="Category" value={Category} onChange={valueChange} id="Category" className={((checkError("error_Category")) ? "is-invalid" : "") + " form-control"} placeholder="" aria-describedby="helpId" />
            <small id="helpId" className="invalid-feedback ">Categoría</small>
          </div>
          <div className="form-group">
            <label htmlFor="Amount" className="form-label">Cantidad:</label>
            <input type="text" name="Amount" onChange={valueChange} value={Amount} id="Amount" className={((checkError("error_Amount")) ? "is-invalid" : "") + " form-control"} placeholder="" aria-describedby="helpId" />
            <small id="helpId" className="invalid-feedback">Cantidad</small>
          </div>
          <div className="form-group">
            <label htmlFor="PurchasePrice" className="form-label">Precio de Compra:</label>
            <input type="text" name="PurchasePrice" value={PurchasePrice} onChange={valueChange} id="PurchasePrice" className={((checkError("error_PurchasePrice")) ? "is-invalid" : "") + " form-control"} placeholder="" aria-describedby="helpId" />
            <small id="helpId" className="invalid-feedback ">Precio de Compra</small>
          </div>
          <div className="form-group">
            <label htmlFor="SalePrice" className="form-label">Precio de Venta:</label>
            <input type="text" name="SalePrice" onChange={valueChange} value={SalePrice} id="SalePrice" className={((checkError("error_SalePrice")) ? "is-invalid" : "") + " form-control"} placeholder="" aria-describedby="helpId" />
            <small id="helpId" className="invalid-feedback">Precio de Venta</small>
          </div>
          <div className="form-group">
            <select value={selectedSupplier} onChange={handleSelectChange}>
              <option value="">Selecciona una opción</option>
              {suppliers.map((supplier) => (
                <option key={supplier.SupplierId} onChange={valueChange} value={supplier.SupplierId}>
                  {supplier.BusinessName}
                </option>
              ))}
            </select>
            <p>Seleccionaste: {selectedSupplier ? suppliers.find((supplier) => supplier.SupplierId == selectedSupplier).BusinessName : 'Ninguna'}</p>
          </div>
          <div className="form-group">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {selectedImage && (
              <img src={selectedImage} alt="Preview" style={{ maxWidth: '100px' }} />
            )}
          </div>
          <div className="btn-group" role="group" aria-label="Button group name">
            <button type="submit" className="btn btn-success">Agregar nuevo producto</button>
            <Link to={"/"} className="btn btn-primary">Cancelar</Link>
          </div>
        </form>
      </div>
      <div className="card-footer text-muted">

      </div>
    </div>
  );
}

export default Create;
