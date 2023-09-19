const jltSpaces = `// nest=children
{"name": "Rheia", "age": 100}
 {"name": "Zeus", "age": 70}
  {"name": "Ares", "age": 50}
   {"name": "Eros", "age": 25}
   {"name": "Phobos", "age": 20}
  {"name": "Hebe", "age": 45}`;

const jltSpaces2 = `// nest=children
{"name": "Rheia", "age": 100}
  {"name": "Zeus", "age": 70}
    {"name": "Ares", "age": 50}
      {"name": "Eros", "age": 25}
      {"name": "Phobos", "age": 20}
    {"name": "Hebe", "age": 45}`;

const jltNumbers = `// nest=children
0{"name": "Rheia", "age": 100}
1{"name": "Zeus", "age": 70}
2{"name": "Ares", "age": 50}
3{"name": "Eros", "age": 25}
3{"name": "Phobos", "age": 20}
2{"name": "Hebe", "age": 45}`;

const testData = {
  json: {
    "name": "Rheia",
    "age": 100,
    "children": [
      {
        "name": "Zeus",
        "age": 70,
        "children": [
          {
            "name": "Ares",
            "age": 50,
            "children": [
              {"name": "Eros", "age": 25},
              {"name": "Phobos", "age": 20}
            ]
          },
          {
            "name": "Hebe",
            "age": 45
          }
        ]
      }
    ]
  },
  jltSpaces: jltSpaces,
  jltSpaces2: jltSpaces2,
  jltNumbers: jltNumbers
};

import should from 'should';
import { JSONLTree } from "../index.js";

suite('jsonl-tree', () => {
  test('test deepEqual', (done) => {
    should({"one": 1, "foo": "bar"}).deepEqual({"foo": "bar", "one": 1});
    done();
  });
  test('getIndentation() works with spaces', (done) => {
    should(JSONLTree.getIndentation('  {"this": "is", "a": "test"}').level).equal(2);
    done();
  });
  test('getIndentation() works with numbers', (done) => {
    should(JSONLTree.getIndentation('2{"this": "is", "a": "test"}').level).equal(2);
    done();
  });
  test('convert jsonltree with spaces to JSON', (done) => {
    should(new JSONLTree(testData.jltSpaces).toJSON()).deepEqual(testData.json);
    done();
  });
  test('convert jsonltree with number indentation to JSON', (done) => {
    should(JSONLTree.fromString(testData.jltNumbers).toJSON()).deepEqual(testData.json);
    done();
  });
  test('convert jsonltree with doubled spaces to JSON', (done) => {
    should(JSONLTree.parse(testData.jltSpaces2)).deepEqual(testData.json);
    done();
  });
  test('convert json to jsonltree string', (done) => {
    should(JSONLTree.fromJson(testData.json).toString()).deepEqual(testData.jltSpaces2);
    done();
  });
  test('convert json to jsonltree string', (done) => {
    should(new JSONLTree(testData.json).toString()).deepEqual(testData.jltSpaces2);
    done();
  });
  test('convert json to jsonltree string', (done) => {
    should(JSONLTree.stringify(testData.json)).deepEqual(testData.jltNumbers);
    done();
  });
});
