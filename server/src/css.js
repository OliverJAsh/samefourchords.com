export default `
/* Falling back to simple vertical layout, as grid layout using padding was too
complicated. Padding and height constrainment don't play nicely together.
http://jsbin.com/hoheye/13/edit?html,css,output */

:root {
    --font-size: 1rem;
    --line-height: 1.4;
    --unit-vertical: calc(var(--line-height) * var(--font-size));
    --unit-horizontal: calc(var(--unit-vertical) * 2);
    --unit-small-vertical: calc(var(--unit-vertical) / 2);
    --unit-small-horizontal: calc(var(--unit-horizontal) / 2);
}
body {
    /*Unset UAS*/
    margin: unset;

    font-family: system-ui, sans-serif;
    font-size: var(--font-size);
    line-height: var(--line-height);
    color: hsl(0, 0%, 15%);
    -webkit-font-smoothing: antialiased;
}

.vertical-small-island {
    padding-top: var(--unit-small-vertical);
    padding-bottom: var(--unit-small-vertical);
}

/* 768 - 1 */
@media (max-width: 767px) {
    .vertical-small-island-until-tablet {
        padding-top: var(--unit-small-vertical);
        padding-bottom: var(--unit-small-vertical);
    }
}

.island {
    box-sizing: border-box;
    padding: var(--unit-vertical) var(--unit-horizontal);
}

@media (min-width: 768px) {
    .island-at-tablet {
        box-sizing: border-box;
        padding: var(--unit-vertical) var(--unit-horizontal);
    }
}

.spaced-items > *,
.small-island {
    box-sizing: border-box;
    padding: var(--unit-small-vertical) var(--unit-small-horizontal);
}

.nested-small-island {
    box-sizing: border-box;
    padding: calc(var(--unit-small-vertical) * 0.75) calc(var(--unit-small-horizontal) * 0.75);
}

.nested-small-island .item {
    box-sizing: border-box;
    padding: calc(var(--unit-small-vertical) / 4) calc(var(--unit-small-horizontal) / 4);
}

h1,
.article-header,
.block-title,
.element-group.text,
.fix-width {
    max-width: 40rem;
    /*mixin .center*/
    margin-left: auto;
    margin-right: auto;
}

.block-title {
    text-align: center;
}

@media (min-width: 768px) {
    .element-group.image {
        /*Negate body padding*/
        margin-left: calc(var(--unit-horizontal) * -1);
        margin-right: calc(var(--unit-horizontal) * -1);
    }
}

.center {
    margin-left: auto;
    margin-right: auto;
}

.reserved-image-container {
    position: relative;
}

.reserved-image-container img {
    position: absolute;
    width: 100%;
    height: 100%;
}

/* Unable to combine into one rulesets: http://stackoverflow.com/questions/16982449/why-isnt-it-possible-to-combine-vendor-specific-pseudo-elements-classes-into-on */

.reserved-image-container img:-webkit-full-screen {
    position: static;
    position: unset;
    object-fit: contain;
    background-color: black;
}

/* Already fixed and black, as according to spec */
.reserved-image-container img:-moz-full-screen {
    object-fit: contain;
}

h1, h2, h3, h4, h5, h6, p, ul, ol {
    margin-top: 0;
    margin-bottom: 0;
}

h5 {
    font-size: inherit;
}

ul {
    list-style: none;
    padding-left: 0;
}
`;
