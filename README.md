Lison
=====

An executable JSON like Lisp, it can be parsed by Javascript, PHP, Python, ActionScript ...

`Lison` lets you easily use the same business logic in difference languages.

Visit https://github.com/pkuleon/Lison/wiki for more information.



## Usage
Sample code

```javascript
code = ["progn", 
    
    // set value
    ["=", "$cardSize", 1],
    
    // set value
    ["=", "$cardSize", 1000],

    // create a list
    ["list", "$AA", 0, 2, ["list", 66, "66", 88]],
    
    // create a hashtable
    ["hash", "$hash_a", {"key_1": "value_10"}],
    
    // set a key in a hashtable
    ["setk", "$hash_a", "key_1", "value_NEW"],
    
    // print something
    ["print", "getk form $hash_a:", ["getk", "$hash_a", "key_1"]],
    
    // while 
    ["=", "$i", 0], ["=", "$j", 300], 
    ["while", ["<", "$i", "$j"], [
        
        // if .. else
        ["if", ["<=", "$i" ,9], [
            ["print", "hahah <= 9"]
        ], [
            ["print", "hahah > 9"]
        ]],
        
        // push data to list
        ["push", "$AA", "$i"],
        
        // ++i
        ["incf", "$i"],
        
    ]],
    
    // for .. in
    ["forin", "$AA", ["$key", "$value"], [
        ["print", "form AA:", "$value"]
    ]],
    
    // print
    ["print", "var i = "],
    
    // return i
    ["print", "$i"]
    
];
```
