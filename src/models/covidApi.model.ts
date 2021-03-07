interface CalendarData {
    c_date: string;
    is_closed: number;
    free_capacity: number;
}

interface Payload {
    id: string;
    title: string;
    longitude: string;
    latitude: string;
    city: string;
    street_name: string;
    street_number: string;
    postal_code: string;
    region_id: string;
    region_name: string;
    county_id: string;
    county_name: string;
    age_from: string;
    age_to: string;
    calendar_data: CalendarData[];
}

export interface CovidApiData {
    warnings: any[];
    errors: any[];
    info: any[];
    payload: Payload[];
    warning_count: number;
    error_count: number;
    payload_count: number;
}