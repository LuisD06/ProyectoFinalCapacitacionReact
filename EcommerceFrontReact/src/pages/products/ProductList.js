import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import clientHttp from "./../../axios/axios";

export const ProductList = () => {
    const [productList, setProductList] = useState([]);
    const navigation = useNavigate();
    const handleUpdate = (productId) => {
        navigation(`/products/update/${productId}`);
    }
    const handleDelete = (productId) => {
        navigation(`/products/delete/${productId}`);
    }
    const handleCreate = () => {
        navigation("/products/create");
    }

    useEffect(
        () => {
            clientHttp({
                method: 'get',
                url:'/product'
            }).then((res) => setProductList(res.data));
        },
        []
    );
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Notas</th>
                    <th>Stock</th>
                    <th>Aplica Impuestos</th>
                    <th>Marca</th>
                    <th>Tipo Producto</th>
                    <th><Button onClick={() => handleCreate()} variant="primary">Crear</Button></th>
                </tr>
            </thead>
            <tbody>
                {
                    productList.map(product =>
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.notes}</td>
                            <td>{product.stock}</td>
                            <td>{product.hasTax ? "Si":"No"}</td>
                            <td>{product.brand}</td>
                            <td>{product.productType}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDelete(product.id)}>Borrar</Button>
                                <Button variant="warning" onClick={() => handleUpdate(product.id)}>Actualizar</Button>
                            </td>
                        </tr>
                    )
                }
            </tbody>
        </Table>
    );
}