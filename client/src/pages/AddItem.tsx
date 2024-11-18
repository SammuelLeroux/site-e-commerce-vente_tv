import React from 'react';

import { Container } from 'react-bootstrap';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import FormAddCatalog from '../components/Form/FormAddCatalog/FormAddCatalog';

const AddItem: React.FC = () => {

    return (
        <div id="container">
            <Header on={2} />
            <div className="runningBox">
                <Container>
                    <h1 className="text-center my-3">Ajouter un produit</h1>
                    <FormAddCatalog />
                </Container>
            </div>
            <Footer />
        </div>
    )
}

export default AddItem;