import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import clientHttp from "../../axios/axios";
import { NotificationContext } from "../../context/NotificationContext";

export const BrandDelete = () => {
    const [brand, setBrand] = useState({});
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { brandId } = useParams();
    const navigation = useNavigate();
    const { setNotification, setShowNotification } = useContext(NotificationContext);
    const handleClose = () => {
        setShowModal(false);
        setError(null);
    }
    const handleCancel = () => {
        navigation('/brand');
    }
    const handleDelete = () => {
        clientHttp({
            method: "delete",
            url: `/Brand?brandId=${brandId}`,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res.status === 200) {
                setNotification("Marca eliminada exitósamente");
                setShowNotification(true);
                navigation('/brand');
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
                message: `Ha ocurrido un problema al eliminar la marca: ${errorString}`
            });
        });

    }
    useEffect(
        () => {
            clientHttp({
                method: 'get',
                url: `/brand/${brandId}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                setBrand(res.data);
            }).catch((error) => {

            });
        },
        []
    );
    return (
        <div>
            <Card>
                <Card.Body>
                    <Card.Title>Borrar marca {brandId}</Card.Title>
                    <Card.Text>
                        <b>Nombre: </b>
                        {brand.name}
                    </Card.Text>
                    <Button variant="warning" onClick={() => setShowModal(true)}>Borrar</Button>
                    <Button variant="danger" onClick={() => handleCancel()}>
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
                        <p>Esta acción no puede ser revertida</p>
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