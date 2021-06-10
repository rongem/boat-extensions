import express from 'express';
import { syncContracts, syncDeliverables } from '../controllers/sync.controller';
import { body } from 'express-validator'
import { validate } from './validator';

const router = express.Router();

router.post('/contracts', [
    body().isArray({min: 1}).withMessage('Kein Array von Verträgen übergeben').bail().toArray(),
    body('*.id', 'Keine gültige ID vorhanden').if(body().isArray({min: 1}))
        .isInt({min: 1, max: 100000}).bail().toInt(),
    body('*.description', 'Beschreibung fehlt').if(body().isArray({min: 1}))
        .isString().bail().trim()
        .isLength({min: 1, max: 200}).withMessage('Mindestlänge: 1, Maximallänge: 200'),
    body('*.start', 'Falsches StartDatum').if(body().isArray({min: 1}))
        .custom(value => !!Date.parse(value)).bail().toDate(),
    body('*.end', 'Falsches Endedatum').if(body().isArray({min: 1}))
        .custom(value => !!Date.parse(value)).bail().toDate(),
    body('*', 'Startdatum darf nicht größer sein als Endedatum').if(body().isArray({min: 1})).
        custom(value => Date.parse(value.start) < Date.parse(value.end)),
    body('*.organization', 'Organisation ist falsch').if(body().isArray({min: 1}))
        .isString().bail().trim()
        .isLength({min: 1, max: 50}).withMessage('Mindestlänge: 1, Maximallänge: 50'),
    body('*.organizationalUnit', 'Organisationseinheit ist falsch').if(body().isArray({min: 1}))
        .isString().bail().trim()
        .isLength({min: 1, max: 20}).withMessage('Mindestlänge: 1, Maximallänge: 20'),
    body('*.responsiblePerson', 'Falsche oder fehlende Verantwortliche').if(body().isArray({min: 1}))
        .isString().bail().trim()
        .isLength({min: 1, max: 50}).withMessage('Mindestlänge: 1, Maximallänge: 50'),
    body('*.budget', 'Keine Preisstufen angegeben').if(body().isArray({min: 1}))
        .isArray({min: 1}).toArray(),
    body('*.budget.*.priceCategoryId', 'Fehlende Id für die Preisstufe').if(body().isArray({min: 1}))
        .isInt({min: 1}).bail().toInt(),
    body('*.budget.*.priceCategory', 'Fehlender Name für die Preiskategorie').if(body().isArray({min: 1}))
        .isString().bail().trim()
        .isLength({min: 1, max: 50}).withMessage('Mindestlänge: 1, Maximallänge: 50'),
    body('*.budget.*.pricePerUnit', 'Fehlender Preis für die Preiskategorie').if(body().isArray({min: 1}))
        .isFloat({min: 1}).bail().toFloat()
        .custom(value => value > 1),
    body('*.budget.*.availableUnits', 'Fehlende Anzahl von Personentagen für die Preiskategorie').if(body().isArray({min: 1}))
        .isFloat({min: 1}).bail().toFloat(),
    body('*.budget.*.minutesPerDay', 'Fehlende Arbeitstaglänge').if(body().isArray({min: 1}))
        .isFloat({min: 1}).bail().toFloat()
        .custom(value => value > 1),
], validate, syncContracts);

router.post('/deliverables', [
    body().isArray({min: 0}).withMessage('Kein Array von Leistungszeiten übergeben').bail().toArray(),
    body('*.id', 'Fehlende oder falsche Id').if(body().isArray({min: 1}))
        .isInt({min: 1}).bail().toInt(),
    body('*.version', 'Fehlende oder falsche Version').if(body().isArray({min: 1}))
        .isInt({min: 1}).bail().toInt(),
    body('*.contract', 'Fehlender oder falscher Vertrag').if(body().isArray({min: 1}))
        .isInt({min: 1}).bail().toInt(),
    body('*.date', 'Fehlendes oder falsches Datum').if(body().isArray({min: 1}))
        .custom(value => !!Date.parse(value)).bail().toDate(),
    body('*.duration', 'Fehlende oder falsche Anzahl von PT').if(body().isArray({min: 1}))
        .isDecimal({blacklisted_chars: '-'}).bail().toFloat()
        .custom(value => value > 0),
    body('*.key', 'Falscher Datentyp für Schlüssel').if(body().isArray({min: 1}))
        .optional({checkFalsy: true})
        .isString().trim()
        .isLength({min: 18, max: 18}).withMessage('Schlüssel hat die falsche Länge')
        .custom(value => new RegExp('^[0-9]{15}[A-Z]{3}').test(value)).withMessage('Schlüssel entspricht nicht den Vorgaben'),
    body('*.priceCategoryId', 'Fehlende oder falsche Preiskategorie').if(body().isArray({min: 1}))
        .isInt({min: 1}).bail().toInt(),
], validate, syncDeliverables);

export default router;
