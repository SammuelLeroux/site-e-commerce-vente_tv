import { Users, Orders, Catalogs } from './Constants'

export default class Tools {

    static getCookie = (name: string) => {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies)
        {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name)
            {
                return decodeURIComponent(cookieValue);
            }
        }
        return '';
    };

    static setCookie = (name: string, item: string) => {

        //  creation d'un cookie
        let now: Date  = new Date();
        let time: number = now.getTime();
        let expireTime: number = time + 1000*36000;
        now.setTime(expireTime);
        document.cookie = `${name}=${item};expires=${now.toUTCString()}; path=/;SameSite=Lax`;

        // Déclencher l'événement de changement de cookie
        Tools.triggerCookieChangeEvent();
    }

    static editCookie = (cookieName: string, key: string, value: any) => {
        // Récupérer l'objet du cookie
        const currentObjectString = Tools.getCookie(cookieName);
        const currentObject = currentObjectString ? JSON.parse(currentObjectString) : {};
    
        // Ajouter le nouvel élément à l'objet
        currentObject[key] = value;
    
        // Convertir l'objet en chaîne JSON et définir le cookie avec la nouvelle valeur
        Tools.setCookie(cookieName, JSON.stringify(currentObject));

        // Déclencher l'événement de changement de cookie
        Tools.triggerCookieChangeEvent();
    }

    static addProduct = (product: Catalogs) => {

        const currentDate = new Date()
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

        let order: Orders = Tools.getCookie("order") ? JSON.parse(Tools.getCookie("order")) : "";
        if (order) {
            // if (!order.products.find(product => product.id === props.product.id)) {
                // si la liste de produit est vide est vide, on ajoute la date de creation de la commande
                if (order.products && order.products.length === 0)
                {
                    Tools.editCookie("order", "creationDate", formattedDate)
                }
                
                // On ajoute le produit à la liste
                const updatedProducts: Catalogs[] = [...order.products, product];
                Tools.editCookie("order", "products", updatedProducts);
            // }
        }
        else {
            Tools.setCookie("order", JSON.stringify({
                "creationDate": formattedDate,
                "products": [product]
            }));
        }
    };

    static triggerCookieChangeEvent = () => {
        const cookieChangeEvent = new Event('cookieChange');
        window.dispatchEvent(cookieChangeEvent);
    }
    
    static deleteCookie = (name: string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;

        // Déclencher l'événement de changement de cookie
        Tools.triggerCookieChangeEvent();
    }

    static deleteAllCookies = () => {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [cookieName] = cookie.trim().split('=');
            
            // Delete each cookie by setting its expiration date to the past
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;

            // Déclencher l'événement de changement de cookie
            Tools.triggerCookieChangeEvent();
        }
    };

    static isLogin = () => {
        let user: Users | null = Tools.getCookie('user') ? JSON.parse(Tools.getCookie('user')) : null;
        if (user !== null) return true;
        else return false;
    };

    static isAdmin = () => {
        if (Tools.isLogin())
        {
            let user: Users | null = Tools.getCookie('user') ? JSON.parse(Tools.getCookie('user')) : null;
            if (user && user.roles.includes("ROLE_ADMIN")) return true;
        }
        
        return false;
    }
}