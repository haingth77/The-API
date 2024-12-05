export interface Type_Image {
    breeds: [],
    id: string,
    url: string,
    width: number,
    height: number,
    mime_type ?: string,
    categories ?: []
}

export interface Type_Vote {
    image_id: string,
    sub_id: string,
    value: number,
    id?: number,
    createed_at?: string,
    country_code?: string,
    image?: object
}