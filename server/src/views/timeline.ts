import { h, VNode } from 'virtual-dom';
import mainView from './main';
import { groupBy, toPairs } from 'lodash';
import blocksFragment from '../fragments/blocks';

import { Post } from '../models';
import { createModel, Model } from '../post-model';

const createPost = (model: Model) => (
    h('li.timeline-entry', [
        h('article', [
            h('header.article-header', [
                h('h4', [ h('a', { href: model.href }, [ model.title ]) ]),
                h('p', [h('time', model.date)])
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
                        h('h2.fix-width', year),
                        h('ul', (
                            (<[ string, Post[] ][]>toPairs(groupBy(posts, post => post.date.getMonth())))
                                .reverse()
                                .map(([ monthIndex, posts ]) => (
                                    h('li.timeline-entry', [
                                        h('h3.fix-width', months[parseInt(monthIndex)]),
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
