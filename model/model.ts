export type IMeetings = IPerson & {
    MEETINGID: number;
    MEETINGNAME: string;
    START: string;
    ENDE: string;
}; // extend the interface 


export interface IPerson {
    PERSONID: number;
    NAME: string;
    ADRESSE: string;
    PLZ: string;
    ORT: string;
}
