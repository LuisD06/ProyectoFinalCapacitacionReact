import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { CartItem } from "../cartItem/CartItem";
import { Product } from "../product/Product";
import CartReducer from "../reducer/CartReducer";

export const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [cart, dispatchCart] = useReducer(CartReducer, []);
    const updateProducts = () => {
        axios({
            method: "get",
            url: "https://localhost:7190/Product",
            headers: {
              "Content-Type": "application/json",
            },
        }).then((res) => setProducts(res.data))
    }
    useEffect(
        () => updateProducts(),
        []
    );
    return (
        <div>
            <ul>
                {
                    cart.map(
                        cartItem => 
                            <CartItem 
                                key={cartItem.product.id}
                                onAddQuanntity={() => dispatchCart({type: "addQuantity", product: cartItem.product})} 
                                onSubtract={() => dispatchCart({type: "subtractQuantity", product: cartItem.product, quantity: cartItem.quantity})}
                                onRemove={() => dispatchCart({type: "removeProduct", product: cartItem.product})}
                                item={cartItem}
                            />
                    )
                }
            </ul>
            <button className="product-add-cart" onClick={() => updateProducts()}>Update</button>
            <ul>

                {
                    products.map(
                        product =>
                            <Product
                                key={product.id}
                                onAdd={() => dispatchCart({type: "addProduct", product: product})}
                                {...product}
                            />
                    )
                }
            </ul>
        </div>
    );
}