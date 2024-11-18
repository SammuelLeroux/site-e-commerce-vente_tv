import React, { useState } from 'react';

import { NavigateFunction, useNavigate } from 'react-router-dom';

import Button from '../../Button/Button';

import { Toaster, toast } from 'sonner';
import { Form } from 'react-bootstrap';

import { Catalogs } from '../../../utils/Constants';
import AxiosTools from '../../../utils/Axios';

const FormAddCatalog = () => {

    const navigate:NavigateFunction = useNavigate();

    const [validated, setValidated] = useState<boolean>(false);

    const [catalog, setCatalog] = useState<Catalogs>({
        id: 0,
        name: '',
        description: '',
        photo: '',
        price: 0,
        brand: '',
        resolution: '',
        size: '',
        technology: '',
        connectivity: '',
        is_smart_tv: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
      
        setCatalog(prevCatalog => ({
          ...prevCatalog,
          [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setValidated(true);
        
        // verification
        const form:any = e.currentTarget;
        if (!form.checkValidity())
        {
            e.stopPropagation();

            toast.error('Veuillez remplir tous les champs avant de soumettre le formulaire.', {
                position: 'top-right',
                style: {
                    padding: "1em",
                },
                duration: 3000
            });
        }
        else {
            AxiosTools.post('/products', JSON.stringify(catalog), (response: any) => {
                if (response.status - 200 < 10)
                {
                    toast.success('Produit créé avec succès!', {
                        position: 'top-right',
                        style: {
                            padding: "1em"
                        },
                        duration: 3000
                    });
    
                    // redirection la page des form
                    setTimeout(() => {
                        // redirection vers la page des formulaires
                        navigate('/admin');
                        window.location.reload();
                    }, 3000);
                }
                else
                {
                    toast.error('Erreur lors de l\'ajout du produit', {
                        position: 'top-right',
                        style: {
                            padding: "1em"
                        },
                        duration: 3000
                    });
                }
            });
        }
    };

    const handleReturn = () => {
        navigate('/admin');
    }

    return (
        <>
            <Toaster richColors />

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="w-75 m-auto">
                <Form.Group className="my-4" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        name="name"
                        value={catalog.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        placeholder="Enter description"
                        name="description"
                        value={catalog.description}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formPhoto">
                    <Form.Label>Photo</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter photo URL"
                        name="photo"
                        value={catalog.photo}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter price"
                        name="price"
                        value={catalog.price}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formBrand">
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter brand"
                        name="brand"
                        value={catalog.brand}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formResolution">
                    <Form.Label>Resolution</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter resolution"
                        name="resolution"
                        value={catalog.resolution}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formSize">
                    <Form.Label>Size</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter size"
                        name="size"
                        value={catalog.size}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formTechnology">
                    <Form.Label>Technology</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter technology"
                        name="technology"
                        value={catalog.technology}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formConnectivity">
                    <Form.Label>Connectivity</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter connectivity"
                        name="connectivity"
                        value={catalog.connectivity}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formSmartTV">
                    <Form.Check
                        type="checkbox"
                        label="Smart TV"
                        name="is_smart_tv"
                        checked={catalog.is_smart_tv}
                        onChange={handleChange}
                    />
                </Form.Group>
                <div className="d-flex flex-row justify-content-around">
                    <Button
                        type='submit'
                        text='Ajouter'
                    />
                    <Button
                        type='button'
                        text='Retour'
                        onClick={handleReturn}
                    />
                </div>
            </Form>
        </>
    );
};

export default FormAddCatalog;
