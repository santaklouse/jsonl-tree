# jsonl-tree

A simple way to encode nested tree structures of JSON objects.

Similar to the way languages such as [YAML](https://yaml.org/) and Python indent for scope, [jsonl-tree](https://github.com/vasil9v/jsonl-tree) extends the [jsonl](http://jsonlines.org/) spec slightly to allow easy construction of trees of the individual JSON objects.

Consider a JSON object that describes a `person` where you might have a field such as `"children": []` that nests recursively. It can get unwieldy to construct even a few levels of a tree of such objects and and unreadable to read when you try to actually nest the structures to conform to regular JSON.

With jsonl-tree you instead just use jsonl (newline separated JSON) but with the additional feature that there is leading whitespace indenting a child object.

As an example, this JSON object describing 4 generations of a part of a family tree:
```
{
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
            {
              "name": "Eros",
              "age": 25
            },
            {
              "name": "Phobos",
              "age": 20
            }
          ]
        },
        {
          "name": "Hebe",
          "age": 45
        }
      ]
    }
  ]
}
```

would simply become:
```
// nest=children
{"name": "Rheia", "age": 100}
  {"name": "Zeus", "age": 70}
    {"name": "Ares", "age": 50}
      {"name": "Eros", "age": 25}
      {"name": "Phobos", "age": 20}
    {"name": "Hebe", "age": 45}
```

If you save the above to a file `family.txt` When you run `cat family.txt | jsonl-tree` it will expand the jsonl-tree representation into the actual JSON with the nested objects built together. The `// nest=children` comment tells the jsonl-tree compiler to use the field name `children` for nesting the objects.

Note that the compiler also accepts the following syntax that will generate the same JSON. This is used to further compress the leading whitespace if necessary by using a leading int on each line specifying the nesting level:
```
// nest=children
0{"name": "Rheia", "age": 100}
1{"name": "Zeus", "age": 70}
2{"name": "Ares", "age": 50}
3{"name": "Eros", "age": 25}
3{"name": "Phobos", "age": 20}
2{"name": "Hebe", "age": 45}
```

This is obviously not very human readable at all and is only intended to be used as an intermediate representation that is output by other software tools.

Note that currently jsonl-tree only handles the nesting of objects by way of a single field name.

## Installation

```shell
npm i jsonl-tree
```

```javascript
import {JSONLTree} from "jsonl-tree";

...

const jlt = JSONLTree.fromJson(json1);

console.log('toString:', jlt.toString());

console.log('toJSON', jlt.toJSON());

// clear and fill it from file
const json2 = jlt.clear().fromFile(jltFilePath).toJSON();

// ensure that objects equals
should(json2).deepEqual(json1, 'deepEqual message');

const jlt2 = new JSONLTree().fromFile(jltFilePath).toJSON();
```

## Testing

```
npm test
```
