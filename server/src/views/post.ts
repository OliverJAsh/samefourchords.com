import { h } from 'virtual-dom';
import mainView from './main';
import blocksFragment from '../fragments/blocks';

import { Post } from '../models';
import { Model, createModel } from '../post-model';

const bodyView = (model: Model) => (
    h('article', [
        h('header.article-header', [
            h('h2', [h('a', { href: model.href }, model.title)]),
            h('p', [h('time', model.date)])
        ]),
        blocksFragment(model)
    ])
)

export default (post: Post) => {
    const model = createModel(post);
    const body = bodyView(model);
    return mainView({ title: post.title, body });
};
