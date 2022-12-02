import { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import clientHttp from "../../axios/axios";
import { NotificationContext } from "../../context/NotificationContext";

export const BrandForm = () => {
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
    const handleContinue = () => {
        const newBrand = {
            name: name
        }
        clientHttp({
            method: "post",
            url: "/Brand",
            headers: {
                "Content-Type": "application/json",
            },
            data: newBrand,
        }).then((res) => {
            if (res.status === 200) {
                setNotification("Marca creada con éxito!");
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
                message: `Ha ocurrido un problema al crear la marca: ${errorString}`
            });
        });
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
            <h3>Crear marca</h3>
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
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
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
                            <h4>Crear marca</h4>
                            <p><b>Nombre: </b>{name}</p>
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={() => handleContinue()}>
                        Continuar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}