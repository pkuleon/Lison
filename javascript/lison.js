/**
 * ...
 * @author pkuleon
 */

(function(root){
    "use strict";
    
    var lison = function(express, context){
        express = express || [];
        context = context || {};
            
        var MAX_LOOP = 65535; //Math.pow(2,16)-1; // 16bit = 65535
        
        function is_context_var(p){
            if (typeof p == 'string' && p[0] == '$'){
                return true;
            }
            return false;
        }
        
        function to_context_var(p){
            return String(p).replace('$', '');
        }
        
        function context_var(p){
            //var begin_t = new Date();
            // is a variable ?
            if (typeof p == 'string'){
                //var m = p.match(/\$(.*)/);
                //var _var = p[1] || p;
                var _var = to_context_var(p);
                
                // has key ?
                if (context.hasOwnProperty(_var)){
                    return context[_var];
                }
                return p;
            }
            return p || 0;
        }
        
        function context_assign(_var, _value){
            if (is_context_var(_var)){
                context[to_context_var(_var)] = _value;
                return _value;
            }
            return _value;
        }
        
        function auto_gc(){
            for (var i in context_var){
                if (context_var[i] = undefined){
                    delete context_var[i];
                }
            }
        }
        
        function throw_error(err){
            // SyntaxError
            // throw new Error(err);
            try{
                console && console.error && console.error(err);
            }catch(e){}
        }
        
        // function list
        var defun = {};
        
        var self = {
            /**
             * Mathematical methods
             *  
             * @name math
             * @namespace
             */
            
            /**
             * Calculate the absolute value of a number
             * @name math.abs
             * @function
             * @param {Number} x A Number
             * @return {Number} x value
             * @example
             *     ["abs", -10]
             *     >> 10
             */
            'abs': function(p){
                return Math.abs.apply(null, p);
            },
            
            /**
             * Returns x, rounded upwards to the nearest integer
             * @name math.ceil
             * @function
             * @param {Number} x A Number
             * @return {Number} x value
             * @example
             *     ["ceil", 1.4]
             *     >> 2
             */
            'ceil': function(p){
                return Math.ceil.apply(null, p);
            },
            
            /**
             * Returns the cosine of x (x is in radians)
             * @name math.cos
             * @function
             * @param {Number} x A Number
             * @return {Number} x value
             * @example
             *     ["cos", 3]
             *     >> -0.9899924966004454
             */
            'cos': function(){
                return Math.cos.apply(null, p);
            },
            
            /**
             * Returns the value of Ex
             * @name math.exp
             * @function
             * @param {Number} x A Number
             * @return {Number} x value
             * @example
             *     ["exp", 1]
             *     >> 2.718281828459045
             */
            'exp': function(){
                return Math.exp.apply(null, p);
            },
            
            /**
             * Returns x, rounded downwards to the nearest integer
             * @name math.floor
             * @function
             * @param {Number} x A Number
             * @return {Number} x value
             * @example
             *     ["floor", 1.6]
             *     >> 1
             */
            'floor': function(){
                return Math.floor.apply(null, p);
            },
            
            
            /**
             * Returns the natural logarithm (base E) of x
             * @name math.log
             * @function
             * @param {Number} x A Number
             * @return {Number} x value
             * @example
             *     ["log", 2]
             *     >> 0.6931471805599453
             */
            'log': function(){
                return Math.log.apply(null, p);
            },
            
            /**
             * Returns the number with the highest value
             * @name math.max
             * @function
             * @param {Number} ... Multiple arguments
             * @return {Number} x value
             * @example
             *     ["max", 5, 10]
             *     >> 10
             */
            'max': function(){
                return Math.max.apply(null, p);
            },
            
            /**
             * Returns the number with the lowest value
             * @name math.min
             * @function
             * @param {Number} ... Multiple arguments
             * @return {Number} x value
             * @example
             *     ["min", 5, 10]
             *     >> 5
             */
            'min': function(){
                return Math.min.apply(null, p);
            },
            
            
            /**
             * Returns the value of x to the power of y
             * @name math.pow
             * @function
             * @param {Number} x A Number
             * @param {Number} y A Number
             * @return {Number} value value
             * @example
             *     ["pow", 2, 8]
             *     >> 256
             */
            'pow': function(){
                return Math.pow.apply(null, p);
            },
            
            /**
             * Returns a random number between x and y
             * @name math.random
             * @function
             * @param {Number} x A Number
             * @param {Number} y A Number
             * @return {Number} value value
             * @example
             *     ["random", 1, 10]
             *     >> 3
             */
            'random': function(){
                if (p.length >= 2){
                    var from = p[0], to = p[1];
                    return Math.floor(Math.random()*(to-from+1)+from);
                }
                return Math.random();
            },
            
            /**
             * Rounds x to the nearest integer
             * @name math.round
             * @function
             * @param {Number} x A Number
             * @return {Number} value value
             * @example
             *     ["round", 2.5]
             *     >> 3
             */
            'round': function(){
                return Math.round.apply(null, p);
            },
            
            /**
             * Returns the sine of x (x is in radians)
             * @name math.sin
             * @function
             * @param {Number} x A Number
             * @return {Number} x value
             * @example
             *     ["sin", 3]
             *     >> 0.1411200080598672
             */
            'sin': function(){
                return Math.sin.apply(null, p);
            },
            
            /**
             * Returns the square root of x
             * @name math.sqrt
             * @function
             * @param {Number} x A Number
             * @return {Number} x value
             * @example
             *     ["sqrt", 9]
             *     >> 3
             */
            'sqrt': function(){
                return Math.sqrt.apply(null, p);
            },
            
            /**
             * Returns the tangent of an angle
             * @name math.tan
             * @function
             * @param {Number} x A Number
             * @return {Number} x value
             * @example
             *     ["tan", 90]
             *     >> -1.995200412208242
             */
            'tan': function(){
                return Math.tan.apply(null, p);
            },
            
            
            /**
             * Increase 1 by itself
             * @name incf
             * @function
             * @param {Number} x A Number
             * @return {Number} x value
             * @example
             *     ["=", "$a", 1]
             *     ["incf", "$a"]
             *     >> 2
             *     ["++", "$a"]
             *     >> 3
             */
            'incf': function(p){
                var _var = p[0],
                    _value = context_var(_var);
                
                if (typeof _value == 'number'){
                    return context_assign(_var, (context_var(_var) + 1))
                }else{
                    throw_error('Invalid expression');
                }
                return null;
            },
            
            /**
             * Alias of {@link incf}
             * @name ++
             * @function 
             */
            '++': function(p){
                return self.incf(p);
            },
            
            /**
             * Add
             * @name +
             * @function
             * @param {Number|String} a A Number
             * @param {Number|String} b A Number
             * @return {Number} x value
             * @example
             *     ["+", 10, 1]
             *     >> 11
             */
            '+': function(p){
                return p[0] + p[1];
            },
            
            /**
             * Sub
             * @name -
             * @function
             * @param {Number} a A Number
             * @param {Number} b A Number
             * @return {Number} x value
             * @example
             *     ["-", 10, 1]
             *     >> 9
             */
            '-': function(p){
                return p[0] - p[1];
            },
            
            /**
             * Multiply
             * @name *
             * @function
             * @param {Number} a A Number
             * @param {Number} b A Number
             * @return {Number} x value
             * @example
             *     ["*", 6, 4]
             *     >> 24
             */
            '*': function(p){
                return p[0] * p[1];
            },
            
            /**
             * Div
             * @name /
             * @function
             * @param {Number} a A Number
             * @param {Number} b A Number
             * @return {Number} x value
             * @example
             *     ["/", 6, 3]
             *     >> 2
             */
            '/': function(p){
                return p[0] * p[1];
            },
            
            /**
             * Mod
             * @name mod
             * @function
             * @param {Number} a A Number
             * @param {Number} b A Number
             * @return {Number} x value
             * @example
             *     ["/", 9, 2]
             *     >> 1
             */
            'mod': function(){
                return p[0] % p[1];
            },
            
            /**
             * More than
             * @name >
             * @function
             * @param {Number} a A Number
             * @param {Number} b A Number
             * @return {Boolean} x value
             * @example
             *     [">", 10, 2]
             *     >> true
             */
            '>': function(p){
                return p[0] > p[1];
            },
            
            /**
             * Less than
             * @name <
             * @function
             * @param {Number} a A Number
             * @param {Number} b A Number
             * @return {Boolean} x value
             * @example
             *     ["<", 10, 20]
             *     >> true
             */
            '<': function(p){
                return p[0] < p[1];
            },
            
            /**
             * More than or equal
             * @name >=
             * @function
             * @param {Number} a A Number
             * @param {Number} b A Number
             * @return {Boolean} x value
             * @example
             *     [">=", 10, 10]
             *     >> true
             */
            '>=': function(p){
                return p[0] >= p[1];
            },
            
            /**
             * Less than or equal
             * @name <=
             * @function
             * @param {Number} a A Number
             * @param {Number} b A Number
             * @return {Boolean} x value
             * @example
             *     ["<=", 10, 10]
             *     >> true
             */
            '<=': function(p){
                return p[0] <= p[1];
            },
            
            /**
             * Is equal ?
             * @name ==
             * @function
             * @param {Any} a A Number
             * @param {Any} b A Number
             * @return {Boolean} x value
             * @example
             *     ["==", 10, 10]
             *     >> true
             *     ["==", 10, "10"]
             *     >> false
             */
            '==': function(p){
                // use the strict 
                return p[0] === p[1];
            },
            
            /**
             * Is not equal ?
             * @name not
             * @function
             * @param {Any} a A Number
             * @param {Any} b A Number
             * @return {Boolean} x value
             * @example
             *     ["!=", 10, 11]
             *     >> true
             */
            'not': function(p){
                return p[0] != p[1];
            },
            /**
             * Alias of {@link not}
             * @name !=
             * @function 
             */
            '!=': function(p){
                return self.not(p);
            },
            
            /**
             * And ...
             * @name and
             * @function
             * @param {Any} ... Multiple arguments
             * @return {Boolean} x value
             * @example
             *     ["and", condition A, condition B, ...]
             *     >> true
             */
            'and': function(p){
                var _value = true;
                for (var i=0,j=p.length; i<j; i++){
                    if (!p[i]) return false;
                }
                return _value;
            },
            
            /**
             * Or ...
             * @name or
             * @function
             * @param {Any} ... Multiple arguments
             * @return {Boolean} x value
             * @example
             *     ["or", condition A, condition B, ...]
             *     >> true
             */
            'or': function(p){
                var _value = false;
                for (var i=0,j=p.length; i<j; i++){
                    if (p[i]) return true;
                }
                return _value;
            },
            
            /** set an environment variable  */
            
            /**
             * Set a variable
             * @name set
             * @function
             * @param {String} name Variable name
             * @param {Any} x value
             * @return {Any} x value
             * @example
             *     ["set", "$A", 10]
             *     ["=", "$A", 10]
             *     >> A = 10
             */
            'set': function(p){
                try{
                    return context_assign(p[0], p[1]);
                }catch(e){
                    throw_error(String(e));
                    return 0;
                }
            },
            /**
             * Alias of {@link set}
             * @name =
             * @function 
             */
            '=': function(p){
                return self['set'](p);
            },
            
            /**
             * Get a variable
             * @name get
             * @function
             * @param {String} name Variable name
             * @return {Any} x value
             * @example
             *     ["set", "$A", 10]
             *     ["get", "$A"]
             *     >> A = 10
             */
            'get': function(p){
                //alert(p);
                if (p.length > 1){
                    var _var = p[1] || '';
                    var _value = null;
                    
                    if (_var.substr(0,1) == '$'){
                        var _var = p.replace('$', '');
                        return context[_var] || _value;
                    }else{
                        return throw_error('Invalid variable name');
                    }
                    
                }
                return throw_error('Invalid variable name');
            },
            
            /**
             * List
             *  
             * @name list
             * @namespace
             */
            /**
             * Create a list
             * @name list.list
             * @function
             * @param {Any} ... Multiple arguments
             * @return {list} x value
             * @example
             *     ["=", "$A", ["list", 1,2,3,4,5]]
             *     >> A = 1,2,3,4,5
             */
            'list': function(p){
                return p;
            },
            
            /**
             * Pop form a list
             * @name list.pop
             * @function
             * @param {list} list a list
             * @return {list} x value
             * @example
             *     ["=", "$A", ["list", 1,2,3,4,5]]
             *     ["pop", "$A"]
             *     >> A = 1,2,3,4
             */
            'pop': function(p){
                return p[0] && p[0].pop && p[0].pop();
            },
            
            /**
             * Push to a list
             * @name list.push
             * @function
             * @param {list} list a list
             * @param {Any} x push x to the list
             * @return {list} x value
             * @example
             *     ["=", "$A", ["list", 1,2,3,4,5]]
             *     ["push", "$A", "Something"]
             *     >> A = 1,2,3,4,5,Something
             */
            'push': function(p){
                return p[0] && p[0].push && p[0].push(p[1]);
            },
            
            /**
             * Get length of a list
             * @name list.len
             * @function
             * @param {list} list a list
             * @return {Number} x value
             * @example
             *     ["=", "$A", ["list", 1,2,3,4,5]]
             *     ["len", "$A"]
             *     >> 5
             */
            'len': function(p){
                return p[0] && p[0].length || 0;
            },
            
            /**
             * Get length of a list
             * @name list.append
             * @function
             * @param {list} list a list
             * @return {Number} x value
             * @example
             *     ["append", ["list", "A","B","C"], ["list", 1,2,3,4,5]]
             *     >> A,B,C,1,2,3,4,5
             */
            'append': function(p){
                return p[0] && p[1] && ([].concat(p[0]).concat(p[1]));
            },
            
            /**
             * String Processing
             *  
             * @name string
             * @namespace
             */
            /**
             * Get Substring
             * @name string.substr
             * @function
             * @param {String} string text
             * @param {Number} form
             * @param {Number} length
             * @return {String} x value
             * @example
             *     ["substr", "Hello Lison", 1, 2]
             *     >> el
             */
            'substr': function(p){
                return p[0].substr(p[1], p[2]);
            },
            
            /**
             * Replace string
             * @name string.replace
             * @function
             * @param {String} a text
             * @param {String} find RegExp string
             * @param {String} b text
             * @return {String} x value
             * @example
             *     ["replace", "Hello Lison", "Li", "J"]
             *     >> Hello Json
             */
            'replace': function(p){
                return p[0].replace(new RegExp(String(p[1])), p[2]);
            },
            
            /**
             * Hash
             *  
             * @name hash
             * @namespace
             */
            /**
             * Create a hash
             * @name hash.hash
             * @function
             * @param {Hash} x value
             * @return {Hash} x value
             * @example
             *     ["=", "$hash_a", ["hash", {"key": "value"}]]
             *     ["getk", "$hash_a", "key"]
             *     >> value
             */
            'hash': function(p){
                return p[0];
            },
            /**
             * Get value from hash
             * @name hash.getk
             * @function
             * @param {Hash} x value
             * @param {String} key key of the hash
             * @return {String} x value
             * @example
             *     ["=", "$hash_a", ["hash", {"key": "value"}]]
             *     ["getk", "$hash_a", "key"]
             *     >> value
             */
            'getk': function(p){
                return p[0][p[1]];
            },
            /**
             * Set value to hash
             * @name hash.setk
             * @function
             * @param {Hash} x value
             * @param {String} key key name
             * @param {Any} value the value
             * @return {Hash} x value
             * @example
             *     ["=", "$hash_a", ["hash", {"key": "value"}]]
             *     ["getk", "$hash_a", "key"]
             *     >> value
             *     ["setk", "$hash_a", "key", "new_value"]
             *     ["getk", "$hash_a", "key"]
             *     >> new_value
             */
            'setk': function(p){
                p[0][p[1]] = p[2];
                return p[2];
            },
            
            
            /** case */
            /**
             * If [condition] do [something] else [another]
             * @name if
             * @function
             * @param {Any} condition
             * @param {Any} something is true ?
             * @param {Any} another is false ?
             * @example
             *     ["if", ["<=", "$i" ,9], [
             *         ["print", "hahah <= 9"]
             *     ], [
             *         ["print", "hahah > 9"]
             *     ]],
             */
            'if': function(p){
                //alert(p);
                //return (p[0] ? (p[1] || null) : (p[2] || null));
                var _if = p[1],
                    _else = p[2];
                    
                if (p[0] && _if){
                    self.progn(['progn'].concat(_if));
                }else if(_else){
                    self.progn(['progn'].concat(_else));
                }
            },
            /**
             * Alias of {@link if}, (?:A,B)
             * @name ?
             * @function 
             */
            '?': function(p){
                return self['if'](p);
            },
            
            /** loop */
            /**
             * Forin [list or hash] get [key, value] do [something]
             * @name forin
             * @function
             * @param {Any} condition
             * @param {Any} something
             * @example
			 *     ["=", "$A", ["list", "Lima", 6, 7, 8, "Nine"]],
             *     ["forin", $A, ["$index", "$value"], [
             *         ["print", "$index", "$value"],
             *         ["print", "$value"]
             *     ]],
			 *     >> 0 Lima
			 *     >> 1 6
			 *     >> 2 7
			 *     >> 3 8
			 *     >> 4 Nine
             */
            'forin': function(p){
                var target = p[0],
                    key_value = p[1],
                    key_var = 0,
                    value_var = 0,
                    doit = p[2];
                
                var begin_t = new Date();
                
                if (key_value.length > 1){
                    if (is_context_var(key_value[0]))
                        key_var = to_context_var(key_value[0])
                    else
                        throw_error('syntax error: Invalid variable as key(index) in forin');
                        
                    if (is_context_var(key_value[1]))
                        value_var = to_context_var(key_value[1])
                    else
                        throw_error('syntax error: Invalid variable as value in forin');
                        
                }else{
                    throw_error('syntax error: Unexpected token forin')
                }
                
                //console.log('foreach', target, key_value, key_var, value_var);
                var i = 0;
                if (target.shift && target.length){
                    for (var key=0,key_len = target.length; key < key_len; key ++){
                        // set temp var
                        context[key_var] = key;
                        context[value_var] = target[key];
                        
                        self.progn(['progn'].concat(doit));
                        // prevent the crash
                        i ++;
                        if (i > MAX_LOOP) break;
                    }
                }else{
                    for (var key in target){
                        // set temp var
                        context[key_var] = key;
                        context[value_var] = target[key];
                        
                        self.progn(['progn'].concat(doit));
                        // prevent the crash
                        i ++;
                        if (i > MAX_LOOP) break;
                    }
                }
                
                delete context[key_var];
                delete context[value_var];
                
                var end_t = new Date();
                console.log('"forin" duration:', end_t - begin_t);
                
                /*
                    // benchmark
                    var i = 0;
                    var begin_t = new Date();
                    for (var key in target){
                        console.log(target[key]);
                        
                        i ++;
                        if (i > MAX_LOOP) break;
                    }
                    var end_t = new Date();
                    console.log('"forin native" duration:', end_t - begin_t);
                */
            },
			
            /**
             * While [condition] do [something]
             * @name while
             * @function
             * @param {Any} condition
             * @param {Any} something
             * @example
			 *     ["=", "$i", 0],
             *     ["while", ["<", "$i" ,100], [
             *         ["print", "$i"],
			 *         ["incf", "$i"]
             *     ]],
			 *     >> repeat print 100 times
             */
            'while': function(p){
                //console.log(p);
                if (p.length && p.length == 2){
                    
                    var i = 0,
                        // clone an execute code
                        condition = p[0],
                        doit = p[1];
                    
                    var begin_t = new Date();
                    
                    while (self.progn(condition)){
                        self.progn(['progn'].concat(doit));
                        // prevent the crash
                        i ++;
                        if (i > MAX_LOOP) break;
                    }
                    
                    var end_t = new Date();
                    console.log('"do" duration:', end_t - begin_t);
                    
                    
                    /*
                    // benchmark
                    var i = 0;
                    var begin_t = new Date();
                    while (1){
                        i ++;
                        //~ self.progn([['progn'],
                                //~ ['set', '$k', 100]
                        //~ ]);
                        
                        if (i < 9){ console.log('native < 9') }else{ console.log('native > 9') }
                        context['k'] = 100;
                        // prevent the crash
                        if (i > MAX_LOOP) break;
                    }
                    var end_t = new Date();
                    console.log('"do native" duration:', end_t - begin_t);
                    
                    
                    
                    //~ eval(
                        //~ "\n                var i = 0;\n\n var begin_t = new Date();\n while (1){\n    i ++; \n     if (i == 9) console.log('9 == i');  context['k'] = 100; \n    // prevent the crash\n    if (i > 90000) break;\n}\n\nvar end_t = new Date();\nconsole.log('\"do eval\" duration:', end_t - begin_t);\n"
                    //~ )
                    */
                }
                
                return 0;
            },
            
            /**
             * Print something
             * @name print
             * @function
             * @param {Any} ... Multiply arguments
             * @example
			 *     ["print", "$i", "test", 1234]
             */
            'print': function(p){
                try{
                    console && console.log.apply(console, p);
                }catch(e){};
                return p;
            },
			
            /**
             * Start a program
             * @name progn
             * @function
             * @param {Any} ... Multiply arguments
             */
            'progn': function(p){
                
                // use p.shift is the fastest way to check which is an array !
                if (p.shift && p.length){
                    var fn_name = p[0];
                    //console.log(p);
                    // is a function
                    if (self[fn_name]){
                        
                        // start from 1, dont pass the fn name
                        var start_param = 1;
                        
                        // for special treatment these fn, keep it the 1st argument will not be executed
                        if (fn_name == '='
                            || fn_name == 'set' 
                            || fn_name == '++' 
                            || fn_name == 'incf' 
                            || fn_name == 'while'
                        ){
                            start_param = 2;
                        }
                        
                        var p_result = [];
                        for (var i=start_param,j=p.length;i<j;i++){
                            p_result.push(self.progn(p[i]));
                        }
                        
                        if (start_param == 2) p_result.unshift(p[1]);
                        
                        return self[fn_name](p_result);//self.progn(p_result));
                        
                    }else{
                        // get the value directly
                        return context_var(p);
                    }
                    
                }else if (typeof p == 'string'){
                    return context_var(p);
                    
                }else if (typeof p == 'number'){
                    return p;
                }
                
                // get the value directly
                return context_var(p);
            }
        };
        
        var return_res = self.progn(express);
        
        // is progn ?
        if (express[0] == 'progn'){
            // return the last line as the value
            return_res = String(return_res[return_res.length-1]);
        }
        
        return return_res;
    };
    
    
    if (typeof exports === "object" && exports) {
        exports = lison; // CommonJS
    }else if (typeof coco === "object" && coco && coco.register) {
        coco.register('lison', lison);
    }if (typeof window === "object" && window) {
        window.lison = lison;
    }else{
        root.lison = lison; // <script>
    }
    
})(this);

