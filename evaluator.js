const NODE_TYPE = {
	OPERATION: 0,
	VALUE: 1
};

const EQUATION_TOKENS = {
	MULTIPLY: 0,
	DIVIDE: 1,
	SUBTRACT: 2,
	ADD: 3,
	EXPONENT: 4,
	NUMBER: 5,
	NESTED: 6
};

const CHAR_TYPE = {
	NUMBER: 0,
	MULTIPLY: 1,
	DIVIDE: 2,
	SUBTRACT: 3,
	ADD: 4,
	EXPONENT: 5,
	PARENTHESIS_OPEN: 6,
	PARENTHESIS_CLOSE: 7
};

const OPERATION_PRIORITY = {
	MULTIPLY: 1,
	DIVIDE: 1,
	ADD: 2,
	SUBTRACT: 2,
	EXPONENT: 0
};
const PRIORITY_MAX = 2;

class Equation {
	constructor(_equation) {
		this.m_equation = _equation;
	}

	Compile() {
		// tokenization
		let [tokenized_equation, operation_priority] = this.Tokenize(this.m_equation);
		while(tokenized_equation != null) {
			//console.log(tokenized_equation.m_value + " : " + tokenized_equation.GetType());
			tokenized_equation = tokenized_equation.Next();
		}
		console.log(operation_priority);
		// tracking position of each operation
		// building the tree
	}

	FindOperations() {
	}

	// note: clean up code, disallow numbers with 2 "."
	Tokenize(_equationString) {
		const starting_token = new Token(null, null);
		let current_token_elem = starting_token;
		let previous_token = null;
		let numeric_value = "";
		let parenthesis_counter = 0;
		let parenthesis_content = "";

		const operation_priority = new Array(PRIORITY_MAX + 1);
		for(let i=0;i<PRIORITY_MAX + 1;++i)
			operation_priority[i] = [];

		for(const c of _equationString) {
			const char_type = this.GetTokenType(c);

			if(char_type == null)
				throw new Error("Invalid Equation - Invalid Character");

			// parenthesis counter > 0
			if(parenthesis_counter > 0) {
				if(c == "(")
					++ parenthesis_counter;
				else if(c == ")")
					-- parenthesis_counter;

				if(parenthesis_counter > 0)
					parenthesis_content += c;
				else {
					const new_token = new Token(EQUATION_TOKENS.NESTED, parenthesis_content);
					current_token_elem.SetNext(new_token);
					current_token_elem = new_token;
					parenthesis_content = "";
				}

				continue;
			}

			// token type == previous token type
			if(char_type == previous_token) {
				if(char_type == CHAR_TYPE.NUMBER) {
					// handle decimal points
					numeric_value += c;
					continue;
				}

				throw new Error("Invalid Equation - Invalid Syntax");
			}

			// token type != previous token type
			if(char_type != previous_token) {
				// closing
				if(previous_token == CHAR_TYPE.NUMBER) {
					const new_token = new Token(EQUATION_TOKENS.NUMBER, parseFloat(numeric_value));
					current_token_elem.SetNext(new_token);
					current_token_elem = new_token;
					numeric_value = "";
				}

				// opening
				let new_token;
				switch(char_type) {
					case CHAR_TYPE.NUMBER:
						numeric_value += c;
						break;
					case CHAR_TYPE.MULTIPLY:
						new_token = new Token(EQUATION_TOKENS.MULTIPLY, c);
						current_token_elem.SetNext(new_token);
						current_token_elem = new_token;
						operation_priority[OPERATION_PRIORITY.MULTIPLY].push(new_token);
						break;
					case CHAR_TYPE.DIVIDE:
						new_token = new Token(EQUATION_TOKENS.DIVIDE, c);
						current_token_elem.SetNext(new_token);
						current_token_elem = new_token;
						operation_priority[OPERATION_PRIORITY.DIVIDE].push(new_token);
						break;
					case CHAR_TYPE.ADD:
						new_token = new Token(EQUATION_TOKENS.ADD, c);
						current_token_elem.SetNext(new_token);
						current_token_elem = new_token;
						operation_priority[OPERATION_PRIORITY.ADD].push(new_token);
						break;
					case CHAR_TYPE.SUBTRACT:
						new_token = new Token(EQUATION_TOKENS.SUBTRACT, c);
						current_token_elem.SetNext(new_token);
						current_token_elem = new_token;
						operation_priority[OPERATION_PRIORITY.SUBTRACT].push(new_token);
						break;
					case CHAR_TYPE.EXPONENT:
						new_token = new Token(EQUATION_TOKENS.EXPONENT, c);
						current_token_elem.SetNext(new_token);
						current_token_elem = new_token;
						operation_priority[OPERATION_PRIORITY.EXPONENT].push(new_token);
						break;
					case CHAR_TYPE.PARENTHESIS_OPEN:
						++ parenthesis_counter;
						break;
				}
			}
			previous_token = char_type;
		}

		if(previous_token == CHAR_TYPE.NUMBER) {
			const new_token = new Token(EQUATION_TOKENS.NUMBER, parseFloat(numeric_value));
			current_token_elem.SetNext(new_token);
			current_token_elem = new_token;
			numeric_value = "";
		}

		return [ starting_token.Next(), operation_priority ];
	}

	GetTokenType(_c) {
		switch(_c) {
			case "*":
				return CHAR_TYPE.MULTIPLY;
			case "/":
				return CHAR_TYPE.DIVIDE;
			case "+":
				return CHAR_TYPE.ADD;
			case "-":
				return CHAR_TYPE.SUBTRACT;
			case "^":
				return CHAR_TYPE.EXPONENT;
			case "(":
				return CHAR_TYPE.PARENTHESIS_OPEN;
			case ")":
				return CHAR_TYPE.PARENTHESIS_CLOSE;
		}

		if(_c.charCodeAt(0) > 47 && _c.charCodeAt(0) < 58)
			return CHAR_TYPE.NUMBER;

		// numbers can be decimals, so "." is still part of a number
		if(_c == ".")
			return CHAR_TYPE.NUMBER;

		return null;
	}

	Calculate() {
		return 5;
	}
}

class Token {
	constructor(_tokenType, _value) {
		this.m_tokenType = _tokenType;
		this.m_value = _value;
		this.m_next = null;
	}

	SetNext(_next) {
		this.m_next = _next;
	}

	Next() {
		return this.m_next;
	}

	GetType() {
		return this.m_tokenType;
	}
}

class TreeNode {
	constructor(_type, _value) {
		this.m_type = _type
		this.m_leftChild = null;
		this.m_rightChild = null;
		this.m_value = _value;
	}

	SetLeftChild(_node) {
		this.m_leftChild = _node;
	}

	SetRightChild(_node) {
		this.m_rightChild = _node;
	}
}
