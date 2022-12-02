import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";
import Layout from './components/layout/Layout';
import { ProductDetail } from './components/product/ProductDetails';
import { ProductTypes } from './pages/productTypes/ProductTypes';
import { Brand } from './pages/brand/Brand';
import { BrandForm } from './pages/brand/BrandForm';
import { BrandDelete } from './pages/brand/BrandDelete';
import { BrandUpdate } from './pages/brand/BrandUpdate';
import { NotificationContext } from './context/NotificationContext';
import { useState } from 'react';
import { ProductTypesForm } from './pages/productTypes/ProductTypesForm';
import { ProductTypeDelete } from './pages/productTypes/ProductTypeDelete';
import { ProductTypeUpdate } from './pages/productTypes/ProductTypeUpdate';
import { Product } from './pages/products/Product';
import { ProductForm } from './pages/products/ProductForm';
import { ProductUpdate } from './pages/products/ProductUpdate';
import { ProductDelete } from './pages/products/ProductDelete';


function App() {
  const [notification, setNotification] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const context = {notification, setNotification, showNotification, setShowNotification};


  return (
    <NotificationContext.Provider value={context}>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/products" element={<Product />}></Route>
              <Route path="/products/create" element={<ProductForm />}></Route>
              <Route path="/products/update/:productId" element={<ProductUpdate />}></Route>
              <Route path="/products/delete/:productId" element={<ProductDelete />}></Route>
              <Route path="/brand" element={<Brand />}></Route>
              <Route path="/brand/create" element={<BrandForm/>}></Route>
              <Route path="/brand/update/:brandId" element={<BrandUpdate/>}></Route>
              <Route path="/brand/delete/:brandId" element={<BrandDelete/>}></Route>
              <Route path="/productTypes" element={<ProductTypes />}></Route>
              <Route path="/productTypes/create" element={<ProductTypesForm />}></Route>
              <Route path="/productTypes/update/:productTypeId" element={<ProductTypeUpdate />}></Route>
              <Route path="/productTypes/delete/:productTypeId" element={<ProductTypeDelete />}></Route>
              <Route path="/productDetail/:id" element={<ProductDetail />}></Route>
            </Route>

          </Routes>
        </BrowserRouter>
    </NotificationContext.Provider>
  );
}

export default App;
