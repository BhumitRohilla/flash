class FlashClass {
    /**
     * 
     * @param {any} req 
     * @param {any} res 
     * @param {{cookieName: string, cookieConfig: {path: string, domain: string, httpOnly: boolean}}} config 
     */
    constructor (req, res, config) {
        this._message = req?.cookies?.message ?? '';
        this._isClear = false;
        this._req = req;
        this._res = res;
        this._cookieConfig = config.cookieConfig
        this._cokieName = config.cookieName;
        if (this._message) {
            try {
                this._message = JSON.parse(req.cookies[this._cokieName]);
            } catch (error) {
                this._message = '';
            }
        }
        this.clearCookie = ((req) => {
            return () => {
                if(this._isClear) {
                    return ;
                }
                this._isClear = true;
                this._res.clearCookie('message',this._cookieConfig);
            }
        })();
    }
    insert(type, message) {
        if(req._flash?.[type]) {
            req._flash[type].push(message);
        }
        this._req.cookie(this._cokieName, this._cookieConfig);
    }
    get message () {
        this.clearCookie();
        return {...this._message};
    }

    get error () {
        const message = this.message;
        return message?.error;
    }

    get success () {
        const mesaage = this.message;
        return mesaage?.success;
    }

    get info () {
        const message = this.message;
        return message?.info;
    }
}

/**
 * 
 * @param {{cookieName: string, cookieConfig: {path: string, domain: string, httpOnly: boolean}}} config 
 * @returns 
 */
module.exports = (config) => {
    if (!config.cookieConfig || !config.cookieName)  {
        throw new Error('Config is not valid');
    }
    return (req, res, next) => {
        req.session = req?.session ?? {};
        req._flash = {};
        const flash = new FlashClass(req, res, config);
        req._flash = flash;
        req.flash = flash.insert;
        res.locals.messages = flash;
        next();
    }
}