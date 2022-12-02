import { ProductForm } from "./ProductForm";
import { ProductList } from "./ProductList";
import "./Products.css";

export const Products = () => {
    return (
        <div>
            <ProductForm/>
            <ProductList/>
        </div>
    );
}