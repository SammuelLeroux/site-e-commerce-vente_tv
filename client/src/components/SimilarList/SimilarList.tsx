import React, { useState, useEffect } from "react";

import style from "./SimilaList.module.css"

import { Container } from "react-bootstrap"

//fontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import ProductCard from "../ProductCard/ProductCard";

import { Catalogs, Categories } from '../../utils/Constants';
import AxiosTools from "../../utils/Axios";

interface SimilarListProps {
    categories: Categories
}

const SimilarList = (props: SimilarListProps) => {

    const [data, setData] = useState<Catalogs[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    /*
    function selectRandomItem(data: Categories): Categories | undefined {
        
        // Filtrer les éléments undefined
        const filteredData:any = data.filter((item: null | undefined) => item !== undefined && item !== null);
    
        // Vérifier s'il reste des éléments après le filtrage
        if (filteredData.length === 0) {
            // Retourner undefined si aucun élément valide n'est trouvé
            return undefined;
        }
    
        // Sélectionner aléatoirement un élément parmi les éléments filtrés
        const randomIndex = Math.floor(Math.random() * filteredData.length);
        const randomItem = filteredData[randomIndex];
    
        // Vérifier si l'élément sélectionné correspond à l'interface Categories
        const categoriesKeys = ['brand', 'resolution', 'size', 'technology', 'connectivity', 'smartTV'];
    
        // Vérifier si toutes les clés de l'interface Categories sont présentes dans l'élément sélectionné
        const isCategoryItem = categoriesKeys.every(key => key in randomItem);
    
        if (isCategoryItem) {
            return randomItem as Categories;
        } else {
            // Retourner undefined si l'élément ne correspond pas à l'interface Categories
            return undefined;
        }
    }
    */

    // requete pour recupérer les items de la meme categorie
    useEffect(() => {
        AxiosTools.get('/products', (response:any) => {
            if(response.status - 200 < 10) setData(response.data.sort(() => Math.random() - 0.5));
        });
    }, []);

    let globalData:Catalogs[][] = [];
    let subData:Catalogs[] = []
    for (let i = 0; i < data.length; i++) {
        if (subData.length === 4) {
            globalData.push(subData);
            subData = [];
        }
        subData.push(data[i]);
    }
    
    // Ajoutez le reste de subData à globalData s'il reste des éléments
    if (subData.length > 0) {
        globalData.push([...subData]);
    }

    const nextSlide = () => {
        setTimeout(() => {
            setCurrentIndex(currentIndex === globalData.length - 1 ? currentIndex : currentIndex + 1);
        }, 350); // Ajoutez la latence souhaitée en millisecondes (500ms dans cet exemple)
    };
    
    const prevSlide = () => {
        setTimeout(() => {
            setCurrentIndex(currentIndex === 0 ? currentIndex : currentIndex - 1);
        }, 350); // Ajoutez la latence souhaitée en millisecondes (500ms dans cet exemple)
    };

    return (
        <Container className={style.listW}>
            <div className={style.arrows}>
                {
                    currentIndex > 0 ? (
                        <FontAwesomeIcon icon={faChevronLeft} className={style.icon} onClick={prevSlide} />
                    ) : null
                }
                {
                    currentIndex < globalData.length - 1 ? (
                        <FontAwesomeIcon icon={faChevronRight} className={style.icon} onClick={nextSlide} />
                    ) : null
                }
            </div>
            <div className={style.similarListW}>
            {
                globalData && globalData[currentIndex] ? (
                    globalData[currentIndex].map((product, index) => (
                        <div key={index} className={`${style.productCard}`}>
                            <ProductCard product={product}/>
                        </div>
                    ))
                ) : null
            }
            </div>
        </Container>
    )
}

export default SimilarList;