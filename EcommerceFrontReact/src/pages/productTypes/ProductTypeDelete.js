import { useContext, useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import clientHttp from "../../axios/axios";
import { NotificationContext } from "../../context/NotificationContext";

export const ProductTypeDelete = () => {
    const [productType, setProductType] = useState({});
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { productTypeId } = useParams();
    const navigation = useNavigate();
    const { setNotification, setShowNotification } = useContext(NotificationContext);
    const handleClose = () => {
        setShowModal(false);
        setError(null);
    }
    const handleDelete = () => {
        clientHttp({
            method: "delete",
            url: `/ProductType?productTypeId=${productTypeId}`,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res.status === 200) {
                setNotification("Tipo de producto eliminado con éxito!");
                setShowNotification(true);
                navigation('/productTypes');
            }
        }).catch((error) => {
            let errorString = "";
            if (error.response.data.errors) {
                const errorCollections = Object.values(error.response.data.errors);
                let errorList = [];
                errorCollections.forEach(errorArray => {
                    errorArray.forEach(errorItem => {
                        errorList.push(errorItem);
                    })
                })
                console.log(errorList);
                errorString = errorList.toString();

            }else {
                errorString = error.message;
            }
            setError({
                message: `Ha ocurrido un problema al borrar el tipo de producto: ${errorString}`
            });
        });

    }
    useEffect(
        () => {
            clientHttp({
                method: 'get',
                url: `/ProductType/${productTypeId}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                setProductType(res.data);
            }).catch((error) => {

            });
        },
        []
    );
    return (
        <div>
            <Card>
                <Card.Body>
                    <Card.Title>Borrar Tipo De Producto {productTypeId}</Card.Title>
                    <Card.Text>
                        <b>Nombre: </b>
                        {productType.name}
                    </Card.Text>
                    <Button variant="warning" onClick={() => setShowModal(true)}>Borrar</Button>
                    <Button variant="danger" onClick={() => navigation('/productTypes')}>
                        Cancelar
                    </Button>
                </Card.Body>
            </Card>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Borrar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        error ? 
                        <p>{error.message}</p> :
                        <div>
                            <p>Borrar el tipo de producto {productType.name} ?</p>
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={() => handleDelete()}>
                        Confirmar
                    </Button>

                    <Button variant="danger" onClick={() => handleClose()}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}