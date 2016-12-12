import createPost from './createPost';
import {OptionHelpers, stringify, writePromise} from './utils'

// Specific

const maybeId = OptionHelpers.arrayGet(process.argv, 2)
const maybeTitle = OptionHelpers.arrayGet(process.argv, 3)

const mainPromise = maybeId.flatMap(id => maybeTitle.map(title => ({ id, title})))
    .match({
        None: () => { throw new Error('Missing ID or title') },
        Some: x => createPost(x),
    })
    .then(stringify)

writePromise(mainPromise)
