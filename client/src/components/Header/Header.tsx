import React, { useState, useEffect } from "react";

// router
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

// style
import style from './Header.module.css';

// composants
import FormLogin from '../Form/FormLogin/FormLogin';
import FormSearch from '../Form/FormSearch/FormSearch';

// boostrap
import { Container, Nav, Navbar, Form, InputGroup } from 'react-bootstrap';

//fontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserTie, faCartShopping, faClockRotateLeft, faPowerOff, faSearch, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import { Users, Orders } from '../../utils/Constants';
import Tools from '../../utils/Tools';

import { Toaster, toast } from 'sonner';

interface HeaderProps {
    on: number;
}

function Header(props: HeaderProps) {
    
    const user: Users | null = Tools.getCookie('user') ? JSON.parse(Tools.getCookie('user')) : null;

    const isUserAdmin = Tools.isAdmin();

    const [order, setOrder] = useState<Orders | null>(Tools.getCookie('order') ? JSON.parse(Tools.getCookie('order')) : null)
    const [nbProductsOrder, setNbProductsOrder] = useState<number>(0);

    useEffect(() => {
        const handleCookieChange = () => {
            const cookieOrder: Orders = JSON.parse(Tools.getCookie('order'));
            setOrder(cookieOrder);
        };
    
        // Écouter l'événement de changement de cookie
        window.addEventListener('cookieChange', handleCookieChange);
    
        // Nettoyer l'écouteur d'événement lorsque le composant est démonté
        return () => {
            window.removeEventListener('cookieChange', handleCookieChange);
        };
    }, []);

    useEffect(() => {
        if (order) setNbProductsOrder(order.products ? order.products.length : 0);
    }, [order]);

    const navigate: NavigateFunction = useNavigate();

    // connexion
    const [showLogin, setShowLogin] = useState<boolean>(false);
    const openLogin = () => setShowLogin(true);
    const closeLogin = () => setShowLogin(false);

    // recherche avancée
    const [showAdvancedResearch, setOpenSearch] = useState(false);
    const handleDropdownSearch = () => setOpenSearch(!showAdvancedResearch);

    const onValidationReceived = (success: number, action: string, item: Object) => {
        if (success === 1)
        {
            // creation cookie user
            const user: string = JSON.stringify(item);
            Tools.setCookie('user', user);

            // redirection vers la page d'acceuil
            if (window.location.pathname !== "/") navigate('/');
            window.location.reload();
        }
        else
        {
            toast.error('Pseudo ou Mot de passe incorrect!', {
                position: 'top-right',
                style: {
                    background: 'red',
                    color: 'white',
                    zIndex: 100000
                },
                duration: 3000
            });
        }
    }

    // modifier son compte
    const handleUpdateAccount = () => {
        navigate('/compte');
    };

    // deconnexion
    const handleLogOut = () => {

        // suppression de tous les cookies
        Tools.deleteAllCookies();

        navigate('/');
        window.location.reload();
    }

    // catalog
    let catalog = ["Petit prix", "Grand écran", "Haute résolution", "Smart TV"]

    let items = [];
    for (let number = 0; number < catalog.length; number++) {
        items.push(
            <li
                key={number + 1}
            >
                {catalog[number]}
            </li>,
        );
    }

    items.push(
        <li
            key={catalog.length + 1}
            className="ms-3 rounded-5 d-flex flex-row align-items-center"
            onClick={handleDropdownSearch}
        >
            <span className="d-inline me-3">Recherche avancée</span>
            <FontAwesomeIcon icon={!showAdvancedResearch ? faChevronDown : faChevronUp}/>
        </li>
    )

    return (
        <div className="d-flex flex-column">
            <Toaster richColors />
            {
                showLogin ? (
                    <div className={style.loginW} style={{ zIndex: showLogin ? 2 : 1, opacity: showLogin ? 1 : 0 }}>
                        {showLogin && <FormLogin onClose={closeLogin} onValidationReceived={onValidationReceived} />}
                    </div>
                ) : null
            }
            
            <header className={style.header}>
                <Navbar expand="lg" className="h-auto">
                    <Container fluid className='mx-5 my-3 d-flex flex-row justify-content-between align-items-center'>
                        <Navbar.Brand>
                            <Link className="nav-link" to="/" style={{color: 'white'}}>
                                @e-Commerce
                            </Link>
                        </Navbar.Brand>
                        {
                            props.on === 1 || props.on === 2 ? (
                                <>
                                    <div className="d-flex justify-content-center align-items-center flex-grow-1 mt-1 ms-5">
                                        {
                                            props.on !== 2 ? (
                                                <InputGroup className="w-75">
                                                    <Form.Control
                                                        placeholder="Rechercher un produit"
                                                    />
                                                    <InputGroup.Text>
                                                        <FontAwesomeIcon icon={faSearch}/>
                                                    </InputGroup.Text>
                                                </InputGroup>
                                            ) : null
                                        }
                                    </div>
                                    <div>
                                        <Nav
                                        className="my-2 my-lg-0"
                                        style={{ maxHeight: '100px', width: '100%' }}
                                        >
                                            <div className='connectedBtn'>
                                                <Nav.Link
                                                    onClick={
                                                        user === null ? openLogin : handleUpdateAccount
                                                    }
                                                >
                                                    <FontAwesomeIcon icon={faUser} style={{color: 'white'}}/>
                                                </Nav.Link>
                                                {
                                                    user !== null  && isUserAdmin ? (
                                                        <Nav.Link href="/admin">
                                                            <FontAwesomeIcon icon={faUserTie} style={{color: "white"}} />
                                                        </Nav.Link>
                                                    ) : null
                                                }
                                                {
                                                    user !== null ? (
                                                        <Nav.Link href="/historic">
                                                            <FontAwesomeIcon icon={faClockRotateLeft} style={{color: 'white'}}/>
                                                        </Nav.Link>
                                                    ) : null
                                                }
                                                <Nav.Link href="/order" style={{
                                                    position: "relative",
                                                }}>
                                                    <FontAwesomeIcon icon={faCartShopping} style={{color: 'white'}}/>
                                                    <div className={style.shopNotice}>
                                                        {nbProductsOrder}
                                                    </div>
                                                </Nav.Link>
                                                {
                                                    user !== null ? (
                                                    <Nav.Link
                                                        onClick={handleLogOut}
                                                    >
                                                        <FontAwesomeIcon icon={faPowerOff} style={{color: '#F72585'}} />
                                                    </Nav.Link>) : null
                                                }
                                            </div>
                                        </Nav>
                                    </div>
                                </>
                            ) : null
                        }
                    </Container>
                </Navbar>
            </header>
            {
                props.on === 1 ? (
                    <div className={style.paginationW}>
                        <div className={style.pagination} style={{margin: "0 !important"}}>
                            {items}
                        </div>
                    </div>
                ) : null
            }

            { showAdvancedResearch && props.on === 1? (
                <div className={style.formSearchOverlay}>
                    <FormSearch /*onValidationReceived={onValidationReceived}*/ />
                </div>
                ) : null
            }
        </div>
    )
}

export default Header;