export interface PostJson {
    title: string;
    date: string;
    blocks: Array<{
        title: string;
        elements: Array<PostJsonTextElement | PostJsonImageElement>
    }>
}

interface PostJsonTextElement {
    type: 'text';
    body: string;
}

interface PostJsonImageElement {
    type: 'image';
    assets: Array<{
        file: string;
        isMaster: boolean;
        width: number;
        height: number;
    }>
}




export interface Post {
    title: string;
    date: Date;
    blocks: Array<{
        title: string;
        elements: Array<PostTextElement | PostImageElement>
    }>
    href: string;
}

export interface PostTextElement {
    type: 'text';
    body: string;
}

export interface PostImageElement {
    type: 'image';
    assets: Array<{
        file: string;
        isMaster: boolean;
        width: number;
        height: number;
    }>
}
