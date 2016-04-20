const nodeListToArray = <A extends Node>(nodeList: NodeListOf<A>): Array<A> => Array.prototype.slice.call(nodeList);
const imgEls = nodeListToArray(document.querySelectorAll('img'));

interface EventTarget {
    mozRequestFullScreen(): void;
    webkitRequestFullscreen(): void;
}

imgEls.forEach((imgEl) => {
    imgEl.addEventListener('click', (event) => {
        const el = event.currentTarget;
        // When support is good enough, we can add el.requestFullscreen || el.msRequestFullscreen;
        const fn = el.mozRequestFullScreen || el.webkitRequestFullscreen;
        if (fn) {
            fn.bind(el)();
        }
    });
});
