// TODO: Old URLs

import * as fs from 'fs';
import * as pathHelpers from 'path';
import * as mkdirP from 'mkdirp';
import treeToHTML = require('vdom-to-html');
import dateFormat = require('dateformat');
import slug = require('slug');
import { sortBy } from 'lodash';
import * as denodeify from 'denodeify';

import postView from './views/post';
import homeView from './views/home';
import timelineView from './views/timeline'

import { Post, PostJson } from './models';

const log = (message: string) => {
    console.log(`${new Date().toISOString()} ${message}`);
};

process.on('uncaughtException', (error: Error) => {
    if (error.stack) log(error.stack);
    process.exit(1);
});

const readFile = denodeify(fs.readFile);
const loadFile = (path: string): Promise<string> => readFile(path).then(buffer => buffer.toString());
const loadJsonFile = <A>(path: string): Promise<A> => loadFile(path).then(jsonString => JSON.parse(jsonString));
const postsDir = `${__dirname}/posts`;
const loadPost = (fileName: string): Promise<PostJson> => loadJsonFile<PostJson>(`${postsDir}/${fileName}`);

const readdir = denodeify(fs.readdir);
const postsPromise: Promise<Array<PostJson>> = (
    readdir(postsDir).then(fileNames => Promise.all(fileNames.map(loadPost)))
);


const getPostSlug = (postJson: PostJson): string => (
    `${dateFormat(new Date(postJson.date), 'yyyy/mm/dd')}/${slug(postJson.title, { lower: true })}`
);

// // Remember: order matters!

const sortPostsByDateDesc = (posts: Array<Post>) => sortBy(posts, post => post.date).reverse();

const docType = '<!DOCTYPE html>';
const stringifyTree = (tree: VirtualDOM.VNode) => docType + treeToHTML(tree);

const postJsonToPost = (postJson: PostJson): Post => (
    {
        title: postJson.title,
        date: new Date(postJson.date),
        blocks: postJson.blocks,
        href: `/${getPostSlug(postJson)}`
    }
);

//
// Site
//

const GENERATED_DIR = pathHelpers.join(__dirname, '..', '..', 'generated');

postsPromise
        .then(posts => sortPostsByDateDesc(posts.map(postJsonToPost)))
        .then(posts => stringifyTree(homeView(posts)))
        .then(html => fs.writeFileSync(pathHelpers.join(GENERATED_DIR, 'index.html'), html))

postsPromise
    .then(posts => sortPostsByDateDesc(posts.map(postJsonToPost)))
    .then(posts => stringifyTree(timelineView(posts)))
    .then(html => fs.writeFileSync(pathHelpers.join(GENERATED_DIR, 'timeline.html'), html))

postsPromise
    .then(posts => {
        posts.forEach(postJson => {
            const post = postJsonToPost(postJson)
            const html = stringifyTree(postView(post));
            const path = `${getPostSlug(postJson)}.html`;
            const fullPath = pathHelpers.join(GENERATED_DIR, path);
            const fullPathDir = pathHelpers.dirname(fullPath);

            mkdirP.sync(fullPathDir)
            fs.writeFileSync(fullPath, html)
        })
    })
