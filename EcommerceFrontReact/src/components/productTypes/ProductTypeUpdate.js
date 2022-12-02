import axios from "axios";
import { useState } from "react";

export const ProductTypeUpdate = () => {
    const [productTypeId, setProductTypeId] = useState("");
    const [productTypeName, setProductTypeName] = useState("");
    const [error, setError] = useState(null);
    const handleIdChange = (evt) => {
        setProductTypeId(evt.target.value);
    }
    const handleNameChange = (evt) => {
        setProductTypeName(evt.target.value);
    }
    const handleSubmit = (evt) => {
        evt.preventDefault();
        const requestData = {
            name: productTypeName
        }
        axios({
            method: "put",
            url: `https://localhost:7190/ProductType?productTypeId=${productTypeId}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: requestData
        }).then((res) => {
            console.log(res);
            setError(null);
        })
        .catch((error) => setError({
                // message: error.response.data
                message: error.message
            }
        ))
    }
    return (
        <div>
            <h3>Actualizar</h3>
            { error && <p>Ha ocurrido un error: {error.message}</p> }
            <form onSubmit={(evt) => handleSubmit(evt)}>
                <label htmlFor="productTypeId">Id </label>
                <input type="text" name="productTypeId" value={productTypeId} onChange={(evt) => handleIdChange(evt)}/>
                <label htmlFor="productTypeName">Nombre</label>
                <input type="text" name="productTypeName" value={productTypeName} onChange={(evt) => handleNameChange(evt)}/>
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}