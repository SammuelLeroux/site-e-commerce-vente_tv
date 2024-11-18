import React from 'react';
import { useLocation } from 'react-router-dom';

import { Container } from 'react-bootstrap';

import { Catalogs } from '../utils/Constants';

import './styles/Recherche.css';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ProductCard from '../components/ProductCard/ProductCard';

const Recherche:React.FC = () => {
    
    // on recupere les produits de la recherche
    const location = useLocation();
    const data:Catalogs[] = location.state;

    return (
        <div id="container">
            <Header on={1}/>
            <div className="runningBox">
                <Container>
                    <div className='productList'>
                        {
                            data.map((product, index) => <ProductCard key={index} product={product}/>)
                        }
                    </div>
                </Container>
            </div>
            <Footer />
        </div>
    )
}

export default Recherche;