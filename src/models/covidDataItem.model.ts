export interface CovidData {
    lastUpdate: Date;
    items: CovidDataItem[];
}
export interface CovidDataItem {
    name: string;
    city: string;
    region: string;
    street: string;
    zip: string;
    freeCapacity: number;
    ageFrom: number;
    ageTo: number;
}