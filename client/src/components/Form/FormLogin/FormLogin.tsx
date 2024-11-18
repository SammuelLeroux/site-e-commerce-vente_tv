import React, { useState } from "react";

// react-router-dom
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

// style
import style from './FormLogin.module.css';

// composants
import Button from '../../Button/Button'

// bootstrap
import { Form, InputGroup, CloseButton } from 'react-bootstrap';

//fontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// tools
import AxiosTools from '../../../utils/Axios';
import Tools from '../../../utils/Tools';

interface FormLoginProps {
    onValidationReceived: (success: number, type: string, data: any) => void;
    onClose: () => void;
}

const FormLogin = (props: FormLoginProps) => {
    
    const navigate: NavigateFunction = useNavigate();

    const [validated, setValidated] = useState<boolean>(false);

    const [missingData, setMissingData] = useState<boolean>(false);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    // visibilite du mot de passe
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault();

        setMissingData(false);

        // verification
        const form:any = e.currentTarget;
        if (form.checkValidity() === false)
        {
            e.stopPropagation();
        }

        setValidated(true);

        interface PostData {
            email: string;
            password: string;
        }

        const postData: PostData = {
            email: email,
            password: password
        }

        for (const elem in Object.values(postData))
        {
            if (elem === '')
            {
               setMissingData(true);
               break;
            }
        }

        if (!missingData)
        {
            // envoie post connexion
            AxiosTools.post('/login', postData, (response: any) =>
            {
                if (response.status - 200 < 10)
                {
                    // reussite

                    // Stocker le jeton JWT dans un cookie sécurisé avec une durée de validité (par exemple, 1 jour)
                    Tools.setCookie('token', JSON.stringify({ "token": response.data.token }));

                    // creation d'un cookie pour stocker la commande, le cookie sera supprimé s'il y a achat sur la commande et on recreera un cookie
                    Tools.setCookie("order", JSON.stringify({ "products": [] }));

                    // toast reussite
                    props.onValidationReceived(1, 'connexion', response.data.user)
                }
                else
                {
                    // echec de la connexion

                    // toast echec
                    props.onValidationReceived(0, 'connexion', null)
                }
            })
        }
    }

    return (
        <div className={style.FormLogin}>
            <div className="d-flex justify-content-end mb-3">
                <CloseButton
                    onClick={props.onClose}
                />
            </div>
            <div>
                <h5>
                    Déja client ?
                </h5>
                <Form noValidate validated={validated} onSubmit={handleLoginSubmit}>
                    <Form.Group className="my-3">
                        <Form.Control
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mt-3 mb-4">
                        <InputGroup>
                            <Form.Control
                                type={passwordVisible ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Mot de passe"
                                required
                            />
                            <InputGroup.Text>
                                <FontAwesomeIcon
                                    icon={passwordVisible ? faEye : faEyeSlash}
                                    onClick={togglePasswordVisibility}
                                    style={{ cursor: 'pointer' }}
                                />
                            </InputGroup.Text>
                        </InputGroup>
                        <Link to="/" className="h6 d-flex justify-content-end mt-2">Mot de passe oublié</Link>
                    </Form.Group>
                    <div className="text-center mb-2">
                        <Button
                            text="Connexion"
                            type="submit"
                        />
                    </div>
                    <hr />
                    <div className="text-center">
                        <span className="h6 text-center">Nouveau client ?</span>
                        <div className="mt-1">
                            <Button
                                text="Créer un compte"
                                type="button"
                                onClick={() => navigate("/register")}
                            />
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default FormLogin