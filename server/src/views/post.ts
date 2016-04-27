import { h } from 'virtual-dom';
import mainView from './main';
import * as URL from 'url';
import { sortBy, last, range } from 'lodash';

import { Post, PostImageElement, PostTextElement } from '../models';

interface Model {
    title: string;
    href: string;
    date: string;
    blocks: Array<{
        title: string;
        elementGroups: Array<Group>
    }>
}

abstract class Group {
    constructor(public type: string) {}
}

class ImageGroup extends Group {
    constructor(public element: ImageElement) { super('image') }
}

class TextGroup extends Group {
    constructor(public element: TextElement) { super('text') }
}

class ImageSquarePairGroup extends Group {
    constructor(public elements: [ ImageElement, ImageElement ]) { super('image-square-pair') }
}

interface ImageElementSize {
    file: string;
    width: number;
}

abstract class Element {
    constructor() {}
}

class TextElement extends Element {
    constructor(public body: string) { super() }
}

class ImageElement extends Element {
    constructor(
        public heightAsProportionOfWidth: number,
        public widthAsProportionOfHeight: number,
        public masterWidth: number,
        public aspectRatio: [number, number],
        public srcset: Array<ImageElementSize>,
        public highDprSrcset: Array<ImageElementSize>,
        public firstSize: ImageElementSize
    ) { super() }
}

const imgixOrigin = 'https://samefourchords-com-images.imgix.net';
const bucketName = 'samefourchords.com-images';

// TODO: Class
const isPostImageElement = (element: PostTextElement | PostImageElement): element is PostImageElement => element.type === 'image';
const isPostTextElement = (element: PostTextElement | PostImageElement): element is PostTextElement => element.type === 'text';

const getGcd = (a: number, b: number): number => b ? getGcd(b, a % b) : a;
const simplify = (numerator: number, denominator: number): [number, number] => {
  const gcd = getGcd(numerator,denominator);
  return [numerator/gcd, denominator/gcd];
};

const createModel = (post: Post): Model => {
    return {
        title: post.title,
        href: post.href,
        date: post.date.toDateString(),
        blocks: post.blocks.map(block => ({
            title: block.title,
            elementGroups: (
                block.elements
                    .map((element): Element => {
                        if (isPostImageElement(element)) {
                            // TODO: Option?
                            const maybeMasterImage = element.assets.find(asset => asset.isMaster);
                            const bucketPath = URL.parse(maybeMasterImage.file).path.replace(new RegExp(`^/${bucketName}`), '');
                            const heightAsProportionOfWidth = (maybeMasterImage.height / maybeMasterImage.width);
                            const widthAsProportionOfHeight = (maybeMasterImage.width / maybeMasterImage.height);
                            const createWidths = (dpr: number) => range(320 * dpr, maybeMasterImage.width, 150 * dpr);
                            const srcset = createWidths(1).map((width): ImageElementSize => ({
                                file: `${imgixOrigin}${bucketPath}?auto=format%2Ccompress&w=${width}`,
                                width
                            }));
                            const highDprSrcset = createWidths(2).map((width): ImageElementSize => ({
                                file: `${imgixOrigin}${bucketPath}?auto=format&w=${width}&q=25&usm=20`,
                                width
                            }));

                            return new ImageElement(
                                heightAsProportionOfWidth,
                                widthAsProportionOfHeight,
                                // TODO: Option?
                                maybeMasterImage.width,
                                simplify(maybeMasterImage.width, maybeMasterImage.height),
                                srcset,
                                highDprSrcset,
                                // TODO: Option?
                                srcset[0]
                            );
                        }
                        else if (isPostTextElement(element)) {
                            return new TextElement(element.body);
                        }
                    })
                    .map((element): Group => {
                        if (element instanceof ImageElement) {
                            return new ImageGroup(element);
                        } else if (element instanceof TextElement) {
                            return new TextGroup(element);
                        }
                    })
                    .reduceRight((acc, group) => {
                        const prevGroup = acc[0];
                        const isGroupSquareImage = (group: Group): group is ImageGroup =>
                            group instanceof ImageGroup && group.element.widthAsProportionOfHeight === 1;

                        if (isGroupSquareImage(group) && prevGroup && isGroupSquareImage(prevGroup)) {
                            acc[0] = new ImageSquarePairGroup([ group.element, prevGroup.element ])
                        } else {
                            acc.unshift(group);
                        }
                        return acc;
                    }, <Group[]>[])
            )
        }))
    }
};

const renderImage = (element: ImageElement) => (
    h('.image-element', {
        style: { maxWidth: `calc(${element.widthAsProportionOfHeight} * 100vh)` }
    }, [
        h('.image-element-inner-1', {
            style: { maxWidth: `${element.masterWidth}px` }
        }, [
            h('.image-element-inner-2', {
                style: { paddingBottom: `${element.heightAsProportionOfWidth * 100}%` }
            }, [
                h('picture', [
                    {
                        media: '(min-resolution: 2dppx)',
                        srcset: element.highDprSrcset
                    },
                    {
                        media: '',
                        srcset: element.srcset
                    }
                ].map(({ media, srcset }) => (
                    h('source', {
                        sizes: [
                            `(min-aspect-ratio: ${element.aspectRatio.join('/')}) ${element.widthAsProportionOfHeight * 100}vh`,
                            '100vw'
                        ].join(','),
                        media,
                        srcset: srcset
                            .map(size => `${size.file} ${size.width}w`)
                            .join(', ')
                    }, [])
                )).concat(
                    h('img', { src: element.firstSize.file }, [])
                ))
            ])
        ])
    ])
);

const bodyView = (model: Model) => (
    h('article', [
        h('header', [
            h('h1', [h('a', { href: model.href }, model.title)]),
            h('p', [h('time', model.date)])
        ]),
        h('div', model.blocks.map(block => (
            h('div', [
                h('h2', block.title),
                h('.element-groups', (
                    block.elementGroups.map(elementGroup => {
                        return h('.element-group', { className: elementGroup.type }, (
                            (() => {
                                if (elementGroup instanceof ImageSquarePairGroup) {
                                    return elementGroup.elements.map(renderImage)
                                } else if (elementGroup instanceof ImageGroup) {
                                    return [ renderImage(elementGroup.element) ];
                                } else if (elementGroup instanceof TextGroup) {
                                    return [ h('.text-element', { innerHTML: elementGroup.element.body }, []) ];
                                }
                            })()
                        ));
                    })
                ))
            ])
        )))
    ])
)

export default (post: Post) => {
    const model = createModel(post);
    const body = bodyView(model);
    return mainView({ title: post.title, body });
};
