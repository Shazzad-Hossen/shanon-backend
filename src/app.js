const express = require('express');
const settings = require('../settings');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const form = require('express-form-data');
const http= require('node:http');
// import http2 from 'node:https';
const path= require('node:path');
const setvices = require('./services/index');
const crypto = require('./utils/crypto');
const cors= require('cors');

class App {
    constructor({ deps }) {
        this.deps = deps;
        this.express=express();
        this.config=settings;
        this.crypto=crypto;
        this.router= new express.Router();

    }


    async start() {
        //load midlewares
        this.express.use(
            cors({
              origin: this.config.origin,
              credentials: true
            }));
        this.express.use(morgan('common'));
        this.express.use(express.json());
        this.express.use(cookieParser());
        this.express.use(form.parse());
        this.express.use('/api', this.router);
      


        //load all dependencies
        if (this.deps) {
            await Promise.all(
                this.deps.map(async (dep) => {
                    try {
                        const res = await dep.method(...dep.args);
                        console.log(res);
                    } catch (error) {
                        console.error(`${dep.method.name} failed:`, error);
                        throw error;
                    }
                })
            );
        }


        //load static pages
        this.express.use(express.static(path.resolve(process.cwd(), 'client')));
        //create server
        this.server= http.createServer(this.express);
        setvices(this)

        this.listen()

    }

    configure(callback) {
        callback.call({
          ...this.express,
          route: this.router,
          crypto: this.crypto,
          settings: this.config,
          fileUp:this.fileUp
        });
      }


    listen(){
        this.express.get('*', (req, res) => {
            res.sendFile(path.resolve(process.cwd(), '..', 'client', 'index.html'));
          });
          
        this.server.listen(this.config.PORT,async()=>{
            console.log(`=> Listening on ${this.config.PORT}`);
        })

    }
}


module.exports = App