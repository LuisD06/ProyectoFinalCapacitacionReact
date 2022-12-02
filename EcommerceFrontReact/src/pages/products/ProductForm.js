import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import clientHttp from "../../axios/axios";
import { NotificationContext } from "../../context/NotificationContext";

export const ProductForm = () => {
    const [product, setProduct] = useState({
        name: "",
        price: 0,
        notes: "",
        expiration: new Date().toISOString().slice(0, 10),
        stock: 0,
        hasTax: false,
        brandId: "",
        productTypeId: ""
    });
    const [brands, setBrands] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [validated, setValidated] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const { setNotification, setShowNotification } = useContext(NotificationContext);
    const navigation = useNavigate();
    const handleChange = (value, field) => {
        console.log(value);
        setProduct((currentProduct) => ({ ...currentProduct, [field]: value }));
    }
    const handleClose = () => {
        setShowModal(false);
        setError(null);
    };
    const handleSubmit = (evt) => {
        evt.preventDefault();
        const form = evt.currentTarget;
        if (form.checkValidity() === false) {
            evt.stopPropagation();
        } else {
            setShowModal(true);
        }
        setValidated(true);
    }
    const handleCreate = () => {
        let newProdduct = { ...product };
        clientHttp({
            method: 'post',
            url: '/product',
            headers: {
                "Content-Type": "application/json",
            },
            data: newProdduct
        }).then((res) => {
            setNotification("Producto creado con éxito!");
            setShowNotification(true);
            navigation("/products");
        })
        .catch((error) => {
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
                message: `Ha ocurrido un problema al crear el producto: ${errorString}`
            });
        });
    }
    useEffect(
        () => {
            clientHttp({
                method: 'get',
                url: '/brand',
            }).then((res) => setBrands(res.data));
            clientHttp({
                method: 'get',
                url: '/productType',
            }).then((res) => setProductTypes(res.data));
        },
        []
    )
    useEffect(
        () => {
            console.log(brands);
        },
        [brands]
    );
    return (
        <div>
            <h3>Crear producto</h3>
            <Form noValidate validated={validated} onSubmit={(evt) => handleSubmit(evt)}>
                <Form.Group className="mb-3" controlId="formProductName">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nombre"
                        value={product.name}
                        required
                        onChange={(evt) => handleChange(evt.target.value, 'name')}
                    />
                    <Form.Control.Feedback type="invalid">
                        Ingrese un nombre válido
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formProductPrice">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                        type="number"
                        value={product.price}
                        required
                        onChange={(evt) => handleChange(evt.target.valueAsNumber, 'price')}
                        step=".01"
                        min="0.01"
                    />
                    <Form.Control.Feedback type="invalid">
                        Ingrese una cantidad válida
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formProductNotes">
                    <Form.Label>Notas</Form.Label>
                    <Form.Control
                        type="text"
                        value={product.notes}
                        onChange={(evt) => handleChange(evt.target.value, 'notes')}
                    />
                    <Form.Control.Feedback type="invalid">
                        Ingrese un texto válido
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formProductNotes">
                    <Form.Label>Caducidad</Form.Label>
                    <Form.Control
                        type="date"
                        value={product.expiration}
                        onChange={(evt) => handleChange(evt.target.value, 'expiration')}
                    />
                    <Form.Control.Feedback type="invalid">
                        Ingrese un nombre válido
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formProductNotes">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                        type="number"
                        value={product.stock}
                        required
                        onChange={(evt) => handleChange(evt.target.valueAsNumber, 'stock')}
                        step="1"
                        min="1"
                    />
                    <Form.Control.Feedback type="invalid">
                        Ingrese una cantidad válida
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formProductNotes">
                    <Form.Label>Aplica impuesto</Form.Label>
                    <Form.Check
                        type="checkbox"
                        value={product.hasTax}
                        checked={product.hasTax}
                        onChange={(evt) => handleChange(evt.target.checked, 'hasTax')}
                    />
                    <Form.Control.Feedback type="invalid">
                        El campo es necesario
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formProductNotes">
                    <Form.Label>Tipo de producto</Form.Label>
                    <Form.Select onChange={(evt) => handleChange(evt.target.value, "productTypeId")} required>
                        <option value="">Seleccione un tipo de prodcuto</option>
                        {
                            productTypes.map((type) =>
                                <option key={type.id} value={type.id}>{type.name}</option>
                            )
                        }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Seleccione un tipo de producto válido
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formProductNotes">
                    <Form.Label>Marca</Form.Label>
                    <Form.Select onChange={(evt) => handleChange(evt.target.value, "brandId")} required >
                        <option value="">Seleccione una marca</option>
                        {
                            brands.map((brand) =>
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            )
                        }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Seleccione una marca válida
                    </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit">Enviar</Button>
                <Button variant="secondary" onClick={() => navigation("/products")}>
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
                            <h4>Crear producto:</h4>
                            <p><b>Nombre: </b>{product.name}</p>
                            <p><b>Precio: </b>{product.price}</p>
                            <p><b>Notas: </b>{product.notes}</p>
                            <p><b>Expiración: </b>{product.expiration}</p>
                            <p><b>Stock: </b>{product.stock}</p>
                            <p><b>Aplica impuestos: </b>{product.hasTax ? "Si":"No"}</p>
                            <p><b>Marca: </b>{ 
                                brands.length > 0 ? 
                                    brands.filter(brand => brand.id === product.brandId).length > 0 ?
                                        brands.filter(brand => brand.id === product.brandId)[0].name :
                                        ""
                                    : ""
                                }
                            </p>
                            <p><b>Tipo de producto: </b>{ 
                                productTypes.length > 0 ? 
                                    productTypes.filter(type => type.id === product.productTypeId).length > 0 ?
                                        productTypes.filter(type => type.id === product.productTypeId)[0].name :
                                        ""
                                    : ""
                                }
                            </p>
                        </div>
                    }


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={() => handleCreate()}>
                        Continuar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}