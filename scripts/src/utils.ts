import {Option} from '../../server/src/Option';
import * as denodeify from 'denodeify';
import {exec as execNode, ExecOptions} from 'child_process';

type Stdout = string;
type Stderr = string;
type ExecResult = [ Stdout, Stderr ];
export const exec: (command: string, options: ExecOptions) => Promise<ExecResult> = (
    denodeify(execNode, (err, stdout, stderr) => [err, [stdout, stderr]])
);
export type StringDictionary<T> = { [key: string]: T };
export const getInStringDictionary = <T>(stringDictionary: StringDictionary<T>, key: number): T | undefined => stringDictionary[key]
export const getInArray = <T>(array: T[], index: number): T | undefined => array[index]
export const OptionHelpers = {
    fromNullable<T>(t: T | null | undefined): Option<T> { return Option(t as T) },
    arrayGet<T>(array: T[], index: number): Option<T> {
        return OptionHelpers.fromNullable(getInArray(array, index))
    },
    stringMatch(str: string, matcher: RegExp): Option<RegExpMatchArray> {
        return OptionHelpers.fromNullable(str.match(matcher))
    },
}
export const stringify = (json: any) => JSON.stringify(json, null, '    ');
export const writePromise = (promise: Promise<string>): Promise<void> => (
    promise.then(
        output => { process.stdout.write(output) },
        error => {
            process.stderr.write(error.stack)
            process.exit(1)
        },
    )
)
export const errorOnStderr = ([ stdout, stderr ]: ExecResult): Stdout => {
    if (stderr !== '') {
        throw new Error(stderr)
    } else {
        return stdout;
    }
};
