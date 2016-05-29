import { h } from 'virtual-dom';
import mainView from './main';

interface ErrorViewState {
    message: string;
}

export default (state: ErrorViewState) => mainView({
    title: state.message,
    head: [],
    body: h('p', state.message)
});
