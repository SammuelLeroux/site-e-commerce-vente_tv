import React, { useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import style from './CheckoutForm.module.css';
import { Form, Button } from 'react-bootstrap';
import { Toaster, toast } from 'sonner';

import { Stripe, StripeElements } from '@stripe/stripe-js';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

import AxiosTool from '../../../utils/Axios';
import { Orders } from '../../../utils/Constants';
import Tools from '../../../utils/Tools';

interface CheckoutProps {
    clientSecret: string;
}

enum Step {
    Step1 = 1,
    Step2 = 2
}

const CheckoutForm = (props: CheckoutProps) => {
    const stripe: Stripe | null = useStripe();
    const elements: StripeElements | null = useElements();
    const clientSecret = props.clientSecret;

    const [validated, setValidated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const [step, setStep] = useState<Step>(Step.Step1);
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        country: '',
    });

    const handleAddressSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        setValidated(true);
        if (form.checkValidity() === true) {
            setStep(Step.Step2);
        }
    };

    const handleStepBack = () => {
        setStep(Step.Step1);
    }

    const navigate:NavigateFunction = useNavigate();
    const handleReturn = () => {
        navigate('/order');
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (elements !== null && stripe !== null && clientSecret)
        {
            setIsLoading(true);

            try {
                // Soumettre les éléments Stripe pour validation
                const result = await elements.submit();

                if (result.error) {
                    // Gérer les erreurs de validation des éléments Stripe
                    setIsLoading(false);

                    // Afficher une erreur à l'utilisateur
                    console.error(result.error);
                    return;
                }

                let url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
                const { error } = await stripe.confirmPayment({
                    elements,
                    clientSecret: clientSecret,
                    confirmParams: {
                        return_url: url,
                        receipt_email: "sammuel.leroux@epitech.eu"
                    },
                });

                if (error)
                {
                    toast.error('Erreur est survenue lors du paiement', {
                        position: 'top-right',
                        style: {
                            background: 'red',
                            color: 'white'
                        },
                        duration: 3000
                    });
                }
            } catch (error) {
                console.error('Erreur lors du traitement du paiement :', error);
            }

            setIsLoading(false);
        }
        
        let order: Orders = Tools.getCookie("order") ? JSON.parse(Tools.getCookie("order")) : "";
        AxiosTool.post(
            '/payment/create', order,
            (response) => { console.log(response.data) },
            { headers: { "Content-Type": "application/json" } },
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingAddress({ ...shippingAddress, [name]: value });
    };

    return (
        <section className={style.formPaymentW}>

            <Toaster richColors />
            
            {step === 1 && (
                <Form noValidate validated={validated} onSubmit={handleAddressSubmit} className={style.customPaymentForm}>
                    <h3 className='text-center mb3'>Formulaire</h3>
                    <Form.Group controlId="street" className="py-2">
                        <div className='d-flex flex-row align-items-center gap-4'>
                            <Form.Label>Adresse</Form.Label>
                            <Form.Control required type="text" name="street" value={shippingAddress.street} onChange={handleInputChange} className="p-3 rounded"/>
                        </div>
                        <Form.Control.Feedback type="invalid">Veuillez fournir une adresse valide.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="city" className="py-2">
                        <div className='d-flex flex-row align-items-center gap-5'>
                            <Form.Label>Ville</Form.Label>
                            <Form.Control required type="text" name="city" value={shippingAddress.city} onChange={handleInputChange} className="p-3 rounded"/>
                        </div>
                        <Form.Control.Feedback type="invalid">Veuillez fournir une ville valide.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="country" className="py-2">
                        <div className='d-flex flex-row align-items-center gap-5'>
                            <Form.Label>Pays</Form.Label>
                            <Form.Control required type="text" name="country" value={shippingAddress.country} onChange={handleInputChange} className="p-3 rounded"/>
                        </div>
                        <Form.Control.Feedback type="invalid">Veuillez fournir un pays valide.</Form.Control.Feedback>
                    </Form.Group>
                    <div className='d-flex flex-row justify-content-between align-items-center gap-5'>
                        <Button type="button" onClick={handleReturn}>Retour</Button>
                        <Button type="submit">Suivant</Button>
                    </div>
                </Form>
            )}
            {step === 2 && (
                <Form noValidate onSubmit={handleSubmit} className={style.customPaymentForm}>
                    <h3 className='text-center mb-3'>Paiement</h3>
                    <PaymentElement className='position-relative'/>
                    <div className='d-flex flex-row justify-content-between align-items-center gap-5'>
                        <Button type="button" onClick={handleStepBack}>Retour</Button>
                        <Button type="submit" disabled={!stripe || !elements}>
                            <span id="button-text">
                                {isLoading ? <div className="spinner" id="spinner"></div> : "Acheter"}
                            </span>
                        </Button>
                    </div>
                </Form>
            )}
        </section>
    );
};

export default CheckoutForm;
