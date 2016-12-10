import { h } from 'virtual-dom';
import * as URL from 'url';
import { range } from 'lodash';
import dateFormat = require('dateformat');
import createSrc from './create-src';

import { Post, PostImageElement, PostTextElement, PostElement } from './models';

export interface Model {
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

export class ImageGroup extends Group {
    constructor(public element: ImageElement) { super('image') }
}

export class TextGroup extends Group {
    constructor(public element: TextElement) { super('text') }
}

export class ImageSquarePairGroup extends Group {
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

export class ImageElement extends Element {
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

// TODO: Class
const isPostImageElement = (element: PostElement): element is PostImageElement => element.type === 'image';
const isPostTextElement = (element: PostElement): element is PostTextElement => element.type === 'text';

const getGcd = (a: number, b: number): number => b ? getGcd(b, a % b) : a;
const simplify = (numerator: number, denominator: number): [number, number] => {
  const gcd = getGcd(numerator,denominator);
  return [numerator/gcd, denominator/gcd];
};

export const createModel = (post: Post): Model => {
    return {
        title: post.title,
        href: post.href,
        date: dateFormat(post.date, 'd mmmm yyyy'),
        blocks: post.blocks.map(block => ({
            title: block.title,
            elementGroups: (
                block.elements
                    // TODO: Use discriminated union instead
                    // .map((element): Element => {
                    .map((element): any => {
                        if (isPostImageElement(element)) {
                            // TODO: Slug/ID
                            const slug = post.href.replace(/^\//, '').replace(/\//g, '-')
                            const heightAsProportionOfWidth = (element.master.height / element.master.width);
                            const widthAsProportionOfHeight = (element.master.width / element.master.height);
                            const createWidths = (dpr: number) => range(320 * dpr, element.master.width, 150 * dpr);
                            const srcset = createWidths(1).map((width): ImageElementSize => ({
                                file: createSrc(slug, element.master.file, width, false),
                                width
                            }));
                            const highDprSrcset = createWidths(2).map((width): ImageElementSize => ({
                                file: createSrc(slug, element.master.file, width, true),
                                width
                            }));

                            return new ImageElement(
                                heightAsProportionOfWidth,
                                widthAsProportionOfHeight,
                                // TODO: Option?
                                element.master.width,
                                simplify(element.master.width, element.master.height),
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
                    // TODO: Use discriminated union instead
                    // .map((element): Group => {
                    .map((element): any => {
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
