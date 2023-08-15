const Equation = require("./evaluator.js");

describe("Equation class", () => {
  test("should create a new equation object", () => {
    const equation = new Equation("1+2");
    expect(equation).toBeDefined;
    expect(equation.Compile()).toBe(3);
  });

  test("should throw an error for invalid equations", () => {
    expect(() => new Equation("(1+p").Compile()).toThrow(
      "Invalid Equation - Invalid Character"
    );
    expect(() => new Equation("1+2))").Compile()).toThrow(
      "Invalid Equation - Invalid Syntax"
    );
  });

  test("should tokenize an equation correctly", () => {
    const equation = new Equation("(1+2)*3");
    const [startToken, operation_priority] = equation.Tokenize("(1+2)*3");

    expect(startToken.GetValue()).toBe(null);
    expect(equation.Compile()).toBe(9);
  });

  test("should generate a tree representation of an equation correctly", () => {
    const equation = new Equation("(1+2)*3");
    const equation_tree = equation.GenTree("(1+2)*3");

    expect(equation_tree.GetValue()).toBe("*");
    expect(equation_tree.Calculate()).toBe(9);
  });
});
