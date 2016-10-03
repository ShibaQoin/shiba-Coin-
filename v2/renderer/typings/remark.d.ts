declare namespace Unified {
    export interface Settings {
        [key: string]: any;
    }
    export type Plugin = Remark.CompilerPlugin | Remark.TransformerPlugin | Remark.ParserPlugin;
    interface PluginOptions {
        [prop: string]: string;
    }
    type PluginsConfig = {[name: string]: PluginOptions | null} | string[] | string;
    type PresetsConfig = PluginsConfig;
    export type ConfigTransform = (options: Options) => Options;
    export interface Options {
        processor?: Processor;
        cwd?: string;
        globs?: string[];
        extensions?: string[];
        streamIn?: NodeJS.ReadableStream;
        filePath?: string;
        streamOut?: NodeJS.WritableStream;
        streamError?: NodeJS.WritableStream;
        out?: boolean;
        output?: string | boolean;
        tree?: boolean;
        treeIn?: boolean;
        treeOut?: boolean;
        rcName?: string;
        packageField?: string;
        detectConfig?: boolean;
        rcPath?: string;
        settings?: Settings;
        ignoreName?: string;
        detectIgnore?: boolean;
        ignorePath?: string;
        silentlyIgnore?: boolean;
        plugins?: PluginsConfig;
        presets?: PresetsConfig;
        pluginPrefix?: string;
        presetPrefix?: string | boolean;
        configTransform?: ConfigTransform;
        injectedPlugins?: Plugin[];
        color?: boolean;
        silent?: boolean;
        quiet?: boolean;
        frail?: boolean;
        files?: VFile[];
        [name: string]: any;
    }
    export interface VFileMessage {
        message: string;
        name: string;
        file: string;
        reason: string;
        line: number;
        column: number;
        location: any;
        ruleId: string | null;
        source: string | null; // Plugin name
        fatal: boolean;
    }
    export class VFile {
        data: Object;
        messages: VFileMessage[];
        history: any[];
        cwd: string;
        contents: any;
    }
    export type ProcessCallback = (err: Error, result: VFile) => void;
    export class Processor {
        Parser: Remark.ParserPlugin;
        Compiler: Remark.CompilerPlugin;
        use(plugin: Plugin | Plugin[], settings?: Settings): Processor;
        run(node: Remark.MarkdownNode, file?: VFile, done?: (err: Error, node: Remark.MarkdownNode, file: VFile) => void): Remark.MarkdownNode;
        process(source: string | string[], cb: ProcessCallback): void;
        parse(file: VFile, options?: Options): Remark.MarkdownNode;
        stringify(node: Remark.MarkdownNode, file?: VFile, options?: Options): string;
        write(chunk: Buffer | string, encoding?: string, callback?: Function): boolean;
        pipe(stream: NodeJS.WritableStream): NodeJS.WritableStream;
        data(key: string, value?: any): any;
        end(): boolean;
        abstract(): Processor;
    }
}

declare module 'unified' {
    const engine: (options?: Unified.Options) => Unified.Processor;
    export = engine;
}

declare namespace Remark {
    export interface Location {
        line: number;
        column: number;
        offset: number;
    }

    export interface Position {
        start: Location;
        end: Location;
        indent: number[];
    }

    export interface NodeData {
        hProperties?: {
            [prop: string]: string;
        };
        htmlAttributes?: {
            [attr: string]: string;
        };
        hChildren?: {
            type: string;
            tagName: string;
            properties: {
                className: string[];
            };
        };
        id?: string;
    }

    export type ReferenceType = 'full' | 'shortcut' | 'collapsed';
    export type TableAlign = null | 'right' | 'left' | 'center';

    export interface Link {
        type: 'link';
        title: string | null;
        url: string;
        position?: Position;
        children: MarkdownNode[];
    }

    export interface Text {
        type: 'text';
        value: string;
        data?: NodeData;
        position?: Position;
    }

    export interface Heading {
        type: 'heading';
        depth: number;
        data: NodeData;
        position?: Position;
        children: MarkdownNode[];
    }

    export interface Paragraph {
        type: 'paragraph';
        position?: Position;
        children: MarkdownNode[];
    }

    export interface ListItem {
        type: 'listItem';
        loose: boolean;
        checked: boolean | null;
        position?: Position;
        children: MarkdownNode[];
    }

    export interface List {
        type: 'list';
        ordered: boolean;
        start: number | null;
        loose: boolean;
        position?: Position;
        children: MarkdownNode[];
    }

    export interface Code {
        type: 'code';
        lang: string | null;
        value: string;
        position?: Position;
        children?: MarkdownNode[];
    }

    export interface InlineCode {
        type: 'inlineCode';
        value: string;
        position?: Position;
    }

    export interface Image {
        type: 'image';
        title: string | null;
        url: string;
        alt: string | null;
        position?: Position;
    }

    export interface ImageReference {
        type: 'imageReference';
        identifier: string;
        referenceType: ReferenceType;
        alt: string | null;
        position?: Position;
    }

    export interface Definition {
        type: 'definition';
        identifier: string;
        title: string | null;
        url: string;
        position?: Position;
    }

    export interface LinkReference {
        type: 'linkReference';
        identifier: string;
        referenceType: ReferenceType;
        position?: Position;
        children: MarkdownNode[];
    }

