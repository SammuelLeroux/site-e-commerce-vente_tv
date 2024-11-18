import React from "react";

// react-router-dom
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { Container } from "react-bootstrap";

import Header from '../components/Header/Header';
import FormRegister from "../components/Form/FormRegister/FormRegister";

import Tools from "../utils/Tools";

import { Toaster, toast } from 'sonner';

function Register(props: any) {

    const isUserAuthenticated = Tools.isLogin();

    const navigate: NavigateFunction = useNavigate();

    const onValidationReceived = (success: number, action: string, item: Object) => {
        if (success === 1)
        {
            toast.success('Compte créé avec succès!', {
                position: 'top-right',
                style: {
                    padding: "1em"
                },
                duration: 3000
            });

            // redirection la page des form
            setTimeout(() => {
                // redirection vers la page des formulaires
                navigate('/form');
                window.location.reload();
            }, 3001);
        }
        else
        {
            toast.error('Erreur dans la creation de compte!', {
                position: 'top-right',
                style: {
                    padding: "1em"
                },
                duration: 3000
            });
        }
    }

    return (
        <div id="container">
            <Header on={isUserAuthenticated && props.action === "modifier_compte" ? 2 : 0}/>
            <div className="runningBox">
                <Container fluid>
                    <Toaster richColors />
                    <div className="h-100 d-flex align-items-center justify-content-center">
                        <FormRegister onValidationReceived={onValidationReceived} action={props.action}/>
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default Register;