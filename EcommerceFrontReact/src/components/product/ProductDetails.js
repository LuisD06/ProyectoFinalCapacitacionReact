import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    useEffect(
        () => {
            axios({
                method: "get",
                url: `https://localhost:7190/Product/${id}`,
                headers: {
                  "Content-Type": "application/json",
                },
            }).then((res) => setProduct(res.data))
        },
        []
    );
    return (
        <div>
            <div className="product-detail">
                <div className="product-detail-image">

                </div>
                <div className="product-detail-content">
                    <h3>{product.name}</h3>
                    <p className="product-detail-type">{product.productType}</p>
                    <div className="product-detail-info">
                        <div className="product-detail-detail">
                            <p>Marca</p>
                            <p>{product.brand}</p>
                        </div>
                        <div className="product-detail-detail">
                            <p>Impuestos</p>
                            <p>{product.hasTax ? "Si" : "No"}</p>
                        </div>
                            
                    </div>
                    <p className="product-detail-notes">{product.notes}</p>
                    <p className="product-detail-notes"><b>Stock: </b>{product.stock}</p>
                </div>
            </div>
        </div>
    );
}