import {readFileSync, writeFileSync} from "node:fs";
import path from "path";
import {Buffer} from "node:buffer";
import * as jlt from "./lib/jsonl-tree.js";

const objectWithoutKey = (object, key) => {
    const {[key]: deletedKey, ...otherKeys} = object;
    return otherKeys;
}
const isString = (x) => Object.prototype.toString.call(x) === "[object String]";
const isSimpleObject = o => (o instanceof Object && o.constructor === Object);

export class JSONLTree {

    #dataStr = null;
    #dataJSON = null;

    static fieldName = 'children';

    constructor(str) {
        if (isString(str)) {
            this.#dataStr = str;
        }
    }

    get #json() {
        return this.#dataJSON;
    }

    set #json($val) {
        return this.#dataJSON = $val;
    }

    get #str() {
        return this.#dataStr;
    }

    set #str($val) {
        return this.#dataStr = $val;
    }

    clear() {
        this.#str = null;
        this.#json = null;
        return this;
    }

    #parseData() {
        switch (null) {
            case this.#str:
                this.#str = this.stringify();
                break
            case this.#json:
                this.#json = this.parse();
                break;
            default:
                break;
        }
        return this;
    }

    static jsonltree = (...args) => jlt.jsonltree.call(jlt, ...args);
    static getIndentation = (...args) => jlt.getIndentation.call(jlt, ...args);
    static jsonltreeLine = (...args) => jlt.jsonltreeLine.call(jlt, ...args);

    toJSON = () => this.#parseData().#json;
    toString = () => this.#parseData().#str;
    static stringify = (data) => JSONLTree.#stringifyTree(data);

    static parse = (str) => {
        try{
            console.log(str)
            return jlt.jsonltree(str)
        } catch (e) {
            console.error(e);
        }
    };

    parse() {
        if (!this.#str) {
            throw 'Nothing to parse. Data is empty.'
        }
        this.#json = JSONLTree.parse(this.#str);
        return this.#json;
    }

    stringify = () => {
        if (!this.#json) {
            throw 'Nothing to stringify. Data is empty.'
        }
        this.#str = JSONLTree.stringify(this.#json);
        return this.#str;
    }

    static #stringifyTree = (treeNode, level = 0) => {
        const tmpNode = objectWithoutKey(treeNode, this.fieldName);
        if (treeNode[this.fieldName]) {
            tmpNode[this.fieldName] = [];
        }
        let result = level + JSON.stringify(tmpNode);

        if (!treeNode[this.fieldName])
            return result;

        for(const child of treeNode.children) {
            result += "\n" + this.#stringifyTree(child, level+1)
        }
        return result;
    }

    readFile(filePath) {
        try {
            const result = readFileSync(path.resolve(filePath), {encoding: "utf8"});
            if (!result) {
                this.#str = null;
            }
            this.#str = result;
        } catch (err) {
            this.#str = null;
            throw 'readFile error: ' + err;
        } finally {
            return this;
        }
    }

    writeFile(filePath) {
        if (!this.#str) {
            if (!this.#json) {
                throw 'Nothing to write.'
            }
            this.#parseData();
        }

        try {
            const data = new Uint8Array(Buffer.from(`// nest=children\n` + this.#str));
            writeFileSync(path.resolve(filePath), data, {encoding: 'utf8'});
        } catch (err) {
            throw 'writeFile error: ' + err;
        }
    }

    fromFile(filePath) {
        return JSONLTree.fromFile(filePath);
    }

    static fromFile(filePath) {
        return new JSONLTree().readFile(filePath)
    }

    toFile(filePath) {
        this.writeFile(filePath);
        return this;
    }

    static fromJson(jsonObject) {
        if (!isSimpleObject(jsonObject)) {
            throw 'object expected'
        }
        return new JSONLTree(jsonObject)
    }

    static fromString(str) {
        if (!isString(str)) {
            throw 'string expected'
        }
        return new JSONLTree(str)
    }
}
