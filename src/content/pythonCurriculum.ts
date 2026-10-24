import type { Chapter } from "./schema";
/** Original compact Python curriculum. Published chapters contain explanations, examples and checks. */
export const pythonChapters: Chapter[] = [
  {
    "id": "python-intro",
    "version": 2,
    "title": "Programming and Python foundations",
    "minutes": 25,
    "introduction": "Start from zero. Learn what a program is, how Python evaluates instructions, how to run code in this browser, and how to distinguish expressions, output, values and errors. You will write, predict and debug your first small programs without installing anything.",
    "objectives": [
      {
        "id": "execute",
        "text": "Explain source code, interpreter, statement, expression and standard output."
      },
      {
        "id": "predict",
        "text": "Predict arithmetic precedence and string output before running code."
      },
      {
        "id": "debug",
        "text": "Recognize a syntax error, a runtime error and an incorrect result."
      },
      {
        "id": "verify",
        "text": "Write and test a short calculation with a meaningful output label."
      }
    ],
    "prerequisites": [],
    "sections": [
      {
        "id": "how-programs-run",
        "title": "1. What programming actually means",
        "blocks": [
          {
            "type": "paragraph",
            "text": "A program is a set of precise instructions that a computer executes. Python is a programming language; its interpreter reads and runs your source code. Source code is text written by a person. An expression evaluates to a value, such as 2 + 3 producing 5. A statement performs an action, such as assigning a name or calling print()."
          },
          {
            "type": "diagram",
            "caption": "From idea to visible result",
            "steps": [
              "Write Python source code",
              "Interpreter evaluates statements in order",
              "Values are calculated and functions run",
              "print() writes text to the console"
            ]
          },
          {
            "type": "definition",
            "term": "Standard output",
            "text": "The normal stream where print() sends text. Printing a value does not save it for later calculations."
          },
          {
            "type": "paragraph",
            "text": "In Self_learning, the Python laboratory executes code inside your browser. You can learn the language without a local installation. Professional development later uses a local Python interpreter, an editor, a virtual environment and automated tests."
          }
        ]
      },
      {
        "id": "first-program",
        "title": "2. Run your first program",
        "blocks": [
          {
            "type": "syntax",
            "syntax": {
              "signature": "print(value, ..., sep=' ', end='\\n')",
              "explanation": "print() displays one or more values. By default it separates values with spaces and ends with a newline. Text literals use quotes; numbers do not."
            }
          },
          {
            "type": "code",
            "example": {
              "source": "print('Hello, Python!')\nprint('Items:', 3)",
              "expectedOutput": "Hello, Python!\nItems: 3",
              "explanation": "The first call prints a string. The second prints a label and an integer separated by a space. The two calls appear on separate lines."
            }
          },
          {
            "type": "callout",
            "tone": "mistake",
            "title": "Quotes are not optional",
            "text": "print(Hello) tries to find a variable named Hello and raises NameError if it does not exist. print('Hello') passes the literal text Hello."
          }
        ]
      },
      {
        "id": "expressions",
        "title": "3. Values, expressions and order of operations",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Python follows mathematical precedence: multiplication and division happen before addition and subtraction. Parentheses make the intended grouping explicit. The / operator produces a floating-point result; // performs floor division; % gives a remainder."
          },
          {
            "type": "code",
            "example": {
              "source": "print(2 + 3 * 4)\nprint((2 + 3) * 4)\nprint(7 / 2)\nprint(7 // 2)\nprint(7 % 2)",
              "expectedOutput": "14\n20\n3.5\n3\n1",
              "explanation": "Without parentheses, 3 * 4 is evaluated first. Parentheses change the order. Dividing 7 by 2 gives 3.5; floor division gives 3; the remainder is 1."
            }
          },
          {
            "type": "table",
            "headers": [
              "Expression",
              "Result",
              "Why"
            ],
            "rows": [
              [
                "2 + 3 * 4",
                "14",
                "Multiplication before addition"
              ],
              [
                "(2 + 3) * 4",
                "20",
                "Parentheses first"
              ],
              [
                "7 / 2",
                "3.5",
                "True division"
              ],
              [
                "7 // 2",
                "3",
                "Floor division"
              ],
              [
                "7 % 2",
                "1",
                "Remainder"
              ]
            ]
          }
        ]
      },
      {
        "id": "debugging",
        "title": "4. Read errors instead of guessing",
        "blocks": [
          {
            "type": "paragraph",
            "text": "A SyntaxError means the interpreter cannot parse the source. A NameError means a referenced name has not been defined. A ZeroDivisionError occurs when dividing by zero. An incorrect but valid result is a logic error and may not produce any traceback. Read the last line of the traceback first, then inspect the failing line."
          },
          {
            "type": "callout",
            "tone": "debug",
            "title": "Try and diagnose",
            "text": "Run print(10 / 0) and read the ZeroDivisionError. Then change the divisor to 2. Next, try print('Total:', 2 + 3 * 4) and compare it with print('Total:', (2 + 3) * 4). Errors and surprising outputs are evidence, not a reason to stop."
          },
          {
            "type": "case",
            "study": {
              "context": "A small order calculator needs to show the total cost of three items priced at 125 each.",
              "problem": "Printing a label without calculating the expression would give an incomplete report; changing arithmetic precedence can also produce the wrong total.",
              "solution": "Compute the expression, predict the value, run it and compare the result to the expected output.",
              "limitations": "The example uses fixed values. Later chapters introduce variables, user input, money representation and validation."
            }
          }
        ]
      },
      {
        "id": "practice",
        "title": "5. Independent practice and chapter checkpoint",
        "blocks": [
          {
            "type": "paragraph",
            "text": "In the coding laboratory, write a program that prints a label and the total for four tickets costing 75 each. Predict the output first. Then change the number of tickets to five. Explain what changed and why. Do not copy the worked solution until you have tried."
          },
          {
            "type": "code",
            "example": {
              "source": "print('Ticket total:', 4 * 75)",
              "expectedOutput": "Ticket total: 300",
              "explanation": "Four tickets multiplied by 75 each produce 300. The label explains the number. Change 4 to 5 and the result becomes 375."
            }
          },
          {
            "type": "callout",
            "tone": "note",
            "title": "Mastery checklist",
            "text": "Before continuing, you should be able to distinguish strings from numbers, predict expression results, run code, explain console output and interpret the final line of a traceback. Complete the assessment to check your understanding."
          }
        ]
      }
    ],
    "summary": [
      "Python executes source instructions using an interpreter; statements perform actions and expressions evaluate to values.",
      "print() displays values but does not store them.",
      "Parentheses make arithmetic precedence explicit; /, // and % have different meanings.",
      "Syntax, runtime and logic errors require different debugging approaches."
    ],
    "glossary": [
      {
        "term": "Interpreter",
        "definition": "Software that executes Python source code."
      },
      {
        "term": "Expression",
        "definition": "Code that evaluates to a value."
      },
      {
        "term": "Statement",
        "definition": "An instruction that performs an action."
      },
      {
        "term": "Standard output",
        "definition": "The stream where print() writes text."
      },
      {
        "term": "Traceback",
        "definition": "A report showing where an exception occurred."
      }
    ],
    "references": [
      {
        "id": "python-tutorial",
        "title": "Python official tutorial",
        "url": "https://docs.python.org/3/tutorial/"
      },
      {
        "id": "python-builtins",
        "title": "Python built-in functions: print",
        "url": "https://docs.python.org/3/library/functions.html#print"
      }
    ],
    "assessment": {
      "id": "python-intro-check-v2",
      "version": 2,
      "title": "Chapter 1: Programming fundamentals checkpoint",
      "questions": [
        {
          "id": "precedence",
          "kind": "single",
          "prompt": "What does print(2 + 3 * 4) display?",
          "options": [
            "20",
            "14",
            "24"
          ],
          "answer": [
            1
          ],
          "hint": "Multiply before adding.",
          "explanation": "3 * 4 = 12, then 2 + 12 = 14."
        },
        {
          "id": "division",
          "kind": "multiple",
          "prompt": "Which expressions evaluate to the integer 3?",
          "options": [
            "7 // 2",
            "7 / 2",
            "7 % 4"
          ],
          "answer": [
            0,
            2
          ],
          "hint": "Compare true division, floor division and remainder.",
          "explanation": "7 // 2 is 3 and 7 % 4 is 3; 7 / 2 is 3.5."
        },
        {
          "id": "keyword",
          "kind": "short",
          "prompt": "Which built-in function writes values to standard output?",
          "accepted": [
            "print",
            "print()"
          ],
          "hint": "It is used in the first example.",
          "explanation": "print() writes values to standard output."
        },
        {
          "id": "code",
          "kind": "code",
          "prompt": "Implement solve() to return the total price of four tickets costing 75 each. Return the integer result, not printed text.",
          "starter": "def solve():\n    # Return the ticket total\n    pass",
          "tests": "assert callable(solve)\nassert solve() == 300\nassert isinstance(solve(), int)",
          "hint": "Multiply the number of tickets by the price.",
          "hint": "Multiply the number of tickets by the price."
        }
      ]
    }
  },
  {
    "id": "python-values",
    "version": 1,
    "title": "Variables, types and operators",
    "minutes": 15,
    "introduction": "Variables, types and operators teaches one coherent skill and how to apply it. Store values, distinguish types and calculate safely. Work through the explanation, execute the example, then solve the independent exercise.",
    "objectives": [
      {
        "id": "understand",
        "text": "Store values, distinguish types and calculate safely."
      },
      {
        "id": "apply",
        "text": "Predict output, execute Python and explain the result."
      }
    ],
    "prerequisites": [
      "Programming and Python foundations"
    ],
    "sections": [
      {
        "id": "concept",
        "title": "1. Core idea and mental model",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Assignment binds a name to a value. int, float, str and bool have different operations. / yields float; // floors; % gives remainder."
          },
          {
            "type": "definition",
            "term": "Variables, types and operators",
            "text": "Store values, distinguish types and calculate safely."
          },
          {
            "type": "diagram",
            "caption": "Learn, verify and apply",
            "steps": [
              "Understand the rule",
              "Run a concrete example",
              "Test a changed input"
            ]
          }
        ]
      },
      {
        "id": "syntax",
        "title": "2. Syntax and worked example",
        "blocks": [
          {
            "type": "syntax",
            "syntax": {
              "signature": "price = 125\nquantity = 3\nprint(price * quantity)",
              "explanation": "Assignment binds a name to a value. int, float, str and bool have different operations. / yields float; // floors; % gives remainder."
            }
          },
          {
            "type": "code",
            "example": {
              "source": "price = 125\nquantity = 3\nprint(price * quantity)",
              "expectedOutput": "375",
              "explanation": "Expected console output: 375. Inspect the inputs and follow execution step by step."
            }
          },
          {
            "type": "callout",
            "tone": "mistake",
            "title": "TypeError",
            "text": "Mixing a string and number without conversion raises TypeError."
          }
        ]
      },
      {
        "id": "practice",
        "title": "3. Guided application and verification",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Try this independently in the Python laboratory. How can you calculate complete pairs and leftovers? Change the input, predict the result, and compare it with actual execution."
          },
          {
            "type": "code",
            "example": {
              "source": "units = 7\nprint(units // 2, units % 2)",
              "expectedOutput": "3 1",
              "explanation": "This is one valid worked solution. Explain why it produces 3 1."
            }
          },
          {
            "type": "case",
            "study": {
              "context": "A developer needs a small, dependable calculation or transformation.",
              "problem": "An untested assumption can turn a simple script into an incorrect result.",
              "solution": "State the expected behavior, run the example and test a boundary case.",
              "limitations": "This introductory example is deliberately small; production programs also need validation, error handling and tests."
            }
          }
        ]
      }
    ],
    "summary": [
      "Store values, distinguish types and calculate safely.",
      "Assignment binds a name to a value. int, float, str and bool have different operations. / yields float; // floors; % gives remainder."
    ],
    "glossary": [
      {
        "term": "values",
        "definition": "Store values, distinguish types and calculate safely."
      }
    ],
    "references": [
      {
        "id": "python-tutorial",
        "title": "Official Python tutorial",
        "url": "https://docs.python.org/3/tutorial/"
      }
    ],
    "assessment": {
      "id": "python-values-check",
      "version": 1,
      "title": "Verify understanding",
      "questions": [
        {
          "id": "output",
          "kind": "single",
          "prompt": "What is the output of the worked example?",
          "options": [
            "375",
            "SyntaxError",
            "None"
          ],
          "answer": [
            0
          ],
          "hint": "Trace the statements in order.",
          "explanation": "The program prints 375."
        },
        {
          "id": "concept",
          "kind": "short",
          "prompt": "Which Python keyword displays a value on the console?",
          "accepted": [
            "print"
          ],
          "hint": "It is a built-in function.",
          "explanation": "print writes to standard output."
        },
        {
          "id": "implement",
          "kind": "code",
          "prompt": "Implement solve() to compute the guided exercise result and return it as text.",
          "starter": "def solve():\n    # Calculate the chapter exercise result\n    pass",
          "tests": "assert callable(solve)\nassert str(solve()) == \"3 1\"",
          "hint": "Use the guided example and return the computed result."
        }
      ]
    }
  },
  {
    "id": "python-input",
    "version": 1,
    "title": "Input, conversion and formatted output",
    "minutes": 15,
    "introduction": "Input, conversion and formatted output teaches one coherent skill and how to apply it. Convert user input and present meaningful results. Work through the explanation, execute the example, then solve the independent exercise.",
    "objectives": [
      {
        "id": "understand",
        "text": "Convert user input and present meaningful results."
      },
      {
        "id": "apply",
        "text": "Predict output, execute Python and explain the result."
      }
    ],
    "prerequisites": [
      "Variables, types and operators"
    ],
    "sections": [
      {
        "id": "concept",
        "title": "1. Core idea and mental model",
        "blocks": [
          {
            "type": "paragraph",
            "text": "input returns a string. Validate and convert it before arithmetic. f-strings interpolate expressions. Never assume text input is numeric."
          },
          {
            "type": "definition",
            "term": "Input, conversion and formatted output",
            "text": "Convert user input and present meaningful results."
          },
          {
            "type": "diagram",
            "caption": "Learn, verify and apply",
            "steps": [
              "Understand the rule",
              "Run a concrete example",
              "Test a changed input"
            ]
          }
        ]
      },
      {
        "id": "syntax",
        "title": "2. Syntax and worked example",
        "blocks": [
          {
            "type": "syntax",
            "syntax": {
              "signature": "raw = '12'\ncount = int(raw)\nprint(f'{count} items')",
              "explanation": "input returns a string. Validate and convert it before arithmetic. f-strings interpolate expressions. Never assume text input is numeric."
            }
          },
          {
            "type": "code",
            "example": {
              "source": "raw = '12'\ncount = int(raw)\nprint(f'{count} items')",
              "expectedOutput": "12 items",
              "explanation": "Expected console output: 12 items. Inspect the inputs and follow execution step by step."
            }
          },
          {
            "type": "callout",
            "tone": "mistake",
            "title": "ValueError",
            "text": "int('twelve') raises ValueError; validate before converting."
          }
        ]
      },
      {
        "id": "practice",
        "title": "3. Guided application and verification",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Try this independently in the Python laboratory. What would happen if the input were blank? Change the input, predict the result, and compare it with actual execution."
          },
          {
            "type": "code",
            "example": {
              "source": "distance = float('7.5')\nprint(f'{distance:.1f} km')",
              "expectedOutput": "7.5 km",
              "explanation": "This is one valid worked solution. Explain why it produces 7.5 km."
            }
          },
          {
            "type": "case",
            "study": {
              "context": "A developer needs a small, dependable calculation or transformation.",
              "problem": "An untested assumption can turn a simple script into an incorrect result.",
              "solution": "State the expected behavior, run the example and test a boundary case.",
              "limitations": "This introductory example is deliberately small; production programs also need validation, error handling and tests."
            }
          }
        ]
      }
    ],
    "summary": [
      "Convert user input and present meaningful results.",
      "input returns a string. Validate and convert it before arithmetic. f-strings interpolate expressions. Never assume text input is numeric."
    ],
    "glossary": [
      {
        "term": "input",
        "definition": "Convert user input and present meaningful results."
      }
    ],
    "references": [
      {
        "id": "python-tutorial",
        "title": "Official Python tutorial",
        "url": "https://docs.python.org/3/tutorial/"
      }
    ],
    "assessment": {
      "id": "python-input-check",
      "version": 1,
      "title": "Verify understanding",
      "questions": [
        {
          "id": "output",
          "kind": "single",
          "prompt": "What is the output of the worked example?",
          "options": [
            "12 items",
            "SyntaxError",
            "None"
          ],
          "answer": [
            0
          ],
          "hint": "Trace the statements in order.",
          "explanation": "The program prints 12 items."
        },
        {
          "id": "concept",
          "kind": "short",
          "prompt": "Which Python keyword displays a value on the console?",
          "accepted": [
            "print"
          ],
          "hint": "It is a built-in function.",
          "explanation": "print writes to standard output."
        },
        {
          "id": "implement",
          "kind": "code",
          "prompt": "Implement solve() to compute the guided exercise result and return it as text.",
          "starter": "def solve():\n    # Calculate the chapter exercise result\n    pass",
          "tests": "assert callable(solve)\nassert str(solve()) == \"7.5 km\"",
          "hint": "Use the guided example and return the computed result."
        }
      ]
    }
  },
  {
    "id": "python-control",
    "version": 1,
    "title": "Conditions and decisions",
    "minutes": 15,
    "introduction": "Conditions and decisions teaches one coherent skill and how to apply it. Express branching with booleans, comparisons and clear conditions. Work through the explanation, execute the example, then solve the independent exercise.",
    "objectives": [
      {
        "id": "understand",
        "text": "Express branching with booleans, comparisons and clear conditions."
      },
      {
        "id": "apply",
        "text": "Predict output, execute Python and explain the result."
      }
    ],
    "prerequisites": [
      "Input, conversion and formatted output"
    ],
    "sections": [
      {
        "id": "concept",
        "title": "1. Core idea and mental model",
        "blocks": [
          {
            "type": "paragraph",
            "text": "if/elif/else select one path. Indentation defines blocks. Use == for comparison, = for assignment, and/or/not to combine predicates."
          },
          {
            "type": "definition",
            "term": "Conditions and decisions",
            "text": "Express branching with booleans, comparisons and clear conditions."
          },
          {
            "type": "diagram",
            "caption": "Learn, verify and apply",
            "steps": [
              "Understand the rule",
              "Run a concrete example",
              "Test a changed input"
            ]
          }
        ]
      },
      {
        "id": "syntax",
        "title": "2. Syntax and worked example",
        "blocks": [
          {
            "type": "syntax",
            "syntax": {
              "signature": "score = 82\nif score >= 80:\n    print('Pass')\nelse:\n    print('Review')",
              "explanation": "if/elif/else select one path. Indentation defines blocks. Use == for comparison, = for assignment, and/or/not to combine predicates."
            }
          },
          {
            "type": "code",
            "example": {
              "source": "score = 82\nif score >= 80:\n    print('Pass')\nelse:\n    print('Review')",
              "expectedOutput": "Pass",
              "explanation": "Expected console output: Pass. Inspect the inputs and follow execution step by step."
            }
          },
          {
            "type": "callout",
            "tone": "mistake",
            "title": "IndentationError",
            "text": "All statements in a block must use consistent indentation."
          }
        ]
      },
      {
        "id": "practice",
        "title": "3. Guided application and verification",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Try this independently in the Python laboratory. Which branch runs when temperature equals 30? Change the input, predict the result, and compare it with actual execution."
          },
          {
            "type": "code",
            "example": {
              "source": "temperature = 31\nprint('hot' if temperature > 30 else 'mild')",
              "expectedOutput": "hot",
              "explanation": "This is one valid worked solution. Explain why it produces hot."
            }
          },
          {
            "type": "case",
            "study": {
              "context": "A developer needs a small, dependable calculation or transformation.",
              "problem": "An untested assumption can turn a simple script into an incorrect result.",
              "solution": "State the expected behavior, run the example and test a boundary case.",
              "limitations": "This introductory example is deliberately small; production programs also need validation, error handling and tests."
            }
          }
        ]
      }
    ],
    "summary": [
      "Express branching with booleans, comparisons and clear conditions.",
      "if/elif/else select one path. Indentation defines blocks. Use == for comparison, = for assignment, and/or/not to combine predicates."
    ],
    "glossary": [
      {
        "term": "control",
        "definition": "Express branching with booleans, comparisons and clear conditions."
      }
    ],
    "references": [
      {
        "id": "python-tutorial",
        "title": "Official Python tutorial",
        "url": "https://docs.python.org/3/tutorial/"
      }
    ],
    "assessment": {
      "id": "python-control-check",
      "version": 1,
      "title": "Verify understanding",
      "questions": [
        {
          "id": "output",
          "kind": "single",
          "prompt": "What is the output of the worked example?",
          "options": [
            "Pass",
            "SyntaxError",
            "None"
          ],
          "answer": [
            0
          ],
          "hint": "Trace the statements in order.",
          "explanation": "The program prints Pass."
        },
        {
          "id": "concept",
          "kind": "short",
          "prompt": "Which Python keyword displays a value on the console?",
          "accepted": [
            "print"
          ],
          "hint": "It is a built-in function.",
          "explanation": "print writes to standard output."
        },
        {
          "id": "implement",
          "kind": "code",
          "prompt": "Implement solve() to compute the guided exercise result and return it as text.",
          "starter": "def solve():\n    # Calculate the chapter exercise result\n    pass",
          "tests": "assert callable(solve)\nassert str(solve()) == \"hot\"",
          "hint": "Use the guided example and return the computed result."
        }
      ]
    }
  },
  {
    "id": "python-loops",
    "version": 1,
    "title": "Loops and iteration",
    "minutes": 15,
    "introduction": "Loops and iteration teaches one coherent skill and how to apply it. Repeat work safely using for, while and range. Work through the explanation, execute the example, then solve the independent exercise.",
    "objectives": [
      {
        "id": "understand",
        "text": "Repeat work safely using for, while and range."
      },
      {
        "id": "apply",
        "text": "Predict output, execute Python and explain the result."
      }
    ],
    "prerequisites": [
      "Conditions and decisions"
    ],
    "sections": [
      {
        "id": "concept",
        "title": "1. Core idea and mental model",
        "blocks": [
          {
            "type": "paragraph",
            "text": "for iterates a sequence; range stops before its endpoint. while repeats while a condition is true. Use break and continue sparingly."
          },
          {
            "type": "definition",
            "term": "Loops and iteration",
            "text": "Repeat work safely using for, while and range."
          },
          {
            "type": "diagram",
            "caption": "Learn, verify and apply",
            "steps": [
              "Understand the rule",
              "Run a concrete example",
              "Test a changed input"
            ]
          }
        ]
      },
      {
        "id": "syntax",
        "title": "2. Syntax and worked example",
        "blocks": [
          {
            "type": "syntax",
            "syntax": {
              "signature": "total = 0\nfor n in range(1, 5):\n    total += n\nprint(total)",
              "explanation": "for iterates a sequence; range stops before its endpoint. while repeats while a condition is true. Use break and continue sparingly."
            }
          },
          {
            "type": "code",
            "example": {
              "source": "total = 0\nfor n in range(1, 5):\n    total += n\nprint(total)",
              "expectedOutput": "10",
              "explanation": "Expected console output: 10. Inspect the inputs and follow execution step by step."
            }
          },
          {
            "type": "callout",
            "tone": "mistake",
            "title": "Infinite loop",
            "text": "A while condition that never changes can run forever."
          }
        ]
      },
      {
        "id": "practice",
        "title": "3. Guided application and verification",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Try this independently in the Python laboratory. Why is sum clearer than a manual loop here? Change the input, predict the result, and compare it with actual execution."
          },
          {
            "type": "code",
            "example": {
              "source": "values = [2, 4, 6]\nprint(sum(values))",
              "expectedOutput": "12",
              "explanation": "This is one valid worked solution. Explain why it produces 12."
            }
          },
          {
            "type": "case",
            "study": {
              "context": "A developer needs a small, dependable calculation or transformation.",
              "problem": "An untested assumption can turn a simple script into an incorrect result.",
              "solution": "State the expected behavior, run the example and test a boundary case.",
              "limitations": "This introductory example is deliberately small; production programs also need validation, error handling and tests."
            }
          }
        ]
      }
    ],
    "summary": [
      "Repeat work safely using for, while and range.",
      "for iterates a sequence; range stops before its endpoint. while repeats while a condition is true. Use break and continue sparingly."
    ],
    "glossary": [
      {
        "term": "loops",
        "definition": "Repeat work safely using for, while and range."
      }
    ],
    "references": [
      {
        "id": "python-tutorial",
        "title": "Official Python tutorial",
        "url": "https://docs.python.org/3/tutorial/"
      }
    ],
    "assessment": {
      "id": "python-loops-check",
      "version": 1,
      "title": "Verify understanding",
      "questions": [
        {
          "id": "output",
          "kind": "single",
          "prompt": "What is the output of the worked example?",
          "options": [
            "10",
            "SyntaxError",
            "None"
          ],
          "answer": [
            0
          ],
          "hint": "Trace the statements in order.",
          "explanation": "The program prints 10."
        },
        {
          "id": "concept",
          "kind": "short",
          "prompt": "Which Python keyword displays a value on the console?",
          "accepted": [
            "print"
          ],
          "hint": "It is a built-in function.",
          "explanation": "print writes to standard output."
        },
        {
          "id": "implement",
          "kind": "code",
          "prompt": "Implement solve() to compute the guided exercise result and return it as text.",
          "starter": "def solve():\n    # Calculate the chapter exercise result\n    pass",
          "tests": "assert callable(solve)\nassert str(solve()) == \"12\"",
          "hint": "Use the guided example and return the computed result."
        }
      ]
    }
  },
  {
    "id": "python-collections",
    "version": 1,
    "title": "Strings and collections",
    "minutes": 15,
    "introduction": "Strings and collections teaches one coherent skill and how to apply it. Choose lists, tuples, sets and dictionaries appropriately. Work through the explanation, execute the example, then solve the independent exercise.",
    "objectives": [
      {
        "id": "understand",
        "text": "Choose lists, tuples, sets and dictionaries appropriately."
      },
      {
        "id": "apply",
        "text": "Predict output, execute Python and explain the result."
      }
    ],
    "prerequisites": [
      "Loops and iteration"
    ],
    "sections": [
      {
        "id": "concept",
        "title": "1. Core idea and mental model",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Strings are immutable sequences; lists are ordered and mutable; tuples are fixed sequences; sets deduplicate; dict maps keys to values."
          },
          {
            "type": "definition",
            "term": "Strings and collections",
            "text": "Choose lists, tuples, sets and dictionaries appropriately."
          },
          {
            "type": "diagram",
            "caption": "Learn, verify and apply",
            "steps": [
              "Understand the rule",
              "Run a concrete example",
              "Test a changed input"
            ]
          }
        ]
      },
      {
        "id": "syntax",
        "title": "2. Syntax and worked example",
        "blocks": [
          {
            "type": "syntax",
            "syntax": {
              "signature": "counts = {'a': 2, 'b': 3}\nprint(sum(counts.values()))",
              "explanation": "Strings are immutable sequences; lists are ordered and mutable; tuples are fixed sequences; sets deduplicate; dict maps keys to values."
            }
          },
          {
            "type": "code",
            "example": {
              "source": "counts = {'a': 2, 'b': 3}\nprint(sum(counts.values()))",
              "expectedOutput": "5",
              "explanation": "Expected console output: 5. Inspect the inputs and follow execution step by step."
            }
          },
          {
            "type": "callout",
            "tone": "mistake",
            "title": "KeyError",
            "text": "Accessing a missing dictionary key raises KeyError; use get when absence is expected."
          }
        ]
      },
      {
        "id": "practice",
        "title": "3. Guided application and verification",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Try this independently in the Python laboratory. Why does a set lose duplicates? Change the input, predict the result, and compare it with actual execution."
          },
          {
            "type": "code",
            "example": {
              "source": "names = ['Ada', 'Ada', 'Lin']\nprint(len(set(names)))",
              "expectedOutput": "2",
              "explanation": "This is one valid worked solution. Explain why it produces 2."
            }
          },
          {
            "type": "case",
            "study": {
              "context": "A developer needs a small, dependable calculation or transformation.",
              "problem": "An untested assumption can turn a simple script into an incorrect result.",
              "solution": "State the expected behavior, run the example and test a boundary case.",
              "limitations": "This introductory example is deliberately small; production programs also need validation, error handling and tests."
            }
          }
        ]
      }
    ],
    "summary": [
      "Choose lists, tuples, sets and dictionaries appropriately.",
      "Strings are immutable sequences; lists are ordered and mutable; tuples are fixed sequences; sets deduplicate; dict maps keys to values."
    ],
    "glossary": [
      {
        "term": "collections",
        "definition": "Choose lists, tuples, sets and dictionaries appropriately."
      }
    ],
    "references": [
      {
        "id": "python-tutorial",
        "title": "Official Python tutorial",
        "url": "https://docs.python.org/3/tutorial/"
      }
    ],
    "assessment": {
      "id": "python-collections-check",
      "version": 1,
      "title": "Verify understanding",
      "questions": [
        {
          "id": "output",
          "kind": "single",
          "prompt": "What is the output of the worked example?",
          "options": [
            "5",
            "SyntaxError",
            "None"
          ],
          "answer": [
            0
          ],
          "hint": "Trace the statements in order.",
          "explanation": "The program prints 5."
        },
        {
          "id": "concept",
          "kind": "short",
          "prompt": "Which Python keyword displays a value on the console?",
          "accepted": [
            "print"
          ],
          "hint": "It is a built-in function.",
          "explanation": "print writes to standard output."
        },
        {
          "id": "implement",
          "kind": "code",
          "prompt": "Implement solve() to compute the guided exercise result and return it as text.",
          "starter": "def solve():\n    # Calculate the chapter exercise result\n    pass",
          "tests": "assert callable(solve)\nassert str(solve()) == \"2\"",
          "hint": "Use the guided example and return the computed result."
        }
      ]
    }
  },
  {
    "id": "python-modules",
    "version": 1,
    "title": "Modules, files and exceptions",
    "minutes": 15,
    "introduction": "Modules, files and exceptions teaches one coherent skill and how to apply it. Import reusable tools, read files safely and handle expected errors. Work through the explanation, execute the example, then solve the independent exercise.",
    "objectives": [
      {
        "id": "understand",
        "text": "Import reusable tools, read files safely and handle expected errors."
      },
      {
        "id": "apply",
        "text": "Predict output, execute Python and explain the result."
      }
    ],
    "prerequisites": [
      "Strings and collections"
    ],
    "sections": [
      {
        "id": "concept",
        "title": "1. Core idea and mental model",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Modules organize code. with closes files reliably. try/except should catch specific expected errors rather than silently swallowing every exception."
          },
          {
            "type": "definition",
            "term": "Modules, files and exceptions",
            "text": "Import reusable tools, read files safely and handle expected errors."
          },
          {
            "type": "diagram",
            "caption": "Learn, verify and apply",
            "steps": [
              "Understand the rule",
              "Run a concrete example",
              "Test a changed input"
            ]
          }
        ]
      },
      {
        "id": "syntax",
        "title": "2. Syntax and worked example",
        "blocks": [
          {
            "type": "syntax",
            "syntax": {
              "signature": "import math\nprint(math.ceil(3.2))",
              "explanation": "Modules organize code. with closes files reliably. try/except should catch specific expected errors rather than silently swallowing every exception."
            }
          },
          {
            "type": "code",
            "example": {
              "source": "import math\nprint(math.ceil(3.2))",
              "expectedOutput": "4",
              "explanation": "Expected console output: 4. Inspect the inputs and follow execution step by step."
            }
          },
          {
            "type": "callout",
            "tone": "mistake",
            "title": "FileNotFoundError",
            "text": "Opening a missing path fails; check the location and handle it explicitly."
          }
        ]
      },
      {
        "id": "practice",
        "title": "3. Guided application and verification",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Try this independently in the Python laboratory. Why is pathlib preferable to manually splitting a path? Change the input, predict the result, and compare it with actual execution."
          },
          {
            "type": "code",
            "example": {
              "source": "from pathlib import Path\nprint(Path('report.csv').suffix)",
              "expectedOutput": ".csv",
              "explanation": "This is one valid worked solution. Explain why it produces .csv."
            }
          },
          {
            "type": "case",
            "study": {
              "context": "A developer needs a small, dependable calculation or transformation.",
              "problem": "An untested assumption can turn a simple script into an incorrect result.",
              "solution": "State the expected behavior, run the example and test a boundary case.",
              "limitations": "This introductory example is deliberately small; production programs also need validation, error handling and tests."
            }
          }
        ]
      }
    ],
    "summary": [
      "Import reusable tools, read files safely and handle expected errors.",
      "Modules organize code. with closes files reliably. try/except should catch specific expected errors rather than silently swallowing every exception."
    ],
    "glossary": [
      {
        "term": "modules",
        "definition": "Import reusable tools, read files safely and handle expected errors."
      }
    ],
    "references": [
      {
        "id": "python-tutorial",
        "title": "Official Python tutorial",
        "url": "https://docs.python.org/3/tutorial/"
      }
    ],
    "assessment": {
      "id": "python-modules-check",
      "version": 1,
      "title": "Verify understanding",
      "questions": [
        {
          "id": "output",
          "kind": "single",
          "prompt": "What is the output of the worked example?",
          "options": [
            "4",
            "SyntaxError",
            "None"
          ],
          "answer": [
            0
          ],
          "hint": "Trace the statements in order.",
          "explanation": "The program prints 4."
        },
        {
          "id": "concept",
          "kind": "short",
          "prompt": "Which Python keyword displays a value on the console?",
          "accepted": [
            "print"
          ],
          "hint": "It is a built-in function.",
          "explanation": "print writes to standard output."
        },
        {
          "id": "implement",
          "kind": "code",
          "prompt": "Implement solve() to compute the guided exercise result and return it as text.",
          "starter": "def solve():\n    # Calculate the chapter exercise result\n    pass",
          "tests": "assert callable(solve)\nassert str(solve()) == \".csv\"",
          "hint": "Use the guided example and return the computed result."
        }
      ]
    }
  },
  {
    "id": "python-classes",
    "version": 1,
    "title": "Classes, objects and data models",
    "minutes": 15,
    "introduction": "Classes, objects and data models teaches one coherent skill and how to apply it. Encapsulate related state and behavior when complexity justifies it. Work through the explanation, execute the example, then solve the independent exercise.",
    "objectives": [
      {
        "id": "understand",
        "text": "Encapsulate related state and behavior when complexity justifies it."
      },
      {
        "id": "apply",
        "text": "Predict output, execute Python and explain the result."
      }
    ],
    "prerequisites": [
      "Modules, files and exceptions"
    ],
    "sections": [
      {
        "id": "concept",
        "title": "1. Core idea and mental model",
        "blocks": [
          {
            "type": "paragraph",
            "text": "A class defines a type; an instance stores state. __init__ initializes attributes. Prefer simple functions and data structures when a class adds no clarity."
          },
          {
            "type": "definition",
            "term": "Classes, objects and data models",
            "text": "Encapsulate related state and behavior when complexity justifies it."
          },
          {
            "type": "diagram",
            "caption": "Learn, verify and apply",
            "steps": [
              "Understand the rule",
              "Run a concrete example",
              "Test a changed input"
            ]
          }
        ]
      },
      {
        "id": "syntax",
        "title": "2. Syntax and worked example",
        "blocks": [
          {
            "type": "syntax",
            "syntax": {
              "signature": "class Counter:\n    def __init__(self):\n        self.value = 0\n    def add(self):\n        self.value += 1\nc = Counter()\nc.add()\nprint(c.value)",
              "explanation": "A class defines a type; an instance stores state. __init__ initializes attributes. Prefer simple functions and data structures when a class adds no clarity."
            }
          },
          {
            "type": "code",
            "example": {
              "source": "class Counter:\n    def __init__(self):\n        self.value = 0\n    def add(self):\n        self.value += 1\nc = Counter()\nc.add()\nprint(c.value)",
              "expectedOutput": "1",
              "explanation": "Expected console output: 1. Inspect the inputs and follow execution step by step."
            }
          },
          {
            "type": "callout",
            "tone": "mistake",
            "title": "AttributeError",
            "text": "Referencing an attribute that was never created raises AttributeError."
          }
        ]
      },
      {
        "id": "practice",
        "title": "3. Guided application and verification",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Try this independently in the Python laboratory. When would a plain dictionary be simpler? Change the input, predict the result, and compare it with actual execution."
          },
          {
            "type": "code",
            "example": {
              "source": "class Box:\n    def __init__(self, width):\n        self.width = width\nb = Box(4)\nprint(b.width)",
              "expectedOutput": "4",
              "explanation": "This is one valid worked solution. Explain why it produces 4."
            }
          },
          {
            "type": "case",
            "study": {
              "context": "A developer needs a small, dependable calculation or transformation.",
              "problem": "An untested assumption can turn a simple script into an incorrect result.",
              "solution": "State the expected behavior, run the example and test a boundary case.",
              "limitations": "This introductory example is deliberately small; production programs also need validation, error handling and tests."
            }
          }
        ]
      }
    ],
    "summary": [
      "Encapsulate related state and behavior when complexity justifies it.",
      "A class defines a type; an instance stores state. __init__ initializes attributes. Prefer simple functions and data structures when a class adds no clarity."
    ],
    "glossary": [
      {
        "term": "classes",
        "definition": "Encapsulate related state and behavior when complexity justifies it."
      }
    ],
    "references": [
      {
        "id": "python-tutorial",
        "title": "Official Python tutorial",
        "url": "https://docs.python.org/3/tutorial/"
      }
    ],
    "assessment": {
      "id": "python-classes-check",
      "version": 1,
      "title": "Verify understanding",
      "questions": [
        {
          "id": "output",
          "kind": "single",
          "prompt": "What is the output of the worked example?",
          "options": [
            "1",
            "SyntaxError",
            "None"
          ],
          "answer": [
            0
          ],
          "hint": "Trace the statements in order.",
          "explanation": "The program prints 1."
        },
        {
          "id": "concept",
          "kind": "short",
          "prompt": "Which Python keyword displays a value on the console?",
          "accepted": [
            "print"
          ],
          "hint": "It is a built-in function.",
          "explanation": "print writes to standard output."
        },
        {
          "id": "implement",
          "kind": "code",
          "prompt": "Implement solve() to compute the guided exercise result and return it as text.",
          "starter": "def solve():\n    # Calculate the chapter exercise result\n    pass",
          "tests": "assert callable(solve)\nassert str(solve()) == \"4\"",
          "hint": "Use the guided example and return the computed result."
        }
      ]
    }
  },
  {
    "id": "python-testing",
    "version": 1,
    "title": "Testing, debugging and quality",
    "minutes": 15,
    "introduction": "Testing, debugging and quality teaches one coherent skill and how to apply it. Verify behavior, edge cases and maintainable code. Work through the explanation, execute the example, then solve the independent exercise.",
    "objectives": [
      {
        "id": "understand",
        "text": "Verify behavior, edge cases and maintainable code."
      },
      {
        "id": "apply",
        "text": "Predict output, execute Python and explain the result."
      }
    ],
    "prerequisites": [
      "Classes, objects and data models"
    ],
    "sections": [
      {
        "id": "concept",
        "title": "1. Core idea and mental model",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Tests compare actual behavior to expectations. Check boundaries, invalid inputs and representative cases. A traceback identifies the failure location. Use descriptive names and small functions."
          },
          {
            "type": "definition",
            "term": "Testing, debugging and quality",
            "text": "Verify behavior, edge cases and maintainable code."
          },
          {
            "type": "diagram",
            "caption": "Learn, verify and apply",
            "steps": [
              "Understand the rule",
              "Run a concrete example",
              "Test a changed input"
            ]
          }
        ]
      },
      {
        "id": "syntax",
        "title": "2. Syntax and worked example",
        "blocks": [
          {
            "type": "syntax",
            "syntax": {
              "signature": "def double(x):\n    return x * 2\nassert double(3) == 6\nassert double(0) == 0\nprint('passed')",
              "explanation": "Tests compare actual behavior to expectations. Check boundaries, invalid inputs and representative cases. A traceback identifies the failure location. Use descriptive names and small functions."
            }
          },
          {
            "type": "code",
            "example": {
              "source": "def double(x):\n    return x * 2\nassert double(3) == 6\nassert double(0) == 0\nprint('passed')",
              "expectedOutput": "passed",
              "explanation": "Expected console output: passed. Inspect the inputs and follow execution step by step."
            }
          },
          {
            "type": "callout",
            "tone": "mistake",
            "title": "AssertionError",
            "text": "An assertion failure means the actual result differs from the expected result."
          }
        ]
      },
      {
        "id": "practice",
        "title": "3. Guided application and verification",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Try this independently in the Python laboratory. What tests would catch an incorrect implementation? Change the input, predict the result, and compare it with actual execution."
          },
          {
            "type": "code",
            "example": {
              "source": "def is_even(n):\n    return n % 2 == 0\nprint(is_even(8))",
              "expectedOutput": "True",
              "explanation": "This is one valid worked solution. Explain why it produces True."
            }
          },
          {
            "type": "case",
            "study": {
              "context": "A developer needs a small, dependable calculation or transformation.",
              "problem": "An untested assumption can turn a simple script into an incorrect result.",
              "solution": "State the expected behavior, run the example and test a boundary case.",
              "limitations": "This introductory example is deliberately small; production programs also need validation, error handling and tests."
            }
          }
        ]
      }
    ],
    "summary": [
      "Verify behavior, edge cases and maintainable code.",
      "Tests compare actual behavior to expectations. Check boundaries, invalid inputs and representative cases. A traceback identifies the failure location. Use descriptive names and small functions."
    ],
    "glossary": [
      {
        "term": "testing",
        "definition": "Verify behavior, edge cases and maintainable code."
      }
    ],
    "references": [
      {
        "id": "python-tutorial",
        "title": "Official Python tutorial",
        "url": "https://docs.python.org/3/tutorial/"
      }
    ],
    "assessment": {
      "id": "python-testing-check",
      "version": 1,
      "title": "Verify understanding",
      "questions": [
        {
          "id": "output",
          "kind": "single",
          "prompt": "What is the output of the worked example?",
          "options": [
            "passed",
            "SyntaxError",
            "None"
          ],
          "answer": [
            0
          ],
          "hint": "Trace the statements in order.",
          "explanation": "The program prints passed."
        },
        {
          "id": "concept",
          "kind": "short",
          "prompt": "Which Python keyword displays a value on the console?",
          "accepted": [
            "print"
          ],
          "hint": "It is a built-in function.",
          "explanation": "print writes to standard output."
        },
        {
          "id": "implement",
          "kind": "code",
          "prompt": "Implement solve() to compute the guided exercise result and return it as text.",
          "starter": "def solve():\n    # Calculate the chapter exercise result\n    pass",
          "tests": "assert callable(solve)\nassert str(solve()) == \"True\"",
          "hint": "Use the guided example and return the computed result."
        }
      ]
    }
  },
  {
    "id": "python-comprehensions",
    "version": 1,
    "title": "Comprehensions, generators and performance",
    "minutes": 15,
    "introduction": "Comprehensions, generators and performance teaches one coherent skill and how to apply it. Transform data concisely and avoid needless memory use. Work through the explanation, execute the example, then solve the independent exercise.",
    "objectives": [
      {
        "id": "understand",
        "text": "Transform data concisely and avoid needless memory use."
      },
      {
        "id": "apply",
        "text": "Predict output, execute Python and explain the result."
      }
    ],
    "prerequisites": [
      "Testing, debugging and quality"
    ],
    "sections": [
      {
        "id": "concept",
        "title": "1. Core idea and mental model",
        "blocks": [
          {
            "type": "paragraph",
            "text": "A comprehension builds a collection; a generator yields values lazily. Prefer readable loops when transformations become nested. Measure performance before optimizing."
          },
          {
            "type": "definition",
            "term": "Comprehensions, generators and performance",
            "text": "Transform data concisely and avoid needless memory use."
          },
          {
            "type": "diagram",
            "caption": "Learn, verify and apply",
            "steps": [
              "Understand the rule",
              "Run a concrete example",
              "Test a changed input"
            ]
          }
        ]
      },
      {
        "id": "syntax",
        "title": "2. Syntax and worked example",
        "blocks": [
          {
            "type": "syntax",
            "syntax": {
              "signature": "squares = [n*n for n in range(4)]\nprint(squares)",
              "explanation": "A comprehension builds a collection; a generator yields values lazily. Prefer readable loops when transformations become nested. Measure performance before optimizing."
            }
          },
          {
            "type": "code",
            "example": {
              "source": "squares = [n*n for n in range(4)]\nprint(squares)",
              "expectedOutput": "[0, 1, 4, 9]",
              "explanation": "Expected console output: [0, 1, 4, 9]. Inspect the inputs and follow execution step by step."
            }
          },
          {
            "type": "callout",
            "tone": "mistake",
            "title": "Memory use",
            "text": "Large lists allocate all results; generator expressions can stream values."
          }
        ]
      },
      {
        "id": "practice",
        "title": "3. Guided application and verification",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Try this independently in the Python laboratory. Why is a generator useful for large inputs? Change the input, predict the result, and compare it with actual execution."
          },
          {
            "type": "code",
            "example": {
              "source": "print(sum(n*n for n in range(4)))",
              "expectedOutput": "14",
              "explanation": "This is one valid worked solution. Explain why it produces 14."
            }
          },
          {
            "type": "case",
            "study": {
              "context": "A developer needs a small, dependable calculation or transformation.",
              "problem": "An untested assumption can turn a simple script into an incorrect result.",
              "solution": "State the expected behavior, run the example and test a boundary case.",
              "limitations": "This introductory example is deliberately small; production programs also need validation, error handling and tests."
            }
          }
        ]
      }
    ],
    "summary": [
      "Transform data concisely and avoid needless memory use.",
      "A comprehension builds a collection; a generator yields values lazily. Prefer readable loops when transformations become nested. Measure performance before optimizing."
    ],
    "glossary": [
      {
        "term": "comprehensions",
        "definition": "Transform data concisely and avoid needless memory use."
      }
    ],
    "references": [
      {
        "id": "python-tutorial",
        "title": "Official Python tutorial",
        "url": "https://docs.python.org/3/tutorial/"
      }
    ],
    "assessment": {
      "id": "python-comprehensions-check",
      "version": 1,
      "title": "Verify understanding",
      "questions": [
        {
          "id": "output",
          "kind": "single",
          "prompt": "What is the output of the worked example?",
          "options": [
            "[0, 1, 4, 9]",
            "SyntaxError",
            "None"
          ],
          "answer": [
            0
          ],
          "hint": "Trace the statements in order.",
          "explanation": "The program prints [0, 1, 4, 9]."
        },
        {
          "id": "concept",
          "kind": "short",
          "prompt": "Which Python keyword displays a value on the console?",
          "accepted": [
            "print"
          ],
          "hint": "It is a built-in function.",
          "explanation": "print writes to standard output."
        },
        {
          "id": "implement",
          "kind": "code",
          "prompt": "Implement solve() to compute the guided exercise result and return it as text.",
          "starter": "def solve():\n    # Calculate the chapter exercise result\n    pass",
          "tests": "assert callable(solve)\nassert str(solve()) == \"14\"",
          "hint": "Use the guided example and return the computed result."
        }
      ]
    }
  },
  {
    "id": "python-data",
    "version": 1,
    "title": "Data processing and practical projects",
    "minutes": 15,
    "introduction": "Data processing and practical projects teaches one coherent skill and how to apply it. Validate records, aggregate correctly and produce trustworthy outputs. Work through the explanation, execute the example, then solve the independent exercise.",
    "objectives": [
      {
        "id": "understand",
        "text": "Validate records, aggregate correctly and produce trustworthy outputs."
      },
      {
        "id": "apply",
        "text": "Predict output, execute Python and explain the result."
      }
    ],
    "prerequisites": [
      "Comprehensions, generators and performance"
    ],
    "sections": [
      {
        "id": "concept",
        "title": "1. Core idea and mental model",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Use clear units, consistent definitions and data validation. For weighted averages, aggregate numerators and denominators, not the individual averages. Do not add overlapping cumulative snapshots."
          },
          {
            "type": "definition",
            "term": "Data processing and practical projects",
            "text": "Validate records, aggregate correctly and produce trustworthy outputs."
          },
          {
            "type": "diagram",
            "caption": "Learn, verify and apply",
            "steps": [
              "Understand the rule",
              "Run a concrete example",
              "Test a changed input"
            ]
          }
        ]
      },
      {
        "id": "syntax",
        "title": "2. Syntax and worked example",
        "blocks": [
          {
            "type": "syntax",
            "syntax": {
              "signature": "rows = [(2, 60), (8, 400)]\ncalls = sum(c for c, _ in rows)\nseconds = sum(s for _, s in rows)\nprint(seconds / calls)",
              "explanation": "Use clear units, consistent definitions and data validation. For weighted averages, aggregate numerators and denominators, not the individual averages. Do not add overlapping cumulative snapshots."
            }
          },
          {
            "type": "code",
            "example": {
              "source": "rows = [(2, 60), (8, 400)]\ncalls = sum(c for c, _ in rows)\nseconds = sum(s for _, s in rows)\nprint(seconds / calls)",
              "expectedOutput": "46.0",
              "explanation": "Expected console output: 46.0. Inspect the inputs and follow execution step by step."
            }
          },
          {
            "type": "callout",
            "tone": "mistake",
            "title": "Data quality",
            "text": "Missing or inconsistent units make correct-looking calculations misleading."
          }
        ]
      },
      {
        "id": "practice",
        "title": "3. Guided application and verification",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Try this independently in the Python laboratory. What happens when the list is empty? Change the input, predict the result, and compare it with actual execution."
          },
          {
            "type": "code",
            "example": {
              "source": "values = [10, 20, 30]\nprint(round(sum(values)/len(values), 1))",
              "expectedOutput": "20.0",
              "explanation": "This is one valid worked solution. Explain why it produces 20.0."
            }
          },
          {
            "type": "case",
            "study": {
              "context": "A developer needs a small, dependable calculation or transformation.",
              "problem": "An untested assumption can turn a simple script into an incorrect result.",
              "solution": "State the expected behavior, run the example and test a boundary case.",
              "limitations": "This introductory example is deliberately small; production programs also need validation, error handling and tests."
            }
          }
        ]
      }
    ],
    "summary": [
      "Validate records, aggregate correctly and produce trustworthy outputs.",
      "Use clear units, consistent definitions and data validation. For weighted averages, aggregate numerators and denominators, not the individual averages. Do not add overlapping cumulative snapshots."
    ],
    "glossary": [
      {
        "term": "data",
        "definition": "Validate records, aggregate correctly and produce trustworthy outputs."
      }
    ],
    "references": [
      {
        "id": "python-tutorial",
        "title": "Official Python tutorial",
        "url": "https://docs.python.org/3/tutorial/"
      }
    ],
    "assessment": {
      "id": "python-data-check",
      "version": 1,
      "title": "Verify understanding",
      "questions": [
        {
          "id": "output",
          "kind": "single",
          "prompt": "What is the output of the worked example?",
          "options": [
            "46.0",
            "SyntaxError",
            "None"
          ],
          "answer": [
            0
          ],
          "hint": "Trace the statements in order.",
          "explanation": "The program prints 46.0."
        },
        {
          "id": "concept",
          "kind": "short",
          "prompt": "Which Python keyword displays a value on the console?",
          "accepted": [
            "print"
          ],
          "hint": "It is a built-in function.",
          "explanation": "print writes to standard output."
        },
        {
          "id": "implement",
          "kind": "code",
          "prompt": "Implement solve() to compute the guided exercise result and return it as text.",
          "starter": "def solve():\n    # Calculate the chapter exercise result\n    pass",
          "tests": "assert callable(solve)\nassert str(solve()) == \"20.0\"",
          "hint": "Use the guided example and return the computed result."
        }
      ]
    }
  }
];
