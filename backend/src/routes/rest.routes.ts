import express from 'express';
import { syncContracts, syncDeliverables } from '../controllers/sync.controller';
import { body } from 'express-validator'

const router = express.Router();

router.post('/contracts', [
    body().isArray({min: 1}).withMessage('Kein Array von Verträgen übergeben').bail().toArray(),
    body('*.id', 'Keine gültige ID vorhanden').isInt({min: 1, max: 100000}).bail().toInt(),
    body('*.description', 'Beschreibung fehlt').isString().bail().trim()
        .isLength({min: 1, max: 200}).withMessage('Mindestlänge: 1, Maximallänge: 200'),
    body('*.start', 'Falsches StartDatum').isDate().bail().toDate(),
    body('*.end', 'Falsches Endedatum').isDate().bail().toDate(),
    body('*', 'Startdatum darf nicht größer sein als Endedatum').custom(value => value.start < value.end),
    body('*.organization', 'Organisation ist falsch').isString().bail().trim()
        .isLength({min: 1, max: 50}).withMessage('Mindestlänge: 1, Maximallänge: 50'),
    body('*.organizationalUnit', 'Organisationseinheit ist falsch').isString().bail().trim()
        .isLength({min: 1, max: 20}).withMessage('Mindestlänge: 1, Maximallänge: 20'),
    body('*.responsiblePerson', 'Falsche oder fehlende Verantwortliche').isString().bail().trim()
        .isLength({min: 1, max: 50}).withMessage('Mindestlänge: 1, Maximallänge: 50'),
    body('*.budget', 'Keine Preisstufen angegeben').isArray({min: 1}).toArray(),
    body('*.budget.*.priceCategoryId', 'Fehlende Id für die Preisstufe').isInt({min: 1}).bail().toInt(),
    body('*.budget.*.priceCategory', 'Fehlender Name für die Preiskategorie').isString().bail().trim()
        .isLength({min: 1, max: 50}).withMessage('Mindestlänge: 1, Maximallänge: 50'),
    body('*.budget.*.pricePerUnit', 'Fehlender Preis für die Preiskategorie').isDecimal({blacklisted_chars: '-'}).bail().toFloat()
        .custom(value => value > 1),
    body('*.budget.*.availableUnits', 'Fehlende Anzahl von Personentagen für die Preiskategorie')
        .isDecimal({blacklisted_chars: '-'}).bail().toFloat().custom(value => value > 1),
    body('*.budget.*.minutesPerDay', 'Fehlende Arbeitstaglänge').isDecimal({blacklisted_chars: '-'}).bail().toFloat()
        .custom(value => value > 1),
], syncContracts);

router.post('/deliverables', [
    body().isArray({min: 0}).withMessage('Kein Array von Leistungszeiten übergeben').bail().toArray(),
    body('*.id', 'Fehlende oder falsche Id').isInt({min: 1}).bail().toInt(),
    body('*.version', 'Fehlende oder falsche Version').isInt({min: 1}).bail().toInt(),
    body('*.contract', 'Fehlender oder falscher Vertrag').isInt({min: 1}).bail().toInt(),
    body('*.date', 'Fehlendes oder falsches Datum').isDate().bail().toDate(),
    body('*.duration', 'Fehlende oder falsche Anzahl von PT').isDecimal({blacklisted_chars: '-'}).bail().toFloat()
        .custom(value => value > 0),
    body('*.key', 'Falscher Schlüssel').optional().isString().bail().trim().isLength({min: 18, max: 18})
        .custom(value => new RegExp('^[0-9]{15}[A-Z]{3}').test(value)),
    body('*.priceCategoryId', 'Fehlende oder falsche Preiskategorie').isInt({min: 1}).bail().toInt(),
], syncDeliverables);

export default router;
