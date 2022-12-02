import { useContext, useState } from "react";
import { Container, Nav, Navbar, Toast, ToastContainer } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NotificationContext } from "../../context/NotificationContext";



const Menu = (props) => {
   const [showToast, setShowToast] = useState(false);
   const { notification, showNotification, setShowNotification } = useContext(NotificationContext);

   return (
      <>
         <Navbar bg="light" expand="lg">
            <Container>
               <Navbar.Brand>Ecommerce</Navbar.Brand>
               <Navbar.Toggle aria-controls="basic-navbar-nav" />
               <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                     <Nav.Link href="/brand">Marcas</Nav.Link>
                     <Nav.Link href="/productTypes">Tipos De Producto</Nav.Link>
                     <Nav.Link href="/products">Productos</Nav.Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>
         <ToastContainer className="p-3" position='bottom-end'>
            <Toast onClose={() => setShowNotification(false)} show={showNotification} delay={5000} autohide bg="info">
               <Toast.Body>{notification}</Toast.Body>
            </Toast>
         </ToastContainer>
      </>

   );
};

export default Menu;