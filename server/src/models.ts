export interface PostJson {
    title: string;
    date: string;
    blocks: Array<{
        title: string;
        elements: Array<PostJsonElement>
    }>
}

interface PostJsonElement {
    type: 'text' | 'image'
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

export interface PostElement {
    type: 'text' | 'image';
}

export interface PostTextElement extends PostElement {
    type: 'text';
    body: string;
}

interface PostImageElementAsset {
    file: string;
    width: number;
    height: number;
}

export interface PostImageElement extends PostElement {
    type: 'image';
    master: PostImageElementAsset;
}
