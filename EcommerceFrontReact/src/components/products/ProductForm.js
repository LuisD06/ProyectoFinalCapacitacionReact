import { useState } from "react";
import axios  from "axios";

export const ProductForm = () => {
    const [product, setProduct] = useState({
        name: "",
        price: 0,
        notes: "",
        expiration: "",
        stock: 0,
        hasTax: false,
        brandId: "",
        productTypeId: ""
    });
    const handleProduct = (evt, field) => {
        setProduct((currentProduct) => ({...currentProduct, [field]:evt.target.value}));
    }
    const handleSubmit = (evt) => {
        evt.preventDefault();
        console.log(product);
        axios({
            method: "post",
            url: "https://localhost:7190/Product",
            headers: {
              "Content-Type": "multipart/form-data",
            },
            data: product,
        }).then((res) => console.log(res))
            
    }
    return(
        <div>
            <h3>Crear</h3>
            <form onSubmit={(evt) => handleSubmit(evt)}>
                <label htmlFor="productName">Nombre</label>
                <input type="text" name="productName" value={product.name} onChange={(evt) => handleProduct(evt, 'name')}/>
                <label htmlFor="productPrice">Precio</label>
                <input type="number" name="productPrice" value={product.price} onChange={(evt) => handleProduct(evt, 'price')}/>
                <label htmlFor="productNotes">Notas</label>
                <input type="text" name="productNotes" value={product.notes} onChange={(evt) => handleProduct(evt, 'notes')}/>
                <label htmlFor="productExpiration">Fecha caducidad</label>
                <input type="date" name="productExpiration" value={product.expiration} onChange={(evt) => handleProduct(evt, 'expiration')}/>
                <label htmlFor="productStock">Stock</label>
                <input type="number" name="productStock" value={product.stock} onChange={(evt) => handleProduct(evt, 'stock')}/>
                <label htmlFor="productTax">Aplica Impuestos</label>
                <input type="checkbox" name="productTax" value={product.hasTax} onChange={(evt) => handleProduct(evt, 'hasTax')}/>
                <label htmlFor="productBrand">Id Marca</label>
                <input type="text" name="productBrand" value={product.brandId} onChange={(evt) => handleProduct(evt, 'brandId')}/>
                <label htmlFor="productType">Id Tipo Producto</label>
                <input type="text" name="productType" value={product.productTypeId} onChange={(evt) => handleProduct(evt, 'productTypeId')}/>
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}