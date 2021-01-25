const express = require('express');
const router = express.Router();
const Storage = require('../Storage');

// CONSULTAS

router.all('/info', (req, res) => {

    var filters = {
        city: req.body.city,
        type: req.body.type,
        min: req.body.min,
        max: req.body.max,
        isFilter: req.body.isFilter
    }
    var { city, type, min, max, isFilter } = filters;

    if(isFilter){
        Storage.getData().then((data) => {


            var clean = () => {
                var parsed = JSON.parse(data);
                var nuevosDatos = [];
                for(let i = 0; i < parsed.length; i++){
                    parsed[i]['priceInt'] = Number(parsed[i].Precio.replace("$", "").replace(",", ""));
                    nuevosDatos.push(parsed[i]);
                }
                return nuevosDatos;
            }



            var parsed = clean();
            if(city.length > 0 && type.length == 0){
                let filtered = parsed.filter(content => {
                    return content.Ciudad == city && content.priceInt >= min && content.priceInt <= max
                })
                res.json(filtered);
            }
            else if(type.length > 0 && city.length == 0){
                let filtered = parsed.filter(content => {
                    return content.Tipo == type && content.priceInt >= min && content.priceInt <= max
                })
                res.json(filtered);
            }
            else if(city.length > 0 && type.length > 0){
                let filtered = parsed.filter(content => {
                    return content.Ciudad == city && content.Tipo == type && content.priceInt >= min && content.priceInt <= max
                })
                res.json(filtered);
            }
            else{
                let filtered = parsed.filter(content => {
                    return content.priceInt >= min && content.priceInt <= max
                })
                res.json(filtered);
            }



        }).catch((err) => {
            res.status(500).json(err)
        })
    }
    else{
        Storage.getData().then((data) => {
            res.json(JSON.parse(data));
        }).catch((err) => {
            res.status(500).json(err)
        })
    }
})

module.exports = router;