import React, { useState, ChangeEvent } from "react";

import { NavigateFunction, useNavigate } from 'react-router-dom';

import style from './FormSearch.module.css';

import Button from '../../Button/Button';

import { Form } from 'react-bootstrap'

import AxiosTools from '../../../utils/Axios';

function FormSearch() {

    const navigate: NavigateFunction = useNavigate();
    
    const [marque, setMarque] = useState<string>('');
    const [prix, setPrix] = useState<number>(0);
    const [resolution, setResolution] = useState<string>('');
    const [taille, setTaille] = useState<string>('');
    const [technologie, setTechnologie] = useState<string>('');
    const [connectivite, setConnectivite] = useState<string>('');
    const [smartTV, setSmartTV] = useState<string>('');

    const handleMarqueChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMarque(e.target.value);
    };

    const handlePrixChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPrix(parseFloat(e.target.value));
    };

    const handleResolutionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setResolution(e.target.value);
    };

    const handleTailleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTaille(e.target.value);
    };

    const handleTechnologieChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTechnologie(e.target.value);
    };

    const handleConnectiviteChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConnectivite(e.target.value);
    };

    const handleSmartTVChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSmartTV(e.target.value);
    };


    const [validated, setValidated] = useState<boolean>(false);
    const [missingData, setMissingData] = useState<boolean>(false);
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // verification
        const form:any = e.currentTarget;
        if (form.checkValidity() === false)
        {
            e.stopPropagation();
        }

        setValidated(true);

        interface PostData {
            marque: string;
            prix: number;
            resolution: string;
            taille: string;
            technologie: string;
            connectivite: string;
            smartTV: boolean;
        }

        let postData:PostData = {
            marque: marque,
            prix: prix,
            resolution: resolution,
            taille: taille,
            technologie: technologie,
            connectivite: connectivite,
            smartTV: (smartTV === "smartTV" ? true : false)
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
            // envoie post pour la recherche
            AxiosTools.post('/products', JSON.stringify(postData), (response: any) => {
                if (response.status - 200 < 10)
                {
                    // reussite

                    // redirection vers la page recherche avec mappage des resultats
                    navigate("/recherche", {
                        state: response.data,
                    });
                }
            })
        }
    };

    return (
        <Form
            noValidate
            validated={validated}
            className={style.formSearch}
        >
            <Form.Group className={style.inputW}>
                <Form.Control value={marque} onChange={handleMarqueChange} className={style.inputSearch} type="text" placeholder="Marque" />
                <Form.Control value={prix} onChange={handlePrixChange} className={style.inputSearch} type="number" placeholder="Prix" />
            </Form.Group>
            <Form.Group className={style.inputW}>
                <Form.Control value={resolution} onChange={handleResolutionChange} className={style.inputSearch} type="text" placeholder="Résolution" />
                <Form.Control value={taille} onChange={handleTailleChange} className={style.inputSearch} type="text" placeholder="Taille écran" />
            </Form.Group>
            <Form.Group className={style.inputW}>
                <Form.Control value={technologie} onChange={handleTechnologieChange} className={style.inputSearch} type="text" placeholder="Technologie d'affichage" />
                <Form.Control value={connectivite} onChange={handleConnectiviteChange} className={style.inputSearch} type="text" placeholder="Connectivité" />
            </Form.Group>
            <Form.Group className={style.inputW}>
                <Form.Select className={style.inputSearch} value={smartTV} onChange={handleSmartTVChange}>
                    <option value="smartTv">Smart TV</option>
                    <option value="noSmartTv" selected>no Smart TV</option>
                </Form.Select>
            </Form.Group>

            <Button
                text="Rechercher"
                type="submit"
                style={{width: '50%', margin: 'auto'}}
                onClick={handleSearch}
            />
        </Form>
    )
}

export default FormSearch;