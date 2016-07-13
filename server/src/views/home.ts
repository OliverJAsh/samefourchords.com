import { h, VNode } from 'virtual-dom';
import mainView from './main';
import { groupBy, toPairs } from 'lodash';

import { Post } from '../models';

const createPost = (post: Post) => (
    h('li', [
        h('h4', [ h('a', { href: post.href }, post.title) ])
    ])
);

const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

export default (posts: Array<Post>) => {
    const body = h('.flex-container', [
        h('.fix-width', [
            h('p', [
                'Photos by Oliver Joseph Ash. ',
                h('a', { href: 'https://twitter.com/OliverJAsh', rel: 'me' }, 'Twitter'),
                ', ',
                h('a', { href: 'https://www.facebook.com/OliverJAsh', rel: 'me' }, 'Facebook'),
                ', ',
                h('a', { href: 'https://www.instagram.com/OliverJAsh', rel: 'me' }, 'Instagram'),
                '.',
            ]),
            h('p', [ h('a', { href: '/timeline' }, 'View all'), '.' ]),
            h('ul', (
                (<[ string, Post[] ][]>toPairs(groupBy(posts, post => post.date.getFullYear())))
                    .reverse()
                    .map(
                        ([ year, posts ]) => (
                            h('li', [
                                h('h2', year),
                                h('ul', (
                                    (<[ string, Post[] ][]>toPairs(groupBy(posts, post => post.date.getMonth())))
                                        .reverse()
                                        .map(([ monthIndex, posts ]) => (
                                            h('li', [
                                                h('h3', months[parseInt(monthIndex)]),
                                                h('ul', posts.map(createPost))
                                            ])
                                        ))
                                ))
                            ])
                        )
                    )
            ))
        ])
    ]);

    return mainView({ title: '', body });
};
