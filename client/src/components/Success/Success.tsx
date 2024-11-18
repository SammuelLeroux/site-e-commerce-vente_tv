import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import style from './Success.module.css';
import { Container } from "react-bootstrap";
import { Toaster, toast } from 'sonner';

import { Stripe } from '@stripe/stripe-js';
import { useStripe} from '@stripe/react-stripe-js';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import Tools from '../../utils/Tools';
import { Orders } from '../../utils/Constants';

function Panier() {
    const stripe: Stripe | null = useStripe();
    
    const navigate = useNavigate();

    let order: Orders = Tools.getCookie("order") ? JSON.parse(Tools.getCookie("order")) : "";
    
    useEffect(() => {
        if (!stripe) {
            return;
        }
    
        const clientSecret:string | null = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );
    
        if (!clientSecret || clientSecret === null) {
            navigate('/');
            return;
        }
    
        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            if (paymentIntent)
            {
                switch (paymentIntent.status)
                {
                    case "succeeded":
                        toast.success('Paiement réussi!', {
                            position: 'top-right',
                            style: {
                                padding: "1em"
                            },
                            duration: 3000
                        });
                        if (order) Tools.deleteCookie("order");
                        setInterval(() => navigate("/"), 3000)
                    break;
                    case "processing":
                        toast.loading('Paiement en cours.', {
                            position: 'top-right',
                            style: {
                                padding: "1em"
                            },
                            duration: 3000
                        });
                        if (order) Tools.deleteCookie("order");
                        setInterval(() => navigate("/"), 3000)
                    break;
                    case "requires_payment_method":
                        toast.success('Le paiement a échoué, veuillez réésayer!', {
                            position: 'top-right',
                            style: {
                                padding: "1em"
                            },
                            duration: 3000
                        });
                    break;
                    default:
                        toast.error('Erreur est survenue lors du paiement.', {
                            position: 'top-right',
                            style: {
                                padding: "1em"
                            },
                            duration: 3000
                        });
                    break;
                }
            }
        });
    }, [stripe, navigate, order]);

    return (
        <div id="container">
            <Header on={2} />
            <Toaster richColors/>
            <div className="runningBox">
                <Container>
                    <h2>Votre commande a bien été validée.</h2>
                    <p>N'hésitez pas à nous faire un retoru.</p>
                </Container>
            </div>
            <Footer />
        </div>
    );
}

export default Panier;