    export interface Emphasis {
        type: 'emphasis';
        position?: Position;
        children: MarkdownNode[];
    }

    export interface Strong {
        type: 'strong';
        position?: Position;
        children: MarkdownNode[];
    }

    export interface ThematicBreak {
        type: 'thematicBreak';
        position?: Position;
    }

    export interface Blockquote {
        type: 'blockquote';
        position?: Position;
        children: MarkdownNode[];
    }

    export interface Html {
        type: 'html';
        value: string;
        position?: Position;
    }

    export interface TableCell {
        type: 'tableCell';
        position?: Position;
        children: MarkdownNode[];
    }

    export interface TableRow {
        type: 'tableRow';
        position?: Position;
        children: MarkdownNode[];
    }

    export interface Table {
        type: 'table';
        align: TableAlign[];
        position?: Position;
        children: MarkdownNode[];
    }

    export interface Delete {
        type: 'delete';
        position?: Position;
        children: MarkdownNode[];
    }

    export interface Root {
        type: 'root';
        position?: Position;
        children: MarkdownNode[];
    }

    export type MarkdownNode
        = Link
        | Text
        | Heading
        | Paragraph
        | ListItem
        | List
        | Code
        | InlineCode
        | Image
        | ImageReference
        | Definition
        | LinkReference
        | Emphasis
        | Strong
        | ThematicBreak
        | Blockquote
        | Html
        | TableCell
        | TableRow
        | Table
        | Delete
        | Root
    ;

    export interface CompilerPlugin {
        (processor: Unified.Processor, options: Unified.Options): Unified.Processor;
    }
    export interface TransformerPlugin {
        (processor: Unified.Processor, options: Unified.Options): (tree: Root, file?: Unified.VFile) => void;
    }
    export interface ParserPlugin {
        (processor: Unified.Processor, options: Unified.Options): Unified.Processor;
    }
}

declare module 'remark' {
    function remark(): Unified.Processor;
    export = remark;
}
declare module 'remark-parse' {
    const plugin: Remark.ParserPlugin;
    export = plugin;
}
declare module 'remark-slug' {
    const plugin: Remark.TransformerPlugin;
    export = plugin;
}
declare module 'remark-autolink-headings' {
    const plugin: Remark.TransformerPlugin;
    export = plugin;
}
declare module 'remark-github' {
    const plugin: Remark.TransformerPlugin;
    export = plugin;
}
declare module 'remark-toc' {
    const plugin: Remark.TransformerPlugin;
    export = plugin;
}
declare module 'remark-react' {
    const plugin: Remark.CompilerPlugin;
    export = plugin;
}
declare module 'remark-lint' {
    const plugin: Remark.CompilerPlugin;
    export = plugin;
}
declare module 'unist-util-visit' {
    interface Visitor {
        (node: Remark.MarkdownNode, type: 'link',           cb: (node: Remark.Link) => void): void;
        (node: Remark.MarkdownNode, type: 'text',           cb: (node: Remark.Text) => void): void;
        (node: Remark.MarkdownNode, type: 'heading',        cb: (node: Remark.Heading) => void): void;
        (node: Remark.MarkdownNode, type: 'paragraph',      cb: (node: Remark.Paragraph) => void): void;
        (node: Remark.MarkdownNode, type: 'listItem',       cb: (node: Remark.ListItem) => void): void;
        (node: Remark.MarkdownNode, type: 'list',           cb: (node: Remark.List) => void): void;
        (node: Remark.MarkdownNode, type: 'code',           cb: (node: Remark.Code) => void): void;
        (node: Remark.MarkdownNode, type: 'inlineCode',     cb: (node: Remark.InlineCode) => void): void;
        (node: Remark.MarkdownNode, type: 'image',          cb: (node: Remark.Image) => void): void;
        (node: Remark.MarkdownNode, type: 'imageReference', cb: (node: Remark.ImageReference) => void): void;
        (node: Remark.MarkdownNode, type: 'definition',     cb: (node: Remark.Definition) => void): void;
        (node: Remark.MarkdownNode, type: 'linkReference',  cb: (node: Remark.LinkReference) => void): void;
        (node: Remark.MarkdownNode, type: 'emphasis',       cb: (node: Remark.Emphasis) => void): void;
        (node: Remark.MarkdownNode, type: 'strong',         cb: (node: Remark.Strong) => void): void;
        (node: Remark.MarkdownNode, type: 'thematicBreak',  cb: (node: Remark.ThematicBreak) => void): void;
        (node: Remark.MarkdownNode, type: 'blockquote',     cb: (node: Remark.Blockquote) => void): void;
        (node: Remark.MarkdownNode, type: 'html',           cb: (node: Remark.Html) => void): void;
        (node: Remark.MarkdownNode, type: 'tableCell',      cb: (node: Remark.TableCell) => void): void;
        (node: Remark.MarkdownNode, type: 'tableRow',       cb: (node: Remark.TableRow) => void): void;
        (node: Remark.MarkdownNode, type: 'table',          cb: (node: Remark.Table) => void): void;
        (node: Remark.MarkdownNode, type: 'delete',         cb: (node: Remark.Delete) => void): void;
        (node: Remark.MarkdownNode, type: 'root',           cb: (node: Remark.Root) => void): void;
        (node: Remark.MarkdownNode, type: string,           cb: Function): void;
    }
    const v: Visitor;
    export = v;
}
