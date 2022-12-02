function CartReducer (state, action) {
    switch (action.type) {
        case "addProduct":
            let product = action.product;
            let filtered = state.filter(i => i.product === product);
            if (filtered.length === 0) {
                var cartItem = {
                    product: product,
                    quantity: 1
                };
                return [...state, cartItem]
            }else{
                let newState = state.map(cartItem => cartItem.product.id === product.id ?
                    ({...cartItem, quantity: cartItem.quantity + 1}) : (cartItem)    
                );
                return newState;
            }
        case "removeProduct":
            let productId = action.product.id;
            let newState = state.filter(cartItem => cartItem.product.id !== productId );
            return (newState);

        case "addQuantity":
            let newList = state.map(cartItem => 
                cartItem.product.id === action.product.id ?
                ({...cartItem, quantity: cartItem.quantity + 1}):
                (cartItem)    
            );
            return newList;
        case "subtractQuantity":
            const itemQuantity = action.quantity; 
            const itemId = action.product.id;
            if (itemQuantity === 1) {
                const filteredList = state.filter(cartItem => cartItem.product.id !== itemId);
                return(filteredList);
            }
            let subtractList = state.map(cartItem => 
                cartItem.product.id === action.product.id ?
                ({...cartItem, quantity: cartItem.quantity - 1}):
                (cartItem)  
            ); 
            
            return subtractList;
        default:
            break;
    }
}
export default CartReducer;