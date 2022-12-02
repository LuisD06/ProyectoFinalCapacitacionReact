import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import clientHttp from "../../axios/axios";
import { NotificationContext } from "../../context/NotificationContext";

export const ProductTypeUpdate = () => {
    const [name, setName] = useState("");
    const [oldName, setOldName] = useState("");
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { productTypeId } = useParams();
    const { setNotification, setShowNotification } = useContext(NotificationContext);
    const handleClose = () => {
        setShowModal(false);
        setError(null);
    };
    const navigation = useNavigate();

    const handleSubmit = (evt) => {
        const form = evt.currentTarget;
        evt.preventDefault();
        if (form.checkValidity() === false) {
            evt.stopPropagation();
        } else {
            setShowModal(true);
        }
        setValidated(true);
    }

    const handleUpdate = () => {
        const requestData = {
            name: name
        }
        clientHttp({
            method: "put",
            url: `/productType?productTypeId=${productTypeId}`,
            headers: {
                "Content-Type": "application/json",
            },
            data: requestData
        }).then((res) => {
            setNotification("Marca actualizada correctamente");
            setShowNotification(true);
            navigation("/productTypes");
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
                message: `Ha ocurrido un problema al actualizar el tipo de producto: ${errorString}`
            });
        });
    }
    useEffect(
        () => {
            clientHttp({
                method: 'get',
                url: `/productType/${productTypeId}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                setName(res.data.name);
                setOldName(res.data.name);
            }).catch((error) => {
                console.log(error);
            });
        },
        []
    );
    return (
        <div>
            <h3>Crear</h3>
            <Form noValidate validated={validated} onSubmit={(evt) => handleSubmit(evt)}>
                <Form.Group className="mb-3" controlId="formBrandName">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        value={name}
                        type="text"
                        placeholder="Nombre"
                        required
                        onChange={(evt) => setName(evt.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Ingrese un nombre válido
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="sumbit">Enviar</Button>
                <Button variant="danger" onClick={() => navigation("/productTypes")}>
                    Cancelar
                </Button>
            </Form>

            <Modal show={showModal} onHide={() => handleClose()}>
                <Modal.Header closeButton>
                    <Modal.Title>Actualizar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        error ? 
                        <p>{error.message}</p> :
                        <div>
                            <h4>Actualizar nombre de tipo de producto: </h4>
                            <p><b>Anterior: </b>{oldName}</p>
                            <p><b>Nuevo: </b>{name}</p>

                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={() => handleUpdate()}>
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