// TODO: Analytics
import { h, VNode } from 'virtual-dom';
import css from '../css';
import * as fs from 'fs';

const clientMainJs = fs.readFileSync(`${__dirname}/../../../client/target/main.js`).toString();
const analyticsJs = fs.readFileSync(`${__dirname}/../../../client/target/analytics.js`).toString();

const renderNonBlockingCss = (href: string): Array<VNode> => [
    h('link', {
        rel: 'stylesheet',
        href,
        media: 'none',
        attributes: { onload: 'if(media!=\'all\')media=\'all\'' }
    }, []),
    h('noscript', [
        h('link', { rel: 'stylesheet', href }, [])
    ])
];

const siteTitle = 'Same Four Chords';

export default ({ title, head, body }: { title: string, head?: VNode[], body: VNode }) => (
    h('html', [
        h('head', [
            h('meta', { charset: 'utf-8' }, []),
            h('title', `${title ? (title + ' – ') : ''}${siteTitle}`),
            h('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }, []),
            h('style', { innerHTML: css }, [])
        ].concat(
            renderNonBlockingCss('https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic')
        ).concat(head || [])),
        h('body.vertical-small-island-until-tablet.island-at-tablet', [
            h('h1.small-island', [
                h('a', { href: '/' }, siteTitle)
            ]),
            h('main', [ body ]),
            h('script', { innerHTML: clientMainJs }, []),
            h('script', { innerHTML: analyticsJs }, [])
        ])
    ])
);
