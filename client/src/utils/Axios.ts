import axios, { AxiosResponse } from 'axios';

import Tools from './Tools';

export default class AxiosTools
{
    static urlRequested = window.location.protocol + '//' + window.location.hostname + ':8018/api';

    static getHeaderConfig = function () {
        if (Tools.isLogin()) {
            // Retourne la configuration pour l'utilisateur connecté
            return {
                headers: {
                    "Accept": "application/json",
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(Tools.getCookie('token')).token}`
                }
            }
        } else {
            // Retourne la configuration pour l'utilisateur non connecté
            return {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        }
    }
    
    static async post<T>(route: string, postData: unknown, callback: ((response: AxiosResponse<T>) => void) | undefined, config:Object | undefined = undefined)
    {
        try
        {
            const response = await axios.post(AxiosTools.urlRequested + route, postData, config ? config : AxiosTools.getHeaderConfig());
    
            if (callback) callback(response);
        }
        catch (error)
        {
            console.error(error);
        }
    }

    static async get<T>(route: string, callback: (response: AxiosResponse<T>) => void)
    {
        try
        {
            const response = await axios.get<T>(AxiosTools.urlRequested + route, AxiosTools.getHeaderConfig());
    
            if (callback) callback(response);
        }
        catch (error)
        {
            console.error(error);
        }
    }

    static async put<T>(route: string, postData: unknown, callback: (response: AxiosResponse<T>) => void)
    {
        try
        {
            const response = await axios.put<T>(AxiosTools.urlRequested + route, postData, AxiosTools.getHeaderConfig());
    
            if (callback) callback(response);
        }
        catch (error)
        {
            console.error(error);
        }
    }

    static async delete<T>(route: string, callback: (response: AxiosResponse<T>) => void)
    {
        try
        {
            const response = await axios.delete<T>(AxiosTools.urlRequested + route, AxiosTools.getHeaderConfig());
    
            callback(response);
        }
        catch (error)
        {
            console.error(error);
        }
    }
}
