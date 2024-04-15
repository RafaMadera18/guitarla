import { useState, useEffect } from "react";
import { db } from "../data/db";

export const useCart = () => {
    
    const initialCart = () => {
        const localStorageCart = localStorage.getItem("cart");
        return localStorageCart ? JSON.parse(localStorageCart) : [];
    }

    const MAX_ITEMS = 5;
    const MIN_ITEMS = 1;

    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart])

    function addToCart(item) {
        const itemExits = cart.findIndex(guitar => guitar.id === item.id);
        
        if(itemExits >= 0 ){
            if (cart[itemExits].quantity >= MAX_ITEMS) return;
            const updatedCart = [...cart];
            updatedCart[itemExits].quantity++;
            setCart(updatedCart);
        } else {
            item.quantity = 1;
            setCart([...cart, item]);
        }

        
    }

    function removeFromCart(id){
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id));
    }

    function increaseQuantity(id){
        const updatedCart = cart.map( item => {
            if(item.id === id && item.quantity < MAX_ITEMS){
                return {
                    ...item,
                    quantity: item.quantity+1
                }
            }
            return item
        })
        setCart(updatedCart);
    }

    function decreaseQuantity(id){
        const updatedCart = cart.map( item => {
            if(item.id === id && item.quantity > MIN_ITEMS){
                return {
                    ...item,
                    quantity: item.quantity-1
                }
            }
            return item
        })
        setCart(updatedCart);
    }

    function clearCart() {
        setCart([])
    }

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart
    }
}
