import { useContext, useState } from "react";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../context/NotificationContext";

export const ProductTypesForm = () => {
    const [name, setName] = useState("");
    const [validated, setValidated] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const { setNotification, setShowNotification } = useContext(NotificationContext);
    const navigation = useNavigate();
    const handleClose = () => {
        setShowModal(false);
        setError(null);
    };
    const handleCreate = (evt) => {
        evt.preventDefault();
        const newProductType = {
            name: name
        }
        axios({
            method: "post",
            url: "https://localhost:7190/ProductType",
            headers: {
                "Content-Type": "application/json",
            },
            data: newProductType,
        }).then((res) => {
            setNotification("Tipo de producto creado con éxito!");
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
                message: `Ha ocurrido un problema al crear el tipo de producto: ${errorString}`
            });
        })

    }
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
    return (
        <div>
            <h3>Crear tipo de producto</h3>
            <Form noValidate validated={validated} onSubmit={(evt) => handleSubmit(evt)}>
                <Form.Group className="mb-3" controlId="formBrandName">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nombre"
                        required
                        onChange={(evt) => setName(evt.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Ingrese un nombre válido
                    </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit">Enviar</Button>
                <Button variant="secondary" onClick={() => navigation('/productTypes')}>
                    Cancelar
                </Button>
            </Form>
            <Modal show={showModal} onHide={() => handleClose()}>
                <Modal.Header closeButton>
                    <Modal.Title>Información</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        error ?
                        <p>{error.message}</p> :
                        <div>
                            <h4>Crear tipo de producto</h4>
                            <p><b>Nombre: </b>{name}</p>
                        </div>
                    }


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={(evt) => handleCreate(evt)}>
                        Continuar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}