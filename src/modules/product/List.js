import React from 'react';
import { Link } from "react-router-dom";
import Api from "../../services/api";
class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadedData: false,
            products: []
        }
    }
    deleteRecord = (ProductId) => {
        // Primero, obtén el nombre de la imagen del producto que estás a punto de eliminar
        fetch(Api + '/product/' + ProductId)
            .then(response => response.json())
            .then(product => {
                const imageName = product.Image;

                // Ahora puedes eliminar el producto
                const requestOptions = {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        // Puedes incluir otros encabezados si es necesario, como token de autenticación
                    },
                };

                // Elimina el producto
                fetch(Api + '/product/' + ProductId, requestOptions)
                    .then(response => {
                        if (response.status === 200) {
                            // Producto eliminado con éxito, ahora elimina la imagen
                            this.deleteImage(imageName);
                            // Puedes realizar cualquier acción adicional aquí, como actualizar tu estado de React, etc.
                        } else {
                            // Manejar errores, por ejemplo:
                            throw new Error('No se pudo eliminar el registro');
                        }
                    })
                    .catch(error => {
                        console.error('Error al eliminar el registro:', error);
                        // Maneja el error de acuerdo a tus necesidades (por ejemplo, mostrar un mensaje al usuario).
                    });
            })
            .catch(error => {
                console.error('Error al obtener el nombre de la imagen:', error);
                // Maneja el error de obtener el nombre de la imagen según tus necesidades
            });
    };
    // Función para eliminar la imagen
    deleteImage = (imageName) => {
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
                            this.loadData(); // Puedes actualizar tus datos o realizar otras acciones aquí
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
    loadData() {
        // Realizar la solicitud GET a la API al montar el componente
        fetch(Api + '/product') // Reemplaza con la URL de tu API
            .then((response) => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener la lista de registros');
                }
                return response.json();
            })
            .then((data) => {
                // Actualizar el estado con los registros obtenidos
                this.setState({ loadedData: true, products: data })
            })
            .catch((error) => {
                console.error('Error al obtener la lista de registros:', error);
                // Puedes manejar el error de acuerdo a tus necesidades (por ejemplo, mostrar un mensaje de error).
            });
    }
    componentDidMount() {
        this.loadData();
    }
    render() {
        const { loadedData, products } = this.state
        if (!loadedData) { return (<div>Cargando...</div>); }
        else {
            return (
                <div className="card">
                    <div className="card-header">
                        <Link className="btn btn-success" to={"/create"}>Agregar nuevo producto</Link>
                    </div>
                    <div className="card-body">
                        <h4>Lista de productos</h4>
                        <div className="table-responsive">
                            <table className="table table-primary">
                                <thead>
                                    <tr>
                                        <th>Codigo</th>
                                        <th>Descripcion</th>
                                        <th>Categoria</th>
                                        <th>Cantidad</th>
                                        <th>Precio de compra</th>
                                        <th>Precio de venta</th>
                                        <th>Proveedor</th>
                                        <th>Imagen</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(
                                        (product) => (
                                            <tr key={product.ProductId}>
                                                <td>{product.ProductId}</td>
                                                <td>{product.Description}</td>
                                                <td>{product.Category}</td>
                                                <td>{product.Amount}</td>
                                                <td>{product.PurchasePrice}</td>
                                                <td>{product.SalePrice}</td>
                                                <td>{product.supplier}</td>
                                                <td><img width="120px" src={`http://localhost:3000/build/uploads/img/${product.Image}`} alt="" /></td>
                                                <td><div className="btn-group" role="group" aria-label="Button group name">
                                                    <Link className="btn btn-warning" to={"/edit/" + product.ProductId}>Editar</Link>
                                                    <button type="button" className="btn btn-danger" onClick={() => this.deleteRecord(product.ProductId)}>Borrar</button>
                                                </div></td>
                                            </tr>
                                        )
                                    )}

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card-footer text-muted">

                    </div>
                </div>

            );
        }

    }
}
export default List;
