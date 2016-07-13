import { h } from 'virtual-dom';
import { last } from 'lodash';

import { Model, ImageSquarePairGroup, ImageGroup, TextGroup, ImageElement } from '../post-model';

const renderImage = (element: ImageElement) => (
    h('.image-element', {
        style: { maxWidth: `calc(${element.widthAsProportionOfHeight} * 100vh)` }
    }, [
        h('.image-element-inner-1', {
            style: { maxWidth: `${element.masterWidth}px` }
        }, [
            h('.image-element-inner-2', {
                style: { paddingBottom: `${element.heightAsProportionOfWidth * 100}%` }
            }, [
                h('picture', [
                    {
                        media: '(min-resolution: 2dppx)',
                        srcset: element.highDprSrcset
                    },
                    {
                        media: '',
                        srcset: element.srcset
                    }
                ].map(({ media, srcset }) => (
                    h('source', {
                        sizes: [
                            `(min-aspect-ratio: ${element.aspectRatio.join('/')}) ${element.widthAsProportionOfHeight * 100}vh`,
                            '100vw'
                        ].join(', '),
                        media,
                        srcset: srcset
                            .map(size => `${size.file} ${size.width}w`)
                            .join(', ')
                    }, [])
                )).concat(
                    h('img.u-photo', { src: element.firstSize.file }, [])
                ))
            ])
        ])
    ])
);

export default (model: Model) => (
    h('.blocks.h-feed', model.blocks.map(block => (
        h('.block', [
            block.title ? h('h5', block.title) : null,
            h('.element-groups', (
                block.elementGroups.map(elementGroup => {
                    return h('.element-group.h-entry', { className: elementGroup.type }, (
                        (() => {
                            if (elementGroup instanceof ImageSquarePairGroup) {
                                return elementGroup.elements.map(renderImage)
                            } else if (elementGroup instanceof ImageGroup) {
                                return [
                                    renderImage(elementGroup.element),
                                    h('a', { href: `${model.href}/${last(elementGroup.element.firstSize.file.split('/')).split('?')[0].split('.')[0]}`, className: 'u-url', rel: 'bookmark' }, []),
                                    // TODO: Move to link rel?
                                    elementGroup.element.syndications
                                        .map(href => h('a', { rel: 'syndication', className: 'u-syndication', href }, []))
                                ];
                            } else if (elementGroup instanceof TextGroup) {
                                return [ h('.text-element', { innerHTML: elementGroup.element.body }, []) ];
                            }
                        })()
                    ));
                })
            ))
        ])
    )))
);
