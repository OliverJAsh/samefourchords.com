import { h } from 'virtual-dom';

import { Model, ImageSquarePairGroup, ImageGroup, TextGroup, ImageElement } from '../post-model';

const renderImage = (element: ImageElement) => (
    /*responsive image constrained by width and viewport height*/
    /*http://jsbin.com/tuvaha/1/edit?html,css,output*/
    h('.vertical-small-island.center', {
        style: { maxWidth: `calc(${element.widthAsProportionOfHeight} * 100vh)` }
    }, [
        h('.center', {
            style: { maxWidth: `${element.masterWidth}px` }
        }, [
            h('.reserved-image-container', {
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
                    h('img', { src: element.firstSize.file }, [])
                ))
            ])
        ])
    ])
);

export default (model: Model) => (
    h('.blocks', model.blocks.map(block => (
        h('.block', [
            block.title ? h('h5.block-title.small-island', block.title) : null as any,
            h('.element-groups', (
                // TODO: Use discriminated union instead, remove any
                block.elementGroups.map((elementGroup): any => {
                    if (elementGroup instanceof ImageSquarePairGroup) {
                        return h('.element-group', { className: 'image' },
                            elementGroup.elements
                                .map(renderImage)
                        );
                    } else if (elementGroup instanceof ImageGroup) {
                        return h('.element-group', { className: 'image' },
                            [elementGroup.element]
                                .map(renderImage)
                        );
                    } else if (elementGroup instanceof TextGroup) {
                        return h('.element-group', { className: 'text' }, [
                            h('.text-element.spaced-items', { innerHTML: elementGroup.element.body }, [])
                        ]);
                    }
                })
            ))
        ])
    )))
);
