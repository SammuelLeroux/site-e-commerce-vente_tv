import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Tools from '../utils/Tools';

import Admin from '../pages/Admin';
import AddItem from '../pages/AddItem';
import Home from '../pages/Home';
import Register from '../pages/Register';
import Recherche from '../pages/Recherche';
import Panier from '../pages/Panier';
import Info from '../pages/Info';
import Payment from '../pages/Payment';
import OrderSuccess from "../pages/OrderSuccess";
import Historic from "../pages/Historic";

const Routing = () => {

    const isUserAuthenticated = Tools.isLogin();

    const isUserAdmin = Tools.isAdmin();

    return (
        <Router>
            <Routes>
                { /* Route par defaut */}
                <Route path="*" element={<Home />} />

                { /* Route publique */ }
                <Route path='/' element={<Home />} />
                <Route path="/recherche" element={<Recherche />} />
                <Route path="/info" element={<Info />} />
                <Route path="/order" element={<Panier />} />
                <Route path="/historic" element={<Historic />} />

                {
                    /* Route publique restreinte */

                    !isUserAuthenticated ? (
                        <>
                            <Route path='/register' element={<Register />} />
                        </>
                    ) : (
                        <Route element={<Navigate to="/" />} />
                    )
                }
                
                {
                    /* Route privée */

                    isUserAuthenticated ? (
                        isUserAdmin ? (
                            <>
                                <Route path='/admin' element={<Admin />} />
                                <Route path='/admin/add' element={<AddItem />} />
                            </>
                        ) : (
                            <>
                                <Route path='/compte' element={<Register action={'modifier_compte'}/>} />
                                <Route path="/commande" element={<Payment />} />
                                <Route path="/success" element={<OrderSuccess />} />
                            </>
                        )
                    ) : (
                        <Route element={<Navigate to="/" />} />
                    )
                }
            </Routes>
        </Router>
    );
};
export default Routing;