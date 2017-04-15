import { h } from 'virtual-dom';
import mainView from './main';
import { groupBy, toPairs } from 'lodash';
import blocksFragment from '../fragments/blocks';

import { Post } from '../models';
import { createModel, Model } from '../post-model';

const createPost = (model: Model) => (
    h('li.timeline-entry', [
        h('article', [
            h('header.article-header.nested-small-island', [
                h('h4.item', [ h('a', { href: model.href }, [ model.title ]) ]),
                h('p.item', [ h('time', model.date) ])
            ]),
            blocksFragment(model)
        ])
    ])
);

const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

export default (posts: Array<Post>) => {
    const body = h('ul', (
        (<[ string, Post[] ][]>toPairs(groupBy(posts, post => post.date.getFullYear())))
            .reverse()
            .map(
                ([ year, posts ]) => (
                    h('li.timeline-entry', [
                        h('h2.fix-width.small-island', year),
                        h('ul', (
                            (<[ string, Post[] ][]>toPairs(groupBy(posts, post => post.date.getMonth())))
                                .reverse()
                                .map(([ monthIndex, posts ]) => (
                                    h('li.timeline-entry', [
                                        h('h3.fix-width.small-island', months[parseInt(monthIndex)]),
                                        h('ul', posts.map(createModel).map(createPost))
                                    ])
                                ))
                        ))
                    ])
                )
            )
    ));

    return mainView({ title: 'Timeline', body });
};
