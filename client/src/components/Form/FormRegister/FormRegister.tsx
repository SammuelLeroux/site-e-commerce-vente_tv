import React, { useState, useEffect } from "react";

// react-router-dom
import { NavigateFunction, useNavigate } from 'react-router-dom';

// style
import style from "./FormRegister.module.css"

// bootstrap:
import { Form, InputGroup } from 'react-bootstrap';

import Button from '../../Button/Button'

//fontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// tools
import AxiosTools from '../../../utils/Axios';
import { Users } from '../../../utils/Constants';

interface FormRegisterProps {
    action: string;
    onValidationReceived: (success: number, type: string, data: any) => void;
}

function FormRegister(props: FormRegisterProps)
{
    const navigate: NavigateFunction = useNavigate();

    const [user, setUser] = useState<Users | null>(null);

    useEffect(() => {
        if (props.action === 'modifier_compte') {

            let isMounted = true;

            AxiosTools.get('/users', (response: any) => {
                if (isMounted) {
                    setUser(response.data.user);
                }
            });

            return () => {
                isMounted = false;
            };
        }
    }, [props.action]);

    const [validated, setValidated] = useState<boolean>(false);

    const [missingData, setMissingData] = useState<boolean>(false);

    const [login, setLogin] = useState<string>(user && user.login ? user.login : ''); // Champ login
    const [password, setPassword] = useState<string>(); // Champ password
    const [newPassword, setNewPassword] = useState<string>(); // Champ new password
    const [email, setEmail] = useState<string>(user && user.email ? user.email : ''); // Champ email
    const [firstname, setFirstName] = useState<string>(user && user.firstname ? user.firstname : ''); // Champ firstname
    const [lastname, setLastName] = useState<string>(user && user.lastname ? user.lastname : ''); // Champ lastname

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(e.target.value);
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
    };
    
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    
    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    };
    
    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    };

    // visibilite du mot de passe
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const [passwordVisible2, setPasswordVisible2] = useState<boolean>(false);
    const togglePasswordVisibility2 = () => {
        setPasswordVisible2(!passwordVisible2);
    };

    function handleManageAccountSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // verification
        const form:any = e.currentTarget;
        if (form.checkValidity() === false)
        {
            e.stopPropagation();
        }

        setValidated(true);

        interface PostData {
            login: string;
            password?: string;
            email: string;
            firstname: string;
            lastname: string;
        }

        interface PostDataUpdate extends PostData {
            id: number;
            oldpassword: string;
            newpassword: string;
        }

        let postData: PostData | null = null;

        if (user !== null && user.id !== undefined)
        {
            postData = {
                id: user.id,
                login: login,
                oldpassword: password,
                newpassword: newPassword,
                email: email,
                firstname: firstname,
                lastname: lastname
            } as PostDataUpdate
        }
        else
        {
            postData = {
                login: login,
                password: password,
                email: email,
                firstname: firstname,
                lastname: lastname
            } as PostData
        }

        for (const elem in Object.values(postData))
        {
            // on verifie si tous les elements sont presents
            if (elem === '')
            {
               setMissingData(true);
               break;
            }
        }

        if (!missingData)
        {
            if (user !== null && user.id === undefined && props.action === 'modifier_compte')
            {
                // envoie update pour modification compte
                AxiosTools.put('/users', postData, (response: any) => {
                    if (response.status - 200 < 10)
                    {
                        // reussite
    
                        // toast reussite
                        props.onValidationReceived(1, 'update_compte', null)
                    }
                    else
                    {
                        // echec de la creation de compte
    
                        // toast echec
                        props.onValidationReceived(0, 'update_compte', null)
                    }
                })
            }
            else
            {
                // envoie post pour creation de compte
                AxiosTools.post('/register', postData, (response: any) => {
                    if (response.status - 200 < 10)
                    {
                        // reussite
    
                        // toast reussite
                        props.onValidationReceived(1, 'creation_compte', null)
                    }
                    else
                    {
                        // echec de la creation de compte
    
                        // toast echec
                        props.onValidationReceived(0, 'creation_compte', null)
                    }
                })
            }
        }
    }

    return (
        <div className={style.FormRegister}>
            <h2>
                {
                    user !== null ? 'Modifier compte' : 'Créez votre compte'
                }
            </h2>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleManageAccountSubmit}
            >
                <div className="mb-5">
                    <h4>
                        Identifiants
                    </h4>
                    <Form.Group className="my-4">
                        <Form.Control
                            type="text"
                            placeholder="Login"
                            value={login}
                            onChange={handleLoginChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="my-4">
                        <InputGroup>
                            <Form.Control
                                type={passwordVisible ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder={user && user.id !== undefined ? "Ancien mot de passe" : "Mot de passe"}
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
                    </Form.Group>
                    {
                        user && props.action === 'modifier_compte' ? (
                            <Form.Group className="my-4">
                                <InputGroup>
                                    <Form.Control
                                        type={passwordVisible ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
                                        placeholder="Nouveau mot de passe"
                                        required
                                    />
                                    <InputGroup.Text>
                                        <FontAwesomeIcon
                                            icon={passwordVisible2 ? faEye : faEyeSlash}
                                            onClick={togglePasswordVisibility2}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                        ) : null
                    }
                </div>
                <div className="mt-5">
                    <h4>
                        Informations personnelles
                    </h4>
                    <Form.Group className="my-4">
                        <Form.Control
                            type="text"
                            placeholder="Adresse email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="my-4">
                        <Form.Control
                            type="text"
                            placeholder="Prenom"
                            value={firstname}
                            onChange={handleFirstNameChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="my-4">
                        <Form.Control
                            type="text"
                            placeholder="Nom"
                            value={lastname}
                            onChange={handleLastNameChange}
                            required
                        />
                    </Form.Group>
                    <div className="d-flex flex-row justify-content-around">
                        <Button
                            text="Valider"
                            type="submit"
                        />
                        {
                            user === null || user.id !== undefined ?
                            (
                                <Button
                                    text="Retour"
                                    type="button"
                                    onClick={() => navigate("/")}
                                />
                            )
                            : null
                        }
                    </div>
                </div>
            </Form>
        </div>
    );
}

export default FormRegister