"""

 @author pkuleon
 
"""

import json
import time
import re


class Lison(object):
    def __init__(self):
        self.obj = dict()
        
    def run(self, s):
        print s

    def add_method(self, method, name=None):
        if name is None:
            name = method.func_name
        setattr(self.__class__, name, lambda this, *args: method(*args))
    
    def get_method(self, name):
        return getattr(self, str(name), None)
        
lison = Lison()

MAX_LOOP = 30000

"""
    JSON	Python
    object	dict
    array	list
    string	unicode
    number (int) int, long
    number (real) float
    true	True
    false	False
    null	None
"""
def typeof_json(p):
    if (type(p) == str or type(p) == unicode):
        return 'string'
    elif (type(p) == int or type(p) == long or type(p) == float):
        return 'number'
    elif (type(p) == list):
        return 'array'
    elif (type(p) == dict):
        return 'object'
    return None
    
def is_obj_var(p):
    if (typeof_json(p) == 'string' and str(p)[0] == '$'):
        return True
    return False    
        
def obj_var(p):
    # is a variable ?
    if (typeof_json(p) == 'string'):
        # replace 1st $
        _var = str(p).replace('$', '', 1);
        
        #has key ?
        if (_var in lison.obj):
            return lison.obj[_var]
            
        return p
        
    return p
    
def obj_assign(_var, _value):
    if (is_obj_var(_var)):
        _actual_var = str(_var).replace('$', '' ,1)
        
        lison.obj[_actual_var] = _value
        return _value
        
    return _value
    
def throw_error(p):
    print str(p)
    raise Exception
    
    
"""
basic calculate
"""

def incf(p):
    _var = p[0]
    _value = obj_var(_var)
    if (typeof_json(_value) == 'number'):
        return obj_assign(_var, (obj_var(_var) + 1))
    else:
        throw_error('Invalid expression')
    return None
    
def add(p):
    if (typeof_json(p[0]) == typeof_json(p[1]) == 'number'):
        return p[0] + p[1]
    else:
        return str(p[0]) + str(p[1])

def sub(p):
    return p[0] - p[1];

def multiply (p):
    return p[0] * p[1];

def div (p):
    return p[0] * p[1];

def sign_mod():
    return p[0] % p[1];

def more_than(p):
    return p[0] > p[1];

def less_than(p):
    return p[0] < p[1];

def more_than_eq(p):
    return p[0] >= p[1];

def less_than_eq(p):
    return p[0] <= p[1];

def equal(p):
    return p[0] == p[1];
    
def not_equal(p):
    return p[0] != p[1];
    

lison.add_method(incf, 'incf')
lison.add_method(incf, '++')
lison.add_method(add, '+')
lison.add_method(sub, '-')
lison.add_method(multiply, '*')
lison.add_method(div, '/')
lison.add_method(sign_mod, '%')
lison.add_method(more_than, '>')
lison.add_method(less_than, '<')
lison.add_method(more_than_eq, '>=')
lison.add_method(less_than_eq, '<=')
lison.add_method(equal, '==')
lison.add_method(not_equal, '!=')
lison.add_method(not_equal, 'not')


"""
set an environment variable
"""
def lison_set(p):
    try:
        _var = p[0];
        _value = p[1];
        
        if (is_obj_var(_var)):
            obj_assign(_var, _value)
        else:
            throw_error('Invalid variable name')
        
        return _value
        
    except Exception:
        throw_error('set error')
        return 0
        
lison.add_method(lison_set, 'set')
lison.add_method(lison_set, '=')

def lison_list(p):
    return list(p)
    
def lison_pop(p):
    return list.pop(p[0], p[1])
    
def lison_push(p):
    return list.push(p[0], p[1])
    
def lison_len(p):
    return len(p[0])
    
def lison_append(p):
    return list(p[0]) + list(p[1])
    
def lison_substr(p):
    if (p[0] == None):
        begin = 0
        
    if (p[1] == None):
        end = 0
    
    return p[int(begin) : int(end)]
    
lison.add_method(lison_list, 'list')
lison.add_method(lison_pop, 'pop')
lison.add_method(lison_push, 'push')
lison.add_method(lison_len, 'len')
lison.add_method(lison_append, 'append')
lison.add_method(lison_substr, 'substr')


