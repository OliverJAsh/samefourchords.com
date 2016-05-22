import { h } from 'virtual-dom';
import mainView from './main';
import { groupBy, toPairs } from 'lodash';

import { Post } from '../models';

const createPost = (post: Post) => (
    h('li', [
        h('h3', [ h('a', { href: post.href }, [ post.title ]) ])
    ])
);

export default (posts: Array<Post>) => {
    const body = h('ul', (
        (<[ string, Post[] ][]>toPairs(groupBy(posts, post => post.date.getFullYear())))
            .reverse()
            .map(
                ([ year, posts ]) => (
                    h('li', [
                        h('h3', year),
                        h('ul', posts.map(createPost))
                    ])
                )
            )
    ));

    return mainView({ title: '', body });
};
