export default `
body {
    /* Reset */
    margin: 1rem;
}

.element-groups {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.element-group {
    display: flex;
}

.element-group.image {
    width: calc(100% + 2rem);
    justify-content: center;
}

.element-group.image:not(:last-child),
.element-group.text:not(:last-child) {
    margin-bottom: 1rem;
}

@media (max-width: 767px) {
    .element-group.image-square-pair {
        width: calc(100% + 2rem);
        flex-direction: column;
        align-items: center;
    }

    .element-group.image-square-pair .image-element {
        margin-bottom: 1rem;
    }

    .element-group.image-square-pair:last-child .image-element:last-child {
        margin-bottom: 0;
    }
}

@media (min-width: 768px) {
    .element-group.image-square-pair {
        /* Gutter + body gutter */
        width: calc(1rem + 2rem + 100%);
        margin-left: -1rem;
        justify-content: center;
    }

    .element-group.image-square-pair .image-element {
        padding-left: 1rem;
    }

    .element-group.image-square-pair:not(:last-child) {
        margin-bottom: 1rem;
    }
}

.image-element {
    width: 100%;
    display: flex;
    justify-content: center;
}

.image-element-inner-1 {
    width: 100%;
}

.image-element-inner-2 {
    position: relative;
}

.image-element-inner-2 img {
    position: absolute;
    width: 100%;
    height: 100%;
}

/* Unable to combine into one rulesets: http://stackoverflow.com/questions/16982449/why-isnt-it-possible-to-combine-vendor-specific-pseudo-elements-classes-into-on */

.image-element-inner-2 img:-webkit-full-screen {
    position: static;
    position: unset;
    object-fit: contain;
    background-color: black;
}

/* Already fixed and black, as according to spec */
.image-element-inner-2 img:-moz-full-screen {
    object-fit: contain;
}

h1, h2, h3, h4, h5, h6, p {
    margin-top: 0;
    margin-bottom: 0;
}

ul {
    list-style: none;
    padding-left: 0;
}

h1, h2, h3, h4, h5, h6, p, .article-header, .block {
    margin-bottom: 1rem;
}

p:last-child {
    margin-bottom: 0;
}
`;
