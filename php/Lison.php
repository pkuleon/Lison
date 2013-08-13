<?php
/**
* 
*/
class Lison {
	
	function __construct()
	{
	}

	public $context;
	private $line;
	private $code;
	private $func_map = array('+' => 'add',
						  '-' => 'sub',
						  '*' => 'mul',
						  '/' => 'div',
						  '%' => 'mod',
						  '=' => 'assign',
						  '>' => 'gt',
						  '<' => 'lt',
						  '>=' => 'gte',
						  '<=' => 'lte',
						  '==' => 'eq',
						  '!=' => 'neq',
						  'print' => 'output',
						  'list' => 'lsn_list',
						  'incf' => 'incf',
						  '++' => 'incf',
						  'hash' => 'lsn_hash',
						  'forin' => 'lsn_forin',
						  'while' => 'lsn_while',
						  'push' => 'lsn_push',
						  'setk' => 'setk');

	public function progn($prog, $context = null) {
		// var_dump($context);
		$this->context = empty($context) ? array() : $context;
		// var_dump($this->context);
		if (empty($prog) || !is_array($prog)) {
			throw new Exception('prog format error');
		}

		foreach($prog as $line => $code) {
			$result = $this->expr($code);
		}

		return $result;
	}

	public function expr($expr) {
		if ($this->executable($expr)) {
			$op = array_shift($expr);
			$params = $expr;
			$result = call_user_func_array(array($this, $this->func_map[$op]), $params);
		} else {
			if ($this->isValidSymbol($expr)) {
				return $this->context[$this->getSymbolName($expr)];
			} else {
				return $expr;
			}
		}

		return $result;
	}

	public function executable($expr) {
		if (is_array($expr) && isset($expr[0]) && isset($this->func_map[$expr[0]])) {
			return true;
		} else {
			return false;
		}
	}

	public function isValidSymbol($symbol) {
		if (is_string($symbol) && strlen($symbol) > 1) {
			return preg_match('/^\$[A-Za-z0-9_]+/', $symbol);
		} else {
			return false;
		}
	}
	public function getSymbolName($symbol) {
		if ($this->isValidSymbol($symbol)) {
			return substr($symbol, 1);
		} else {
			throw new Exception('symbol name not valid:' . $symbol);
		}
	}

	public function output() {
		$params = func_get_args();
		$output = '';
		foreach($params as $param) {
			$output .= $this->expr($param);
		}
		
		echo $output;
		return $output;
	}

	public function assign($symbol, $value) {
		$symbolName = $this->getSymbolName($symbol);
		$value = $this->expr($value);
		$this->context[$symbolName] = $value;
		return $value;
	}

	public function incf($symbol) {
		return $this->assign($symbol, $this->expr($symbol) + 1);
	}

	public function add($num1, $num2) {
		$num1 = $this->expr($num1);
		$num2 = $this->expr($num2);
		if (!is_numeric($num1) || !is_numeric($num2)) {
			return $num1 . $num2;
		} else {
			return $num1 + $num2;
		}
	}
	public function sub($num1, $num2) {
		$num1 = $this->expr($num1);
		$num2 = $this->expr($num2);
		return $num1 - $num2;
	}
	public function mul($num1, $num2) {
		$num1 = $this->expr($num1);
		$num2 = $this->expr($num2);
		return $num1 * $num2;
	}
	public function div($num1, $num2) {
		$num1 = $this->expr($num1);
		$num2 = $this->expr($num2);
		return $num1 / $num2;
	}

	public function mod($num1, $num2) {
		$num1 = $this->expr($num1);
		$num2 = $this->expr($num2);
		return $num1 % $num2;
	}

	public function lt($op1, $op2) {
		$op1 = $this->expr($op1);
		$op2 = $this->expr($op2);
		return $op1 < $op2;
	}

	public function gt($op1, $op2) {
		$op1 = $this->expr($op1);
		$op2 = $this->expr($op2);
		return $op1 > $op2;
	}

	public function lte($op1, $op2) {
		$op1 = $this->expr($op1);
		$op2 = $this->expr($op2);
		return $op1 <= $op2;
	}

	public function gte($op1, $op2) {
		$op1 = $this->expr($op1);
		$op2 = $this->expr($op2);
		return $op1 >= $op2;
	}

	public function eq($op1, $op2) {
		$op1 = $this->expr($op1);
		$op2 = $this->expr($op2);
		return $op1 === $op2;
	}

	public function neq($op1, $op2) {
		$op1 = $this->expr($op1);
		$op2 = $this->expr($op2);
		return $op1 !== $op2;
	}

	public function lsn_list() {
		$params = func_get_args();
		return $params;
	}

	public function lsn_hash($symbol, $value) {
		return $this->assign($symbol, $value);
	}

	public function lsn_while($condition, $prog) {
		while ($this->expr($condition)) {
			$result = $this->progn($prog, $this->context);
		}

		return $result;
	}

	public function lsn_forin($symbol, $local, $prog) {
		$hash = $this->expr($symbol);
		foreach($hash as $key => $value) {
			$this->assign($local[0], $key);
			$this->assign($local[1], $value);
			$result = $this->progn($prog, $this->context);
		}

		return $result;
	}

	public function setk($symbol, $key, $value) {
		$value = $this->expr($value);
		$symbolValue = $this->expr($symbol);
		$symbolValue[$key] = $value;

		return $this->assign($symbol, $symbolValue);
	}

	public function lsn_push($symbol, $value) {
		$symbolValue = $this->expr($symbol);
		$symbolValue[] = $value;
		return $this->assign($symbol, $symbolValue);
	}
}

//simple assignment
$sample = '[["=", "$w", "world"], ["print", "Hello ", "$w", "!"]]';
//incf
$sample1 = '[["=", "$i", 1], ["incf","$i"], ["print", "$i"]]';
//while
$sample2 = '[["=", "$i", 1], ["=", "$j", 10], ["while", ["<=", "$i", "$j"], [["print", "$i", "\n"],["incf", "$i"]]]]';

//list
$sample3 = '[["=", "$list", ["list", "a", "b"]]]';
//hashtable
$sample4 = '[["=", "$list", ["list", "a", "b"]], ["push", "$list", "c"],["hash", "$hash_a", {"a":1, "b":2}],["setk", "$hash_a", "d", "3"], ["forin", "$hash_a", ["$key", "$value"], [["print", "$key", ":", "$value"]]]]';
$lison = new Lison();
$result = $lison->progn(json_decode($sample4, true));
var_dump($lison->context);
// echo 'result:' . $result;