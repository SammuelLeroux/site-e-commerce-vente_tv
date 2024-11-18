import React, { useState, useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import './styles/Info.css'

import { Container, Button } from 'react-bootstrap';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import SimilarList from '../components/SimilarList/SimilarList';

import { Categories, Catalogs } from '../utils/Constants';
import AxiosTools from '../utils/Axios';
import Tools from '../utils/Tools';

//fontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

const Info: React.FC = () => {
    
    const navigate = useNavigate();
    
    const [data, setData] = useState<Catalogs | null>(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const idProduit = searchParams.get('produit');

    // recupérer le produit via api
    useEffect(() => {
        if (!idProduit) {
            navigate('/');
            return;
        }

        AxiosTools.get(`/products/${idProduit}`, (response: any) => {
            if (response.data) setData(response.data);
            else navigate('/');
        });
    }, [idProduit, navigate]);

    const categories: any[] = [];

    const catValues: Categories = {
        resolution: data && data.resolution ? data.resolution : undefined,
        size: data && data.size ? data.size : undefined,
        technology: data && data.technology ? data.technology : undefined,
        connectivity: data && data.connectivity ? data.connectivity : undefined,
        is_smart_tv: data && data.is_smart_tv ? "is_smart_tv" : undefined
    }

    Object.entries(catValues).forEach(([key, value], index) => {
        if (value !== undefined) {
            categories.push(
                <span key={index}>{value} {categories.length !== 4 && ' • '}</span>
            );
        }
    });

    const dateActuelle = new Date();
    const dateFuture = new Date(dateActuelle);
    dateFuture.setDate(dateActuelle.getDate() + 7);

    const jour = String(dateFuture.getDate()).padStart(2, '0');
    const mois = String(dateFuture.getMonth() + 1).padStart(2, '0');
    const annee = dateFuture.getFullYear();
    let livraisonDate = `${jour}/${mois}/${annee}`;

    return (
        <div id="container">
            <div style={{backgroundColor: "#f5f5f5"}}>
                <Header on={1}/>
                <div className="runningBox">
                    <Container className='infoW'>
                        <article className="infofxW">
                            <section className="h-100">
                                <div className="m-auto" style={{ display: "flex", justifyContent: "center" }}>
                                    {
                                        data ? (<img style={{width: "15rem"}} src={data.photo ? data.photo : ''} alt={data.photo ? data.photo : ''} />) : null
                                    }
                                </div>
                            </section>
                            <section>
                                {
                                    data ? (
                                        <>
                                            <h5>{data.brand}</h5>
                                            <h1>{data.name}</h1>
                                            <div className='w-100 my-4'>
                                                {categories}
                                            </div>
                                            <p className="description mb-4">{data.description ? data.description : null}</p>
                                            <div className='priceW'>
                                                <span className='price'>{data.price + "€"}</span>
                                                <div className="multiPaiement">
                                                    Payez en <span className="multiPaiementBadge">4x</span> {data.price / 4} €
                                                </div>
                                            </div>
                                            <div className='disponibilite'>
                                                Dispo web : <span className='stock'>En stock</span>
                                            </div>
                                            <div className='nbProductW'>
                                                <Button variant="secondary" onClick={() => Tools.addProduct(data)}>
                                                    <FontAwesomeIcon icon={faCartShopping} className='me-2'/>
                                                    Ajouter au panier
                                                </Button>
                                            </div>
                                            <div className="deliveryOption">
                                                <div>
                                                    <h5>Vos option de livraison rapide</h5>
                                                    <p>
                                                        En soirée entre 19h et 22h<br />
                                                        Livraison Express possible <span>(Livraison prévue le {livraisonDate} avant 13h)</span>
                                                    </p>
                                                </div>
                                                <div>
                                                    <h5>En plus de la livraison standard</h5>
                                                    <p>
                                                        Livraison en magasin possible <span>(offerte dès 200 euros d'achat)</span><br />
                                                        LIvraison possible en Chrono Relais
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    ) : null
                                }
                            </section>
                        </article>
                        <div></div>
                    </Container>
                </div>
            </div>
            <Container className="mt-5">
                <h5>Produit similaires</h5>
            </Container>
            <SimilarList categories={catValues}/>
            <Footer />
        </div>
    )
}

export default Info;