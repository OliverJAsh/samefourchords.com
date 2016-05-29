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
        elements: Array<PostElement>
    }>
    href: string;
}

export type PostElement = PostTextElement | PostImageElement;

export interface PostTextElement {
    type: 'text';
    body: string;
}

interface PostImageElementAsset {
    file: string;
    width: number;
    height: number;
}

export interface PostImageElement {
    type: 'image';
    master: PostImageElementAsset;
}
