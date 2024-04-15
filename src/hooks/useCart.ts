import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";
import type { CartItem, Guitar, GuitarID } from "../types";

export const useCart = () => {
    
    const initialCart = () : CartItem[] => {
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

    function addToCart(item : Guitar) {
        const itemExits = cart.findIndex(guitar => guitar.id === item.id);
        
        if(itemExits >= 0 ){
            if (cart[itemExits].quantity >= MAX_ITEMS) return;
            const updatedCart = [...cart];
            updatedCart[itemExits].quantity++;
            setCart(updatedCart);
        } else {
            const newItem : CartItem = {...item, quantity : 1};
            setCart([...cart, newItem]);
        }
    }

    function removeFromCart(id : GuitarID){
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id));
    }

    function increaseQuantity(id : GuitarID){
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

    function decreaseQuantity(id : GuitarID){
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

    const isEmpty = useMemo(() => cart.length === 0, [cart]);
    const carTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart]);

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart, isEmpty, carTotal
    }
}
