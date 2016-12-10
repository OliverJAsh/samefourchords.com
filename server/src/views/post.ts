import { h } from 'virtual-dom';
import mainView from './main';
import blocksFragment from '../fragments/blocks';
import { Option } from '../option';
import createSrc from '../create-src';

import { Post, PostElement, PostImageElement } from '../models';
import { Model, createModel } from '../post-model';

const bodyView = (model: Model) => (
    h('article', [
        h('header.article-header', [
            h('h2', [ h('a', { href: model.href }, model.title) ]),
            h('p', [ h('time', model.date) ])
        ]),
        blocksFragment(model)
    ])
)

const headOption = <X>(xs: X[]): Option<X> => Option(xs[0]);

// TODO: Class
const isPostImageElement = (element: PostElement): element is PostImageElement => element.type === 'image';
export default (post: Post) => {
    const model = createModel(post);
    const maybeFirstImage = headOption(post.blocks)
        .flatMap(block => Option(block.elements.find(isPostImageElement)))
        .map((imageElement: PostImageElement) => imageElement.master)
    // TODO: Slug/ID
    const slug = post.href.replace(/^\//, '').replace(/\//g, '-')
    const head = maybeFirstImage.map(firstImage => (
        [ h('meta', { property: 'og:image', content: createSrc(slug, firstImage.file, 1500, false) }, []) ]
    )).getOrElse([])
    const body = bodyView(model);
    return mainView({ title: post.title, head, body });
};
