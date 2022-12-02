import { useNavigate } from "react-router-dom";

export const Product = ({id,name, notes, price, brand, productType, stock, onAdd}) => {
    const navigation = useNavigate();
    return(
        <div className="product">
            <div className="product-header" onClick={() => navigation(`/productDetail/${id}`)}>
                <h2>{name}</h2>
                <p>{brand}</p>
            </div>
            <div className="product-body" onClick={() => navigation(`/productDetail/${id}`)}>
                <p>{notes}</p>
            </div>
            <div className="product-footer">
                <p> USD {price}</p>
                <div className="product-actions">
                    <button className="product-add-cart" onClick={() => onAdd()}>Añadir al carrito</button>
                </div>
            </div>
        </div>
    );
}