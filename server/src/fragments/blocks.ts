import { h } from 'virtual-dom';

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
                    h('img', { src: element.firstSize.file }, [])
                ))
            ])
        ])
    ])
);

export default (model: Model) => (
    h('.blocks', model.blocks.map(block => (
        h('.block', [
            block.title ? h('h5.block-title', block.title) : null as any,
            h('.element-groups', (
                block.elementGroups.map(elementGroup => {
                    return h('.element-group', { className: elementGroup.type }, (
                        // TODO: Use discriminated union instead
                        ((): any => {
                            if (elementGroup instanceof ImageSquarePairGroup) {
                                return elementGroup.elements.map(renderImage)
                            } else if (elementGroup instanceof ImageGroup) {
                                return [ renderImage(elementGroup.element) ];
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