"""
loop
"""
def loop_while(p):
    if (typeof_json(p) == 'array' and len(p) == 2):
        
        i = 0
        # clone an execute code
        condition = p[0]
        doit = p[1]
        
        #print ['progn'] + list(doit)
        
        while (progn(condition)):
            #progn(['progn'].append(doit));
            progn(['progn'] + list(doit))
            
            # prevent the crash
            i = i + 1
            #print 'AAA' +str(i)
            if i > MAX_LOOP:
                break
                return 0
                
    return 0
    
lison.add_method(loop_while, 'while')


def loop_forin(p):
    target = p[0]
    key_value = p[1]
    key_var = 0
    value_var = 0
    doit = p[2]
    
    if (len(key_value) >= 2):
        key_var = str(key_value[0]).replace('$', '', 1)
        value_var = str(key_value[1]).replace('$', '', 1)
    else:
        throw_error('syntax error: forin')
        
    i = 0
    
    if (type(doit) == list):
        for key in range(len(target)):
            # set temp var
            lison.obj[key_var] = key
            lison.obj[value_var] = target[key]
            
            progn(['progn'] + list(doit))
            
            # prevent the crash
            if i > MAX_LOOP:
                break
                
    
    elif (type(doit) == dict):
        for key in target:
            # set temp var
            lison.obj[key_var] = key
            lison.obj[value_var] = target[key]
            
            progn(['progn'] + list(doit))
            
            # prevent the crash
            if i > MAX_LOOP:
                break
    
    del lison.obj[key_var]
    del lison.obj[value_var]
    
    return 0
    
lison.add_method(loop_forin, 'forin')


def lison_print(p):
    print str(p)
    
lison.add_method(lison_print, 'print')



def progn(p):
    
    # use p.shift is the fastest way to check which is an array ! (in javascript)
    if (typeof_json(p) == 'array'):
        fn_name = p[0]
        
        # is a function
        fn = lison.get_method(str(fn_name))
        if fn is not None:
            
            # start from 1, dont pass the fn name
            start_param = 1;
            
            # for special treatment these fn, keep it the 1st argument will not be executed
            if (fn_name == '=' \
                or fn_name == 'set' \
                or fn_name == '++' \
                or fn_name == 'incf' \
                or fn_name == 'while' \
                ):
                
                start_param = 2
            
            p_result = [];
            
            for i in range(start_param, len(p)):
                p_result.append(progn(p[i])) #p_result.push(progn(p[i]))
            
            if (start_param == 2):
                list.insert(p_result, 0, p[1]) #p_result.unshift(p[1])
            
            return fn(p_result)
            
        else:
            # get the value directly
            return obj_var(p)
            
        
    elif (typeof_json(p) == 'string'):
        return obj_var(p)
        
    elif (typeof_json(p) == 'number'):
        return p

    # get the value directly
    return obj_var(p)

lison.add_method(progn, 'progn')

"""
code = json.loads('["+", ["+", 3.3, 5], "BBB"]')
out = lison.progn(code)
print out
"""

def native_benchmark():
    i = 0
    j = 20000
    while(i<j):
        print i
        i = i + 1
        
    dict_aa = (4,6,8,0)
    for key in range(len(dict_aa)):
        print "sb haha"
    
    print j
    
    


json_code = '''
["progn", 

    // test
    
    ["=", "$i", 0],
    ["=", "$j", 20],
    ["while", ["<", "$i", "$j"], [
        ["print", "$i"],
        ["incf", "$i"]
    ]],
    
    
    ["=", "$dict_aa", ["list",4,6,8,0]],
    
    ["forin", "$dict_aa", ["$key", "$value"], [
        ["print", "forin haha"]
    ]],
    
    ["print", "$j"]
]
'''
# remove all comment
code = json.loads(re.sub(r'(\/\*[\w\'\s\r\n\*]*\*\/)|(\/\/[\w\s\']*)', "", json_code))

start_time = time.time()
lison.progn(code)
print "lison: ", time.time() - start_time, "seconds"
#native_benchmark()
#print "native: ", time.time() - start_time, "seconds"


