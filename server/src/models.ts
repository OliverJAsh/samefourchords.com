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

interface PostJsonImageElementAsset {
    file: string;
    isMaster: boolean;
    width: number;
    height: number;
}

interface PostJsonImageElement {
    type: 'image';
    master: PostJsonImageElementAsset;
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

interface PostImageElementAsset {
    file: string;
    isMaster: boolean;
    width: number;
    height: number;
}

export interface PostImageElement {
    type: 'image';
    master: PostImageElementAsset;
}
