import { h } from 'virtual-dom';
import mainView from './main';
import { groupBy, toPairs } from 'lodash';

import { Post } from '../models';

const createPost = (post: Post) => (
    h('li.item', [
        h('h4', [ h('a', { href: post.href }, post.title) ])
    ])
);

const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

export default (posts: Array<Post>) => {
    const body = h('.fix-width', [
        h('p.small-island', [ h('a', { href: '/timeline' }, 'View all'), '.' ]),
        h('ul', (
            (<[ string, Post[] ][]>toPairs(groupBy(posts, post => post.date.getFullYear())))
                .reverse()
                .map(
                    ([ year, posts ]) => (
                        h('li', [
                            h('h2.small-island', year),
                            h('ul', (
                                (<[ string, Post[] ][]>toPairs(groupBy(posts, post => post.date.getMonth())))
                                    .reverse()
                                    .map(([ monthIndex, posts ]) => (
                                        h('li', [
                                            h('h3.small-island', months[parseInt(monthIndex)]),
                                            h('ul.nested-small-island', posts.map(createPost))
                                        ])
                                    ))
                            ))
                        ])
                    )
                )
        ))
    ]);

    return mainView({ title: '', body });
};
