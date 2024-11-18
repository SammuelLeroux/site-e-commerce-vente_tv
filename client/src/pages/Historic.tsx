import React, { useState, useEffect } from 'react';

import { Container } from 'react-bootstrap';

import './styles/Home.css';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import OrderCard from '../components/OrderCard/OrderCard';

import { Orders } from '../utils/Constants';

import AxiosTools from '../utils/Axios';

const Historic: React.FC = () => {

    const [orders, setOrders] = useState<Orders[]>([])

    
    useEffect(() => {
        AxiosTools.get('/orders', (response: any) => {
            setOrders(response.data);
        })
    }, [orders]);

    return (
        <div id="container">
            <Header on={2}/>
            <div className="runningBox">
                <Container>
                    <div>
                        {
                            orders ? orders.map((order, index) => <OrderCard key={index} order={order} />) : "Vous n'avez jamais fait de commande"
                        }
                    </div>
                </Container>
            </div>
            <Footer />
        </div>
    )
}

export default Historic;