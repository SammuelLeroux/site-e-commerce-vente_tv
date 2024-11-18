import React, { useState, useEffect } from 'react';

import { Container } from 'react-bootstrap';

import './styles/Home.css';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ProductCard from '../components/ProductCard/ProductCard';

import { Catalogs } from '../utils/Constants';

import AxiosTools from '../utils/Axios';

const Home: React.FC = () => {

    const [products, setProducts] = useState<Catalogs[] | undefined>();

    useEffect(() => {
        let isMounted = true;
    
        AxiosTools.get('/products', (response:any) => {
            if (isMounted) {
                setProducts(response.data);
            }
        });
    
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div id="container">
            <Header on={1}/>
            <div className="runningBox">
                <Container>
                    <div className='productList'>
                        {
                            products ? products.map((product, index) => <ProductCard key={index} product={product}/>) : "Il n'y a pas de produit en vente sur le site"
                        }
                    </div>
                </Container>
            </div>
            <Footer />
        </div>
    )
}

export default Home;