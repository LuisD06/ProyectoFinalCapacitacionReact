
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import clientHttp from "./../../axios/axios";

export const ProductTypesList = () => {
    const [typesList, setTypesList] = useState([]);
    const navigation = useNavigate();
    const handleCreate = () => {
        navigation("/productTypes/create");
    }
    const handleDelete = (productTypeId) => {
        navigation(`/productTypes/delete/${productTypeId}`);
    }
    const handleUpdate = (productTypeId) => {
        navigation(`/productTypes/update/${productTypeId}`);
    }


    useEffect(
        () => {
            clientHttp({
                method: "get",
                url: "/ProductType",
                headers: {
                  "Content-Type": "application/json",
                },
            }).then((res) => setTypesList(res.data));
        },
        []
    );
    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th><Button onClick={() => handleCreate()} variant="primary">Crear</Button></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        typesList.map(type =>
                            <tr key={type.id}>
                                <td>{type.id}</td>
                                <td>{type.name}</td>
                                <td>
                                    <Button variant="danger" onClick={() => handleDelete(type.id)}>Borrar</Button>
                                    <Button variant="warning" onClick={() => handleUpdate(type.id)}>Actualizar</Button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </div>
    );
}