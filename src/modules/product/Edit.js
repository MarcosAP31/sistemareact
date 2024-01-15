import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import Api from "../../services/api";
function Edit() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const { ProductId } = useParams();
  const [loadedData, setLoadedData] = useState(false);
  const [SupplierId, setSupplierId] = useState('');
  const [product, setProduct] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [File, setFile] = useState(null);
  const [Image, setImage] = useState('');
  const navigate = useNavigate();
  const valueChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }))
    if (name === 'SupplierId') {
      setSupplierId(value);
    }
  }

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedSupplier(selectedValue);
    // Actualiza SupplierId solo si se ha seleccionado algo
    if (selectedValue) {
      setSupplierId(selectedValue);
    }

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
    try {
      const formData = new FormData();
      formData.append('file', File);

      const imageResponse = await fetch(Api + '/saveimg', {
        method: 'POST',
        body: formData,
      });

      if (imageResponse.ok) {
        const responseData = await imageResponse.json();
        setImage(responseData.fileName);
      } else {
        console.error('Error al subir la imagen:', imageResponse.statusText);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };
  // Función para eliminar la imagen
  const deleteImage = (imageName) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Puedes incluir otros encabezados si es necesario, como token de autenticación
      },
    };

    // Busca el registro en la tabla file usando el campo Name
    fetch(Api + '/file/name/' + imageName)
      .then(response => response.json())
      .then(file => {
        const FileId = file.FileId;

        // Ahora puedes eliminar la imagen usando el id de file
        fetch(Api + '/file/' + FileId, requestOptions)
          .then(response => {
            if (response.status === 200) {
              // Imagen eliminada con éxito

            } else {
              // Manejar errores, por ejemplo:
              throw new Error('No se pudo eliminar la imagen');
            }
          })
          .catch(error => {
            console.error('Error al eliminar la imagen:', error);
            // Maneja el error de eliminar la imagen según tus necesidades
          });
      })
      .catch(error => {
        console.error('Error al obtener el registro de la imagen:', error);
        // Maneja el error de obtener el registro de la imagen según tus necesidades
      });
  };
  const sendData = async (e) => {
    e.preventDefault();
    const { ProductId, Description, Category, Amount, PurchasePrice, SalePrice } = product;
    // Primero, obtén el nombre de la imagen del producto que estás a punto de eliminar
    try {
      // Obtén el nombre de la imagen del producto que estás a punto de eliminar
      const productResponse = await fetch(Api + '/product/' + ProductId);
      const productData = await productResponse.json();
      const imageName = productData.Image;
      setImage(imageName);setSupplierId(productData.SupplierId)
      // Verifica si se ha seleccionado una nueva imagen
      if (File) {
        // Elimina la imagen existente solo si se ha seleccionado una nueva
        await deleteImage(imageName);

        // Subir la nueva imagen después de eliminar la anterior
        await handleImageUpload();
        // Establecer la nueva imagen en el estado
        setImage(Image);
      } else {
        // Si no se ha seleccionado una nueva imagen, utiliza la imagen existente
        setImage(imageName);
      }

      // Resto del código para actualizar el registro

      const dataSend = { ProductId, Description, Category, Amount, PurchasePrice, SalePrice, SupplierId:SupplierId||product.SupplierId, Image:Image|| product.Image };

      // Realizar la solicitud PUT o PATCH a la API para actualizar el registro
      const updateResponse = await fetch(Api + '/product/' + ProductId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataSend),
      });

      if (!updateResponse.ok) {
        throw new Error('No se pudo actualizar el registro');
      }

      navigate("/"); // Redirige al componente raíz
      // Aquí puedes realizar cualquier acción adicional, como redirigir al usuario o mostrar un mensaje de éxito.
    } catch (error) {
      console.error('Error en la actualización:', error);
      // Puedes manejar el error de acuerdo a tus necesidades, como mostrar un mensaje de error.
    }
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

  useEffect(() => {
    // Realizar la solicitud GET a la API al montar el componente

    fetch(Api + '/product/' + ProductId)  // Reemplaza con la URL de tu API y el ID del registro
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudo obtener el registro');
        }
        return response.json();
      })
      .then((data) => {
        // Actualizar el estado con el registro obtenido
        setLoadedData(true);
        setProduct(data);
        // Asignar el valor de SupplierId a selectedSupplier
        setSelectedSupplier(data.SupplierId);
        // Actualizar el estado de la imagen
        setSelectedImage('http://localhost:3000/build/uploads/img/' + data.Image);
      })
      .catch((error) => {
        console.error('Error al obtener el registro:', error);
        // Puedes manejar el error de acuerdo a tus necesidades, como mostrar un mensaje de error.
      });
  }, [ProductId]);
  if (!loadedData) { return (<div>Cargando...</div>); }
  else {
    return (
      <div className="card">
        <div className="card-header">Edit products</div>
        <div className="card-body">


          <form onSubmit={sendData}>

            <div className="form-group">
              <label htmlFor="" className="form-label">Clave:</label>
              <input type="text" readOnly
                className="form-control" value={product.ProductId} name="id" id="id" aria-describedby="helpId" placeholder="" />
              <small id="helpId" className="form-text text-muted">Clave</small>
            </div>
            <div className="form-group">
              <label htmlFor="Description" className="form-label">Descripcion:</label>
              <input required type="text" name="Description" onChange={valueChange} value={product.Description} id="Description" className="form-control" placeholder="" aria-describedby="helpId" />
              <small id="helpId" className="text-muted">Descripción</small>
            </div>
            <div className="form-group">
              <label htmlFor="Category" className="form-label">Categoria:</label>
              <input required type="text" name="Category" value={product.Category} onChange={valueChange} id="Category" className="form-control" placeholder="" aria-describedby="helpId" />
              <small id="helpId" className="text-muted">Categoría</small>
            </div>
            <div className="form-group">
              <label htmlFor="Amount" className="form-label">Cantidad:</label>
              <input required type="text" name="Amount" onChange={valueChange} value={product.Amount} id="Amount" className="form-control" placeholder="" aria-describedby="helpId" />
              <small id="helpId" className="text-muted">Cantidad</small>
            </div>
            <div className="form-group">
              <label htmlFor="PurchasePrice" className="form-label">Precio de Compra:</label>
              <input required type="text" name="PurchasePrice" value={product.PurchasePrice} onChange={valueChange} id="PurchasePrice" className="form-control" placeholder="" aria-describedby="helpId" />
              <small id="helpId" className="text-muted">Precio de Compra</small>
            </div>
            <div className="form-group">
              <label htmlFor="SalePrice" className="form-label">Precio de Venta:</label>
              <input required type="text" name="SalePrice" onChange={valueChange} value={product.SalePrice} id="SalePrice" className="form-control" placeholder="" aria-describedby="helpId" />
              <small id="helpId" className="text-muted">Precio de Venta</small>
            </div>
            <div className="form-group">
              <select required value={selectedSupplier} onChange={handleSelectChange}>
                <option value="">Selecciona una opción</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.SupplierId} value={supplier.SupplierId}>
                    {supplier.BusinessName}
                  </option>
                ))}
              </select>
              <p>Seleccionaste: {selectedSupplier && suppliers ? (suppliers.find((supplier) => supplier.SupplierId == selectedSupplier)?.BusinessName || 'Ninguna') : 'Ninguna'}</p>

            </div>
            <div className="form-group">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {selectedImage && (
                <img src={selectedImage} alt="Preview" style={{ maxWidth: '100px' }} onChange={valueChange} value={product.Image} />
              )}

            </div>
            <div className="btn-group" role="group" aria-label="Button group name">
              <button type="submit" className="btn btn-success">Actualizar producto</button>
              <Link to={"/"} className="btn btn-primary">Cancelar</Link>
            </div>
          </form>
        </div>
        <div className="carDescriptionmuted">

        </div>
      </div>
    );
  }
}

export default Edit;
