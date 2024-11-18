import React from "react";

import { NavigateFunction, useNavigate } from "react-router-dom";

import style from "./ProductCard.module.css"

import { Categories, Catalogs, Orders, Carts, Users } from "../../utils/Constants"

import AxiosTools from "../../utils/Axios";
import Tools from '../../utils/Tools';

import { Card, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';

//fontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

interface ProductCardProps {
    product: Catalogs
}

function ProductCard(props: ProductCardProps) {

    const user: Users | null = Tools.getCookie('user') ? JSON.parse(Tools.getCookie('user')) : null;

    const categories: any[] = [];
    let valuesInLine: any[] = [];

    const catValues:Categories = {
        brand: props.product.brand,
        resolution: props.product.resolution,
        size: props.product.size,
        technology: props.product.technology,
        connectivity: props.product.connectivity,
        is_smart_tv: props.product.is_smart_tv ? "SmartTV" : undefined
    }

    Object.entries(catValues).forEach(([key, value], index, array) => {
        if (value !== undefined) valuesInLine.push(value);
        if (valuesInLine.length === 3 || index === array.length - 1) {
            categories.push(
                <div key={`line-${categories.length}`}>
                    {valuesInLine.map((val, i) => (
                        <React.Fragment key={`${key}-${i}`}>
                            {i > 0 && ' • '}
                            <span>{val}</span>
                        </React.Fragment>
                    ))}
                </div>
            );
            valuesInLine = [];
        }
    });

    const navigate: NavigateFunction = useNavigate();
    const handleDetails = () => {
        navigate(`/info?produit=${props.product.id}`)
    };

    // ajouter au panier
    const handleAddToShop = () => {

        if (!user) {
            return;
        }

        const currentDate = new Date()
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

        let order: Orders = Tools.getCookie("order") ? JSON.parse(Tools.getCookie("order")) : "";
        if (order) {
            // si la liste de produit est vide est vide, on ajoute la date de creation de la commande
            if (order.products && order.products.length === 0)
            {
                const postData: Carts = {
                    idUser: user.id,
                    creationDate: formattedDate,
                    products: []
                }

                // on crée un cart en bdd
                AxiosTools.post('/cart', JSON.stringify(postData), (response: any) => {
                    if (response.status - 200 < 10) {
                        // on edit le cookie
                        Tools.editCookie("order", "creationDate", formattedDate)
                    }
                });
            }

            const updatedProducts: Catalogs[] = [...order.products, props.product];
            
            // on ajoute dans la commande en base de données
            AxiosTools.post(`/carts/${props.product.id}`, JSON.stringify({ products: updatedProducts }), (response: any) => {
                if (response.status - 200 < 10) {
                    // On ajoute le produit à la liste dans le cookie
                    Tools.editCookie("order", "products", updatedProducts);
                }
            });
        }
        else {
            // on crée un cart en base de données
            const postData: Carts = {
                idUser: user.id,
                creationDate: formattedDate,
                products: [props.product]
            }

            // on crée un cart en bdd
            AxiosTools.post('/cart', JSON.stringify(postData), (response: any) => {
                if (response.status - 200 < 10) {
                    // on stocke un cookie
                    Tools.setCookie("order", JSON.stringify({
                        "creationDate": formattedDate,
                        "products": [props.product]
                    }));
                }
            });
        }
    };
    
    return (
        <Card className={style.card}>
            <Card.Img style={{width: "15rem"}} src={props.product.photo ? props.product.photo : ''} alt={props.product.photo ? props.product.photo : ''} />
            <Card.Body>
                <div>
                    <Card.Title>{props.product.name ? props.product.name : ""}</Card.Title>
                    <ListGroup className="my-3" style={{ color:"grey" }}>
                        {categories}
                    </ListGroup>
                </div>
                <div>
                    <span className={style.price}>{props.product.price ? props.product.price : null}</span>
                    <div className="d-flex flex-row justify-content-around mt-3">
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={<Tooltip>Détails</Tooltip>}
                        >
                            <FontAwesomeIcon style={{ cursor: "pointer"}} icon={faCircleInfo} onClick={handleDetails} />
                        </OverlayTrigger>

                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={<Tooltip>Panier</Tooltip>}
                        >
                            <FontAwesomeIcon style={{ cursor: "pointer"}} icon={faCartShopping} onClick={handleAddToShop}/>
                        </OverlayTrigger>
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}

export default ProductCard