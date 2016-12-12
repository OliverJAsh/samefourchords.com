import {Option} from '../../server/src/Option';
import {exec, errorOnStderr, OptionHelpers} from './utils'

// Specific

const isoShortDateRegExp = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
const idToDate = (id: string): Option<string> => (
    OptionHelpers.stringMatch(id, isoShortDateRegExp)
        .flatMap(match => OptionHelpers.arrayGet(match, 0))
)

type PostPhoto = {
    file: string
    width: number
    height: number
}
const getPhotos = ({ id }: { id: string }): Promise<PostPhoto[]> => (
    exec(`identify -format "%f %w %h\n" ~/Development/samefourchords.com-images/${id}/*`, {})
        .then(errorOnStderr)
        .then(stdout => (
            stdout
                .replace(/\n$/, '')
                .split('\n')
                .map(item => {
                    const x = item.split(' ');
                    return {
                        file: x[0],
                        width: parseInt(x[1], 10),
                        height: parseInt(x[2], 10),
                    }
                })
        ))
)

type Post = {
    title: string
    date: string
    blocks: { elements: { type: 'image', master: PostPhoto }[] }[]
}
const createPost = ({ id, title }: { id: string, title: string }): Promise<Post> => (
    getPhotos({ id }).then(photos => (
        idToDate(id).match({
            None: () => { throw new Error('Unable to parse ID to date') },
            Some: (date): Post => ({
                title,
                date,
                blocks: [
                    {
                        elements: photos.map(photo => ({
                            type: 'image' as 'image',
                            master: photo
                        })),
                    },
                ],
            }),
        })
    ))
);

export default createPost;
