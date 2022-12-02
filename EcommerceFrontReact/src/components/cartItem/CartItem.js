export const CartItem = ({item, onAddQuanntity, onRemove, onSubtract}) => {
    return (
        <div>
            <div className="cart-item-image">

            </div>
            <div className="cart-item-info">
                <div className="cart-item-details">
                    <div className="cart-item-header">
                        <h3>{item.product.name}</h3>
                    </div>
                    <div className="cart-item-body">
                        <p>{item.product.notes}</p>
                    </div>
                </div>
                <div className="cart-item-actions">
                    <p>Cantidad: {item.quantity}</p>
                    <button onClick={() => onAddQuanntity()}>+</button>
                    <button onClick={() => onSubtract()}>-</button>
                    <button onClick={() => onRemove()}>Borrar</button>
                </div>
            </div>
        </div>
    );
}