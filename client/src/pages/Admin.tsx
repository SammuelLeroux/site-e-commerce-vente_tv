import React, { useState, useEffect, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import './styles/Admin.css';
import { Container, Table } from 'react-bootstrap';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Button from '../components/Button/Button';
import TableRow from '../components/TableRow/TableRow';

import { Catalogs } from '../utils/Constants';

import AxiosTools from '../utils/Axios';

const Admin: React.FC = () => {

    const navigate = useNavigate();

    const [data, setData] = useState<Catalogs[]>([]);
    const [tbody, setTbody] = useState<any[] | null>(null);

    useEffect(() => {
        AxiosTools.get('/products', (response: any) => {
            setData(response.data);
        })
    }, []);

    const handleUpdateProduct = useCallback((updatedItem: Catalogs) => {
        const newData = data.map(item => (item.id === updatedItem.id ? updatedItem : item));
        setData(newData);
    }, [data]);

    const handleDeleteProduct = useCallback((id: number) => {
        // Filtrer les données pour supprimer l'élément avec l'ID spécifié
        AxiosTools.delete(`/products/${id}`, (response: any) => {
            if (response.status - 200 < 10)
            {
                const newData = data.filter(item => item.id !== id);
                setData(newData);
            }
        } );
    }, [data]);

    useEffect(() => {  
        if (data) {
            const tab = data.map(item => (
                <TableRow
                    key={item.id}
                    item={item}
                    handleDeleteProduct={() => handleDeleteProduct(item.id)}
                    handleUpdateProduct={() => handleUpdateProduct}
                />
            ));

            if (tab) setTbody(tab);
        }
    }, [data, handleDeleteProduct, handleUpdateProduct]);

    const handleAddProduct = () => {
        navigate('add');
    }

    const handleHome = () => {
        navigate('/');
    }

    return (
        <div id="container">
            <Header on={2}/>
            <div className="runningBox">
                <Container fluid>
                    <div className='d-flex justify-content-end mx-3 mb-3 gap-3'>
                        <Button
                            text='Ajouter'
                            type='button'
                            onClick={handleAddProduct}
                        />
                        <Button
                            text='Acceuil'
                            type='button'
                            onClick={handleHome}
                        />
                    </div>
                    <Table striped bordered responsive>
                        <thead className="sticky-top text-center" style={{ zIndex: 1, background: 'white', top: '0' }}>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Photo</th>
                                <th>Price</th>
                                <th>Brand</th>
                                <th>Resolution</th>
                                <th>Size</th>
                                <th>Technology</th>
                                <th>Connectivity</th>
                                <th>SmartTV</th>
                                <th>Update</th>
                            </tr>
                        </thead>
                        <tbody style={{ overflowY: 'auto', maxHeight: '500px' }}>
                            {tbody}
                        </tbody>
                    </Table>
                </Container>
            </div>
            <Footer />
        </div>
    )
}

export default Admin;