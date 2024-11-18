import React from "react";

import { useNavigate } from 'react-router-dom'

import { Card } from 'react-bootstrap';
import Button from '../Button/Button';

import { Orders } from '../../utils/Constants';

interface OrderCardProps {
    order: Orders
}

const OrderCard = (props: OrderCardProps) => {

    const order = props.order;

    const navigate = useNavigate();

    return (
        <Card>
            <Card.Header as="h6">{order.creationDate}</Card.Header>
            <Card.Body>
                <Card.Title>{"Commande numéro " + order.id}</Card.Title>
                <Card.Text>
                    {order.products.map((product) => <li key={product.id}>• {product.name} - {product.price} €</li>)}
                </Card.Text>
                <div className="d-flex justify-content-center">
                    <Button
                        type='button'
                        text="Voir plus"
                        onClick={() => navigate('/info-command/' + order.id)}
                    />
                </div>
            </Card.Body>
        </Card>
    )
}

export default OrderCard;