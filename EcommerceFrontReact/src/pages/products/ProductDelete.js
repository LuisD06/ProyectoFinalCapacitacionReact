import { useContext, useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import clientHttp from "../../axios/axios";
import { NotificationContext } from "../../context/NotificationContext";

export const ProductDelete = () => {
    const [product, setProduct] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const { productId } = useParams();
    const navigation = useNavigate();
    const { setNotification, setShowNotification } = useContext(NotificationContext);
    const handleCancel = () => {
        navigation('/products');
    }
    const handleClose = () => {
        setShowModal(false);
        setError(null);
    }
    const handleDelete = () => {
        clientHttp({
            method: "delete",
            url: `/product?productId=${productId}`,
        }).then((res) => {
            if (res.status === 200) {
                setNotification("Producto eliminado con éxito");
                setShowNotification(true);
                navigation('/products');
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
                message: `Ha ocurrido un problema al eliminar el producto: ${errorString}`
            });
        });

    }
    useEffect(
        () => {
            clientHttp({
                method: 'get',
                url: `/product/${productId}`,
            }).then((res) => setProduct(res.data));
        },
        []
    );
    return (
        <div>
            <Card>
                <Card.Body>
                    <Card.Title>Borrar producto {productId}</Card.Title>
                    <Card.Body>
                        <p><b>Nombre: </b>{product.name}</p>
                        <p><b>Precio: </b>{product.price}</p>
                        <p><b>Notas: </b>{product.notes}</p>
                        <p><b>Expiración: </b>{product.expiration}</p>
                        <p><b>Stock: </b>{product.stock}</p>
                        <p><b>Aplica impuestos: </b>{product.hasTax ? "Si" : "No"}</p>
                        <p><b>Marca: </b>{product.brand}</p>
                        <p><b>Tipo de producto: </b>{product.productType}</p>
                    </Card.Body>
                    <Button variant="warning" onClick={() => setShowModal(true)}>Borrar</Button>
                    <Button variant="danger" onClick={() => handleCancel()}>
                        Cancelar
                    </Button>
                </Card.Body>
            </Card>
            <Modal show={showModal} onHide={() => handleClose()}>
                <Modal.Header closeButton>
                    <Modal.Title>Borrar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        error ? 
                        <p>{error.message}</p> :
                        <p>Esta acción no se puede revertir</p>
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