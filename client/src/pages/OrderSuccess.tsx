import React from 'react';

import { Stripe, StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Success from '../components/Success/Success';

import Tools from '../utils/Tools';
import { STRIPE_PUBLIC_KEY, Orders } from '../utils/Constants';

let stripePromise:Promise<Stripe | null> = loadStripe(STRIPE_PUBLIC_KEY);

const OrderSuccess: React.FC = () => {
    const order: Orders = Tools.getCookie("order") ? JSON.parse(Tools.getCookie("order")) : "";

    let options: StripeElementsOptions = {};

    if (order) {
        let orderAmount = 0;
        for (let i = 0; i < order.products.length; i++) {
            orderAmount += order.products[i].price;
        }
    
        // on convertit en centime
        orderAmount = Math.round(orderAmount * 100);
        
        options = {
            mode: 'payment',
            amount: orderAmount,
            currency: 'eur',
            appearance: {
                theme: 'flat',
                variables: { colorPrimaryText: '#262626' },
            },
        };
    }


    return (
        <>
            {
                order ? (
                    <Elements stripe={stripePromise} options={options}>
                        <Success />
                    </Elements>
                ) : (
                    <div id="container">
                        <Header on={2} />
                        <div className="runningBox">
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center'
                            }}>
                                <h2>Votre commande a bien été validée.</h2>
                                <p>N'hésitez pas à nous faire un retour.</p>
                            </div>
                        </div>
                        <Footer />
                    </div>
                )
            }
        </>
    );
};

export default OrderSuccess;