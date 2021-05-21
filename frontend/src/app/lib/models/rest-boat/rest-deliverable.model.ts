export class RestDeliverable {
    id!: number;
    version!: number;
    einzelauftrag!: {
        id: number;
        projektTitel: string;
        projektTyp: string;
    };
    leistungserbringer!: {
        id: number;
        nachname: string;
        vorname: string;
    };
    datum!: string;
    startzeit!: string;
    endzeit!: string;
    beschreibung!: string;
    preisstufe!: {
        id: number;
        bezeichnung: string;
        kostenProPT: number;
        rahmenvertragId: number;
        aktiv: boolean;
    };
    duration!: string;
}