// TODO: push pop len
// find reg
// Math cos  exp expt floor incf isqrt logand logior max min mod nil not or random round sin sqrt t zerop
//example:
var s2222 = ["-", ["*","$cardSize",10], 70];
var s = ["progn", 
    //~ ["set", "$i", 0],
    
    ["=", "$cardSize", 1],
    ["=", "$cardSize", 1000],
    //~ ["set", "$j", 1000], // 90000
    
    //["list", "$AA", ],
    
    //["list", "$S", 0, 2, 4],
    ["=", "$AA", ["list", 0, 2, ["list", 66, "66", 88]]],
    
    ["=", "$hash_a", ["hash", {"key_1": "value_10"}]],
    
    ["setk", "$hash_a", "key_1", "value_NEW"],
    
    ["print", "getk form $hash_a:", ["getk", "$hash_a", "key_1"]],
    
    //["print", ["and", ["<", 10, 1], [">", 10, 5]]],
    
    ["=", "$i", 0],
    ["=", "$j", 200], // 90000
    ["while", ["<", "$i", "$j"], [
        
        //~ //["set", "$i", ["+", "$i", 1]],
        //["set", "$i", ["+", "$i", 1]]
        
        ["if", ["<=", "$i" ,9], [
            ["print", "hahah <= 9"]
        ], [
            ["print", "hahah > 9"]
        ]],
    
        ["push", "$AA", "$i"],
        
        //["=", "$i", ["+", "$i", 1]]
        ["incf", "$i"]
        
        //["set", "$k", 300]
        //["print", "$i"]
    ]],
    
    
    //~ ["forin", ['list',3,4,5], ["$key", "$value"], [
        //~ ['print', '$value']
    //~ ]],
    
    ["forin", "$AA", ["$key", "$value"], [
        //["print", "form AA:", "$value"]
        ["print", "forin haha"]
    ]],
    
    ["print", "var i = "],
    ["print", "$i"]
    
];




var g_var = {'cardSize': 21};
var out = lison(s, g_var);

//console.log(out);


/*

https://acl.readthedocs.org/en/latest/zhTW/ch2.html

//})();
*/
