import { useEffect, useState } from "react";
import { Button, Table, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import clientHttp from "../../axios/axios";


export const BrandList = () => {
    const [brandList, setBrandList] = useState([]);
    

    const navigation = useNavigate();

    const handleCreate = () => {
        navigation('/brand/create');
    }
    const handleUpdate = (brandId) => {
        navigation(`/brand/update/${brandId}`);
    }
    const handleDelete = (brandId) => {
        navigation(`/brand/delete/${brandId}`);
    }

    useEffect(() => {
        clientHttp({
            method: 'get',
            url: '/brand',
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => setBrandList(res.data));
    }, [])


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
                        brandList.map(brand =>
                            <tr key={brand.id}>
                                <td>{brand.id}</td>
                                <td>{brand.name}</td>
                                <td>
                                    <Button variant="danger" onClick={() => handleDelete(brand.id)}>Borrar</Button>
                                    <Button variant="warning" onClick={() => handleUpdate(brand.id)}>Actualizar</Button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </div>
    );
}