import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './styles/Panier.css';
import { Container } from "react-bootstrap";

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

import Tools from '../utils/Tools';
import { Orders } from '../utils/Constants';

function calculateTotalPrice(order: Orders | { creationDate: string; products: { id: number; name: string; description: string; photo: string; price: number; }[]; }) {
    let totalPrice = 0;
    if (order && order.products) {
        order.products.forEach((product: { price: number; }) => {
            totalPrice += product.price;
        });
    }
    return totalPrice.toFixed(2);
}

function Panier() {
    let order: Orders = Tools.getCookie("order") ? JSON.parse(Tools.getCookie("order")) : "";

    const [cart, setCart] = useState(order);

    const handleRemoveProduct = (productId: number) => {
        // Envoyer une requête DELETE à l'API pour supprimer le produit du panier
        fetch(`/api/carts/${productId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                // Mettre à jour l'état local du panier en supprimant le produit
                const updatedCart = {
                    ...cart,
                    products: cart.products.filter(product => product.id !== productId)
                };
                setCart(updatedCart);
            } else {
                throw new Error('Erreur lors de la suppression du produit');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    };

    return (
        <div id="container">
            <Header on={2} />
            <div className="runningBox">
                <Container>
                    <div>
                        <header className="cart-header">
                        </header>
                        <section className="shopping-steps">
                            <nav className="cart-nav">
                                <ul className="cart-nav-ul">
                                    <li className="cart-nav-li" data-active>Panier({cart && cart.products ? cart.products.length : 0})</li>
                                    <span>&#8640;</span>
                                    <li className="cart-nav-li">Formulaire</li>
                                    <span>&#8640;</span>
                                    <li className="cart-nav-li">Paiement</li>
                                    <span>&#8640;</span>
                                    <li className="cart-nav-li">Facture</li>
                                </ul>
                            </nav>
                        </section>
                        <hr />
                        <section>
                            {cart && cart.products && cart.products.length > 0 ? (
                                <><div>
                                    {cart.products.map(product => (
                                        <div key={product.id}>
                                            <img src={product.photo} alt={product.name} />
                                            <button onClick={() => handleRemoveProduct(product.id)}>X</button>
                                        </div>
                                    ))}
                                </div><div className="cart-els-box">
                                        <Link className="cart-commande-btn" to={'/commande'}>Commander</Link>
                                        <div className="cart-prix-total-box">
                                            Prix total: <span className="prix-total">{calculateTotalPrice(cart)} € <small>HT</small></span>
                                            <span className="prix-tva">({20} € <small>TVA</small>)</span>
                                        </div>
                                        <a className="cart-vider-btn" href="/panier_vider">Vider le Panier</a>
                                    </div></>
                            ) : (
                                <p className="cart-vide">Le panier est vide!</p>
                            )}
                        </section>
                    </div>
                </Container>
            </div>
            <Footer />
        </div>
    );
}

export default Panier;
