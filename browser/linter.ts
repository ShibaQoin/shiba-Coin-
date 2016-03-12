/// <reference path="../typings/main.d.ts" />

import {readFile} from 'fs';
import * as markdownlint from 'markdownlint';
import * as remark from 'remark';
import * as remarklint from 'remark-lint';

interface Message {
    header: string;
    body: string;
}

interface RemarkFile {
    messages: {
        line: number;
        column: number;
        reason: string;
    }[];
}

export default class Linter {
    lint: (filename: string, callback: (msgs: Message[]) => void) => void;
    lint_url: string;
    remark: any;
    options: Object;

    constructor(name: string, options: Object) {
        this.options = options || {};

        if (name === 'markdownlint') {
            this.lint = this.markdownlint;
            this.lint_url = 'https://github.com/DavidAnson/markdownlint/blob/master/doc/Rules.md';
        } else if (name === 'remark-lint' || name === 'mdast-lint') {
            this.lint = this.remark_lint;
            this.lint_url = 'https://github.com/wooorm/remark-lint/blob/master/doc/rules.md';
        } else if (name === 'none') {
            this.lint = function(f, p){ /* do nothing */ };
            this.lint_url = '';
        } else {
            console.log("linter.js: Invalid linter name '" + name + "'");
            this.lint = function(f, p){ /* do nothing */ };
            this.lint_url = '';
        }
    }

    markdownlint(filename: string, callback: (msgs: Message[]) => void) {
        readFile(filename, 'utf8', (read_err: Error, content: string) => {
            if (read_err) {
                console.error(read_err);
                return;
            }

            const opts = {
                strings: {
                    [filename]: content,
                },
                config: this.options,
            };

            markdownlint(opts, function(err: Error, result: any) {
                if (err) {
                    return;
                }
                const is_space = /\s+/;
                const messages = result.toString()
                                .split('\n')
                                .filter((msg: string) => msg !== '')
                                .map(function(msg: string): Message {
                                    const m = msg.match(is_space);
                                    if (!m) {
                                        return {header: '', body: msg};
                                    }

                                    return {
                                        header: msg.slice(0, m.index),
                                        body: msg.slice(m.index),
                                    };
                                });
                callback(messages);
            });
        });
    }

    remark_lint(filename: string, callback: (msgs: Message[]) => void) {
        readFile(filename, 'utf8', (read_err: Error, content: string) => {
            if (read_err) {
                console.error(read_err);
                return;
            }

            this.remark = this.remark || remark().use(remarklint, this.options);

            this.remark.process(content, function(err: NodeJS.ErrnoException, file: RemarkFile) {
                if (err) {
                    console.log('Lint failed: ', err.stack);
                    return;
                }

                callback(
                    file.messages.map(function(m): Message {
                        // Note:
                        // Should I include m.ruleId to check the detail of message?
                        // I don't include it now because message gets too long.
                        return {
                            header: `${filename}:${m.line}:${m.column}:`,
                            body: m.reason,
                        };
                    })
                );
            });
        });
    }

}

