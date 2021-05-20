interface RestRessort {
    id: number;
    kurzbezeichnung: string;
    bezeichnung: string;
};

export interface RestContract {
    id: number;
    version: number;
    stammdaten: {
        projektTitel: string;
        status: string;
        projektTyp: string;
        projektBeginn: string;
        projektEnde: string;
        vorgaenger: {
            id: number;
            projektTitel: string;
        };
        nachfolger: {
            id: number;
            projektTitel: string;
        };
        ressort: RestRessort;
        bedarfstraeger: {
            id: number;
            kurzbezeichnung: string;
            bezeichnung: string;
            ressort: RestRessort;
            ressortId: number;
        };
        projektleiterBedarfstraeger: {
            id: number,
            nachname: string,
            vorname: string,
            rolle: string,
            aktiv: boolean,
            bedarfstraeger: {
                id: number;
                kurzbezeichnung: string;
                bezeichnung: string;
                ressort: RestRessort;
                ressortId: number;
            };
            ressort: {
                id: number;
                kurzbezeichnung: string;
                bezeichnung: string;
            }
        },
        orgE: string;

    };
    rahmenvertrag: {
        id: number;
        kurzbezeichnung: string;
        bezeichnung: string;
        preisstufen: {
                id: number;
                bezeichnung: string;
                kostenProPT: number;
                aktiv: boolean;
                rahmenvertragId: number;
                rahmenvertragBezeichnung: string;
            }[];
        zugeordneteTeamleiter: number[];
        budget: string;
        totalBudget: string;
        budgetPuffer: string;
        budgetStatus: string;
        zeitStatus: string;
        projektStatus: string;
    };
    vertragsdaten: {
        koopVStatus: string;
        koopVUnterzeichnetAm: string;
        versionsnummer: string;
        mitVorzeitigerMassnahmenBeginn: boolean;
        eaVertragStatus: string;
        vertragGegensigniertAm: string;
    };
    personaldaten: {
        projektleiterDienstleister: {
            id: number;
            nachname: string;
            vorname: string;
            auftragnehmer: string;
        };
        zugewieseneMitarbeiter: {
            id: number;
            arbeitszeitraumStart: string;
            nachname: string;
            vorname: string;
            auftragnehmer: string;
            preisstufe: string;
        }[];
    };
    budget: {
        umgeschichtet: true;
        aufgestockt: false;
        budgetdaten: {
            preisstufe: {
                id: number;
                bezeichnung: string;
                kostenProPT: number;
                aktiv: boolean;
            };
            sollBudget: number;
            sollPtMinuten: number;
        }[];
        // meilensteindaten: [];
    };
}