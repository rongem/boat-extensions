import express from 'express';
import { syncContracts, syncDeliverables } from '../controllers/sync.controller';
import { body } from 'express-validator'
import { validate } from './validator';
import { getAuthorization } from '../controllers/authentication.controller';

const router = express.Router();

const dateParser = (value: string) => {
    if (value.includes('T')) {
        value = value.split('T')[0];
    }
    let dateParts = value.split('-');
    if (dateParts[0].length === 2 && dateParts[2].length === 4) {
        dateParts = dateParts.reverse();
    }
    const date = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2], 1);
    return date;
}

router.post('/contracts', [
    body().isArray({min: 1}).withMessage('Kein Array von Verträgen übergeben').bail().toArray(),
    body('*.id', 'Keine gültige ID vorhanden').if(body().isArray({min: 1}))
        .isInt({min: 1, max: 100000}).bail().toInt(),
    body('*.description', 'Beschreibung fehlt').if(body().isArray({min: 1}))
        .isString().bail().trim()
        .isLength({min: 1, max: 200}).withMessage('Mindestlänge: 1, Maximallänge: 200'),
    body('*.start', 'Falsches StartDatum').if(body().isArray({min: 1}))
        .custom(value => !!Date.parse(value)).bail().customSanitizer(dateParser),
    body('*.end', 'Falsches Endedatum').if(body().isArray({min: 1}))
        .customSanitizer(dateParser),
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
    body('*.budgets', 'Keine Preisstufen angegeben').if(body().isArray({min: 1}))
        .isArray({min: 1}).toArray(),
    body('*.budgets.*.priceCategoryId', 'Fehlende Id für die Preisstufe').if(body().isArray({min: 1}))
        .isInt({min: 1}).bail().toInt(),
    body('*.budgets.*.priceCategory', 'Fehlender Name für die Preiskategorie').if(body().isArray({min: 1}))
        .isString().bail().trim()
        .isLength({min: 1, max: 50}).withMessage('Mindestlänge: 1, Maximallänge: 50'),
    body('*.budgets.*.pricePerUnit', 'Fehlender Preis für die Preiskategorie').if(body().isArray({min: 1}))
        .isFloat({min: 1}).bail().toFloat(),
    body('*.budgets.*.availableUnits', 'Fehlende Anzahl von Personentagen für die Preiskategorie').if(body().isArray({min: 1}))
        .isFloat({min: 1}).bail().toFloat(),
    body('*.budgets.*.minutesPerDay', 'Fehlende Arbeitstaglänge').if(body().isArray({min: 1}))
        .isFloat({min: 1}).bail().toFloat(),
], validate, syncContracts);

router.post('/deliverables', [
    body().isArray({min: 0}).withMessage('Kein Array von Leistungszeiten übergeben').bail().toArray(),
    body('*.id', 'Fehlende oder falsche Id').if(body().isArray({min: 1}))
        .isInt({min: 1}).bail().toInt(),
    body('*.version', 'Fehlende oder falsche Version').if(body().isArray({min: 1}))
        .isInt({min: 0}).bail().toInt(),
    body('*.contract', 'Fehlender oder falscher Vertrag').if(body().isArray({min: 1}))
        .isInt({min: 1}).bail().toInt(),
    body('*.date', 'Fehlendes oder falsches Datum').if(body().isArray({min: 1}))
        .custom(value => !!Date.parse(value)).bail().customSanitizer(dateParser),
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
    body('*.person', 'Falscher Datentyp für Person').if(body().isArray({min: 1}))
        .optional({checkFalsy: true})
        .isString().trim()
        .isLength({min: 1, max: 100}).withMessage('Person hat die falsche Länge'),
    body('*.text', 'Falscher Datentyp für Text').if(body().isArray({min: 1}))
        .optional({checkFalsy: true})
        .isString().trim()
        .isLength({min: 1, max: 1000}).withMessage('Text hat die falsche Länge'),
    body('*.startTime', 'Falscher Datentyp für startTime').if(body().isArray({min: 1}))
        .optional({checkFalsy: true})
        .isString().trim()
        .isLength({min: 8, max: 8}).withMessage('startTime hat die falsche Länge')
        .custom(value => new RegExp('^[0-9]{2}:[0-9]{2}(:[0-9]{2})?').test(value)).withMessage('startTime ist keine gültige Uhrzeit')
        .customSanitizer((value: string) => value.substring(0, 5)),
    body('*.endTime', 'Falscher Datentyp für endTime').if(body().isArray({min: 1}))
        .optional({checkFalsy: true})
        .isString().trim()
        .isLength({min: 8, max: 8}).withMessage('endTime hat die falsche Länge')
        .custom(value => new RegExp('^[0-9]{2}:[0-9]{2}(:[0-9]{2})?').test(value)).withMessage('endTime ist keine gültige Uhrzeit')
        .customSanitizer((value: string) => value.substring(0, 5)),
], validate, syncDeliverables);

router.get('/auth', getAuthorization);

export default router;
