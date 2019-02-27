module.exports = function check(str, bracketsConfig) {
  // your solution
	var solver = new Solver(str, bracketsConfig);
	solver.solve();
	return solver.getSolutionResult();
};




function Solver(string, inputConfig) {
	var str = string,
		strAsArr = [],
		config = inputConfig,
		util = new Util(config),
		solutionResult = true;

	for (var i = 0; i < str.length; i++) {
		strAsArr.push(str.charAt(i));
	}



	this.startsFromClosingBracket = function (arr) {
		var bracket = arr[0];
		return util.isClosingBracket(bracket);
	};

		this.startsFromOpeninBracket = function (arr) {
			return util.isOpeningBracket(arr[0]);
		};

	this.hasValidLength = function (arr) {
		return (arr.length % 2 == 0);
	};

	this.getSolutionResult = function () {
		return solutionResult;
	};

	function getIndexOfEqualAmounts(arr, bracketA, bracketB) {
		var sumA = 0,
			sumB = 0,
			index = -1;

		for (var i = 0; i < arr.length; i++) {
			var bracket = arr[i];

			if (bracket == bracketA) {
				sumA++;
			}
			if (bracket == bracketB) {
				sumB++;
			}

			if ((sumA != 0) && (sumA == sumB)) {
				index = i;
				break;
			}
		}

		return index;
	}

	this.solve = function () {
		if (this.startsFromClosingBracket(strAsArr)) {solutionResult = false; return;}
		if (!this.hasValidLength(strAsArr)) {solutionResult = false; return;}
		if (strAsArr.length == 0) {
			return ;
		}
		var index = util.getIndexOfNextOpeningBracket(strAsArr),
			opening = (index != -1) && strAsArr[index],
			closing = opening && util.getClosingByOpening(opening),
			equalityIndex = closing && getIndexOfEqualAmounts(strAsArr, opening, closing),
			isOk = ((equalityIndex - index - 1) %2 == 0);


		if ((typeof equalityIndex == "number" && equalityIndex != -1) && isOk) {
			strAsArr.splice(index, 1);
			strAsArr.splice((equalityIndex - 1), 1);
			this.solve();
		} else {
			if (util.hasClosingBrackets(strAsArr)) {
				solutionResult = false;
				return ;
			}
			var parallelPairIndex = util.getIndexOfParallelPair(strAsArr);
			if (parallelPairIndex != -1) {
				strAsArr.splice(parallelPairIndex, 2);
				this.solve();
			} else {
				solutionResult = false;
			}




			return ;
		}

		return this;

	};

	return this;


}

function Util(inputConfig) {

	var config = inputConfig,
		// will be initialized below
		paraPairs = [],
		normalPairs = [];

	this.getParaPairs = function () {
		return config.filter(pair => (pair[0] == pair[1]));
	};

	this.getNormalPairs = function (config) {
		return config.filter(pair => (pair[0] != pair[1]));
	};

	this.isOpeningBracket = function (bracket) {
		return (normalPairs.filter(pair => pair[0] == bracket).length == 1);
	};

	this.isClosingBracket = function (bracket) {
		return (normalPairs.filter(pair => pair[1] == bracket).length == 1);
	};

	this.hasClosingBrackets = function (arr) {
		for (var i = 0; i < arr.length; i++) {
			var bracket = arr[i];
			if (this.isClosingBracket(bracket)) {
				return true;
			}
		}
		return false;
	};

	this.isParallelBracket = function (bracket) {
		return (paraPairs.filter(pair => pair[1] == bracket).length == 1)
	};

	this.getClosingByOpening = function (openingBracket) {
		var pair = normalPairs.filter(pair => pair[0] == openingBracket)[0];
		return pair[1];
	};

	this.getOpeningByClosing = function (closingBracket) {
		var pairs = normalPairs.filter(pair => pair[1] == closingBracket);
		return pairs[0][0];
	};

	this.stringIsCompletedNormalPair = function (arr) {
		var length = arr.length,
			a = arr[0],
			b = arr[1];
		return (length == 2)
			&& this.isOpeningBracket(a)
			&& this.isClosingBracket(b)
			&& (this.getClosingByOpening(a) == b);
	};

	this.getIndexOfNextOpeningBracket = function (arr) {
		var result = -1;
		for (var i = 0; i  < arr.length; i++) {
			var bracket = arr[i];
			if (this.isOpeningBracket(bracket)) {
				result = i;
				break;
			}
		}
		return result;
	};

	this.strToArr = function (str) {
		var result = [];
		for (var i = 0; i < str.length; i++) {
			result.push(str.charAt(i));
		}
		return result;
	};

	this.getIndexOfParallelPair= function (arr) {
		var result = -1;
		for (var i = 0; i < arr.length - 1; i++) {
			var firstBracket = arr[i],
				secondBracket = arr[i+1];
			if (firstBracket == secondBracket && this.isParallelBracket(firstBracket)) {
				result = i;
				break;
			}
		}
		return result;
	};


	paraPairs = this.getParaPairs(config);
	normalPairs = this.getNormalPairs(config);


}