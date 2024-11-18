import React, { useState, useEffect } from 'react';

import { Stripe, StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { Container } from 'react-bootstrap';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import CheckoutForm from '../components/Form/FormPayment/CheckoutForm';

import AxiosTool from '../utils/Axios';
import Tools from '../utils/Tools';
import { STRIPE_PUBLIC_KEY, Orders } from '../utils/Constants';

import './styles/Payment.css'

let stripePromise:Promise<Stripe | null> = loadStripe(STRIPE_PUBLIC_KEY);

const Payment: React.FC = () => {

    const [clientSecret, setClientSecret] = useState<string>("");
    const order: Orders = Tools.getCookie("order") ? JSON.parse(Tools.getCookie("order")) : "";

    let orderAmount = 0;
    for (let i = 0; i < order.products.length; i++) {
        orderAmount += order.products[i].price;
    }

    // on convertit en centime
    orderAmount = Math.round(orderAmount * 100);

    const options: StripeElementsOptions = {
        mode: 'payment',
        amount: orderAmount,
        currency: 'eur',
        appearance: {
            theme: 'flat',
            variables: { colorPrimaryText: '#262626' },
        },
    };

    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                AxiosTool.post('/payment/paymentIntent', {orderAmount: orderAmount}, (response: any) =>  {
                    setClientSecret(response.data.clientSecret);
                });
            } catch (error) {
                console.error('Erreur lors de la récupération du clientSecret :', error);
            }
        };

        fetchClientSecret();
    }, [orderAmount]);

    return (
        <div id="container">
            <Header on={2} />
            <div className="runningBox">
                <Container className="payment d-flex justify-content-center w-50" style={{
                    minHeight: '80ch',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    {
                        stripePromise && (
                            <Elements stripe={stripePromise} options={options}>
                                <CheckoutForm clientSecret={clientSecret}/>
                            </Elements>
                        )
                    }
                </Container>
            </div>
            <Footer />
        </div>
    );
};

export default Payment;