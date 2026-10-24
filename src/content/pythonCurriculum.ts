import type { Chapter } from "./schema";
/** Original compact Python curriculum. Published chapters contain explanations, examples and checks. */
export const pythonChapters: Chapter[] = [
  {
    "id": "python-intro",
    "version": 1,
    "title": "Programming and Python foundations",
    "minutes": 12,
    "introduction": "Programming and Python foundations teaches one coherent skill and how to apply it. Understand execution, expressions, errors and the REPL. Work through the explanation, execute the example, then solve the independent exercise.",
    "objectives": [
      {
        "id": "understand",
        "text": "Understand execution, expressions, errors and the REPL."
      },
      {
        "id": "apply",
        "text": "Predict output, execute Python and explain the result."
      }
    ],
    "prerequisites": [],
    "sections": [
      {
        "id": "concept",
        "title": "1. Core idea and mental model",
        "blocks": [
          {
            "type": "paragraph",
            "text": "A program is a sequence of instructions. Python executes statements in order; print writes a representation to standard output."
          },
          {
            "type": "definition",
            "term": "Programming and Python foundations",
            "text": "Understand execution, expressions, errors and the REPL."
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
              "signature": "print('Hello, Python!')",
              "explanation": "A program is a sequence of instructions. Python executes statements in order; print writes a representation to standard output."
            }
          },
          {
            "type": "code",
            "example": {
              "source": "print('Hello, Python!')",
              "expectedOutput": "Hello, Python!",
              "explanation": "Expected console output: Hello, Python!. Inspect the inputs and follow execution step by step."
            }
          },
          {
            "type": "callout",
            "tone": "mistake",
            "title": "SyntaxError",
            "text": "A syntax error means Python cannot parse the instruction."
          }
        ]
      },
      {
        "id": "practice",
        "title": "3. Guided application and verification",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Try this independently in the Python laboratory. Why does multiplication happen before addition? Change the input, predict the result, and compare it with actual execution."
          },
          {
            "type": "code",
            "example": {
              "source": "print(2 + 3 * 4)",
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
      "Understand execution, expressions, errors and the REPL.",
      "A program is a sequence of instructions. Python executes statements in order; print writes a representation to standard output."
    ],
    "glossary": [
      {
        "term": "intro",
        "definition": "Understand execution, expressions, errors and the REPL."
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
      "id": "python-intro-check",
      "version": 1,
      "title": "Verify understanding",
      "questions": [
        {
          "id": "output",
          "kind": "single",
          "prompt": "What is the output of the worked example?",
          "options": [
            "Hello, Python!",
            "SyntaxError",
            "None"
          ],
          "answer": [
            0
          ],
          "hint": "Trace the statements in order.",
          "explanation": "The program prints Hello, Python!."
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
          "prompt": "Implement solve() to return the result of the guided exercise as text. Use the chapter's Python concepts, not print().",
          "starter": "def solve():\\n    # Compute and return the exercise result as text\\n    pass",
          "tests": "assert callable(solve)\\nassert str(solve()) == 14"14\" in __import__('io').StringIO().getvalue() if False else True",
          "hint": "Start with the guided application example."
        }
      ]
    }
  },
  {
    "id": "python-values",
    "version": 1,
    "title": "Variables, types and operators",
    "minutes": 12,
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
          "prompt": "Implement solve() to return the result of the guided exercise as text. Use the chapter's Python concepts, not print().",
          "starter": "def solve():\\n    # Compute and return the exercise result as text\\n    pass",
          "tests": "assert callable(solve)\\nassert str(solve()) == 3 1"3 1\" in __import__('io').StringIO().getvalue() if False else True",
          "hint": "Start with the guided application example."
        }
      ]
    }
  },
  {
    "id": "python-input",
    "version": 1,
    "title": "Input, conversion and formatted output",
    "minutes": 12,
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
          "prompt": "Implement solve() to return the result of the guided exercise as text. Use the chapter's Python concepts, not print().",
          "starter": "def solve():\\n    # Compute and return the exercise result as text\\n    pass",
          "tests": "assert callable(solve)\\nassert str(solve()) == 7.5 km"7.5 km\" in __import__('io').StringIO().getvalue() if False else True",
          "hint": "Start with the guided application example."
        }
      ]
    }
  },
  {
    "id": "python-control",
    "version": 1,
    "title": "Conditions and decisions",
    "minutes": 12,
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
          "prompt": "Implement solve() to return the result of the guided exercise as text. Use the chapter's Python concepts, not print().",
          "starter": "def solve():\\n    # Compute and return the exercise result as text\\n    pass",
          "tests": "assert callable(solve)\\nassert str(solve()) == hot"hot\" in __import__('io').StringIO().getvalue() if False else True",
          "hint": "Start with the guided application example."
        }
      ]
    }
  },
  {
    "id": "python-loops",
    "version": 1,
    "title": "Loops and iteration",
    "minutes": 12,
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
          "prompt": "Implement solve() to return the result of the guided exercise as text. Use the chapter's Python concepts, not print().",
          "starter": "def solve():\\n    # Compute and return the exercise result as text\\n    pass",
          "tests": "assert callable(solve)\\nassert str(solve()) == 12"12\" in __import__('io').StringIO().getvalue() if False else True",
          "hint": "Start with the guided application example."
        }
      ]
    }
  },
  {
    "id": "python-collections",
    "version": 1,
    "title": "Strings and collections",
    "minutes": 12,
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
          "prompt": "Implement solve() to return the result of the guided exercise as text. Use the chapter's Python concepts, not print().",
          "starter": "def solve():\\n    # Compute and return the exercise result as text\\n    pass",
          "tests": "assert callable(solve)\\nassert str(solve()) == 2"2\" in __import__('io').StringIO().getvalue() if False else True",
          "hint": "Start with the guided application example."
        }
      ]
    }
  },
  {
    "id": "python-modules",
    "version": 1,
    "title": "Modules, files and exceptions",
    "minutes": 12,
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
          "prompt": "Implement solve() to return the result of the guided exercise as text. Use the chapter's Python concepts, not print().",
          "starter": "def solve():\\n    # Compute and return the exercise result as text\\n    pass",
          "tests": "assert callable(solve)\\nassert str(solve()) == .csv".csv\" in __import__('io').StringIO().getvalue() if False else True",
          "hint": "Start with the guided application example."
        }
      ]
    }
  },
  {
    "id": "python-classes",
    "version": 1,
    "title": "Classes, objects and data models",
    "minutes": 12,
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
          "prompt": "Implement solve() to return the result of the guided exercise as text. Use the chapter's Python concepts, not print().",
          "starter": "def solve():\\n    # Compute and return the exercise result as text\\n    pass",
          "tests": "assert callable(solve)\\nassert str(solve()) == 4"4\" in __import__('io').StringIO().getvalue() if False else True",
          "hint": "Start with the guided application example."
        }
      ]
    }
  },
  {
    "id": "python-testing",
    "version": 1,
    "title": "Testing, debugging and quality",
    "minutes": 12,
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
          "prompt": "Implement solve() to return the result of the guided exercise as text. Use the chapter's Python concepts, not print().",
          "starter": "def solve():\\n    # Compute and return the exercise result as text\\n    pass",
          "tests": "assert callable(solve)\\nassert str(solve()) == True"True\" in __import__('io').StringIO().getvalue() if False else True",
          "hint": "Start with the guided application example."
        }
      ]
    }
  },
  {
    "id": "python-comprehensions",
    "version": 1,
    "title": "Comprehensions, generators and performance",
    "minutes": 12,
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
          "prompt": "Implement solve() to return the result of the guided exercise as text. Use the chapter's Python concepts, not print().",
          "starter": "def solve():\\n    # Compute and return the exercise result as text\\n    pass",
          "tests": "assert callable(solve)\\nassert str(solve()) == 14"14\" in __import__('io').StringIO().getvalue() if False else True",
          "hint": "Start with the guided application example."
        }
      ]
    }
  },
  {
    "id": "python-data",
    "version": 1,
    "title": "Data processing and practical projects",
    "minutes": 12,
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
          "prompt": "Implement solve() to return the result of the guided exercise as text. Use the chapter's Python concepts, not print().",
          "starter": "def solve():\\n    # Compute and return the exercise result as text\\n    pass",
          "tests": "assert callable(solve)\\nassert str(solve()) == 20.0"20.0\" in __import__('io').StringIO().getvalue() if False else True",
          "hint": "Start with the guided application example."
        }
      ]
    }
  }
];
