# Curiosity Report

# What is a Linter and how do they work?

While only briefly used on the backend service of the jwt-pizza application, I found the concept of a “linter” fascinating. It also proved to be especially helpful as I wrote code for tests and bug fixes. I introduced ESlint into a frontend project I am currently working on and am playing with creating my own rules. For my curiosity report, I decided to dive deeper into what linters are, how they work, and why they are useful.

### Origin of Linting

While researching linters, I discovered the that the term “lint” was coined by Stephen Johnson at Bell Labs while he was debugging C code. The original linter program was actually used to help him debug “yacc” grammar that he was writing in C. Debugging Yacc, which I discovered stands for Yet Another Compiler-Compiler, was proving to be difficult, and so Stephen came up with Lint to help him. In a 1978 document written by Johnson, he described some of the uses of his C Linter as follows:

> _“It examines C source programs, detecting a number of bugs and obscurities. It enforces the type rules of C more strictly than the C compilers”_

> _“Another option detects a number of wasteful, or error prone, constructions which nevertheless are, strictly speaking, legal.”_

A linting tool was necessary because compilers were and are able to convert code into executable files with rapid speed, but they “do not do sophisticated type checking, especially between separately compiled programs” (Johnson).

### How Linters Work

Linters fall under a category of software testing labeled “Static Analysis” which is the process of a software program examining source code without executing any of it. The basic instructions for how a linter works are as follows:

1. The linter is given source code and it is then broken down into tokens (not necessary compiled)
2. The linter then takes the tokens and constructs an Abstract Syntax Tree (pictured to the right)
   1. Abstract Syntax Trees is a data structure used widely by compilers to examine different variables and tokens within a code snipped
3. The linter compares the Abstract Syntax Tree against a set of defined rules for the language it is linting to find errors, unused variables, or incorrect syntax.

![Abstract Syntax Tree for Euclidean Algorithm](https://upload.wikimedia.org/wikipedia/commons/c/c7/Abstract_syntax_tree_for_Euclidean_algorithm.svg)

Source: [https://en.wikipedia.org/wiki/Abstract_syntax_tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree)

If the linter finds difference in the defined rules and generated syntax tree, the linter will flag that difference and report it to the developer. While useful for finding errors defined by a pre-written set of rules for a specific language, linters also excel at finding stylistic errors by using rules written by the developer.

### Why use a Linter?

In the case of jwt-pizza-service, a Linter was useful for identifying variables that were never used. In a more general sense, Linters first serve as an excellent way to control code quality. You can imagine a large code-base with hundreds of developers would get messy with different coding styles. Linters allow specific structure related rules to ensure developers are all writing code in the same manner and structure, making it easier to read or edit in the future.

Linters also help catch errors in our code before execution. One example could be:

```jsx
const fs = require("fs");

fs.readFile("foo.txt", "utf8", (err, data) => {
  console.log("data", data.toLowerCase());
});
```

While it may not be apparent to the runtime environment what the error is, or even to the developer, a Linter will let us know that the err does not get handled properly in this scenario.

Interestingly, I found out that Linters are also crucial to enhancing the security of an application. According to an article written on the SonarSource website:

> _“They_ [ Linters ] _can be customized to specific security standards guaranteeing the source code meets industry or regulatory requirements and guidelines such as [OWASP Top 10](https://www.sonarsource.com/solutions/security/owasp/) and MISRA C++ 2023 to help protect applications from malicious attacks like SQL injection or cross-site scripting, buffer overflows, etc”_

Overall Linters are useful tools for increasing developer productivity, ensuring code quality, and protecting applications from vulnerabilities.

### ESLint

Linters are especially useful when it comes to languages that are interpreted at runtime such as Python or JavaScript. ESLint is an industry standard linter when it comes to JavaScript code, which is particularly vulnerable to errors such as type compatibility issues. Released in 2013 by Nicholas C. Zakas, ESLint serves a tool to analyze JavaScript code and detect bugs. Many IDE’s now have it integrated into their system, allowing you to see Lint errors in real time and review an appropriate quick fix.

![Source: [https://eslint.org/docs/latest/contribute/architecture/](https://eslint.org/docs/latest/contribute/architecture/)](https://eslint.org/docs/latest/assets/images/architecture/dependency.svg)

Source: [https://eslint.org/docs/latest/contribute/architecture/](https://eslint.org/docs/latest/contribute/architecture/)

The architecture of ESLint as pictured above from ESLint’s website, contains the entry point eslint.js, which they state is the file that gets executed when using the command line interface.

The CLI Engine object is responsible for managing the environment of the linter and reading the source code from the file system. It interacts directly with the linter object, which points to the source-code and rules.

The linter objects main method is `verify()` which accepts as arguments the source code on one side, and the rule configuration on the other side, to confirm if the code is up to standard. The linter is also responsible for generating the Abstract Syntax Tree from above in order to perform these comparisons.

ESLint allows for flexibility on custom written rules. A structure of a custom rule from their website goes as follows:

```jsx
// customRule.js

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Description of the rule",
    },
    fixable: "code",
    schema: [], // no options
  },
  create: function (context) {
    return {
      // callback functions
    };
  },
};
```

ESLint also provides a way for you to see the performance and time a particular custom rule has by setting the TIMING variables in the CLI to 1.

### Conclusion

Linting, which has been around since 1978 in the days of programing in B and C languages, is an excellent testing tool developers can use to catch bugs in their code. Additionally, Linters such as ESLint provide a way for teams of developers to standardize their coding styles and structure. This creates a code-base that has consistent, readable code across the entire application. In the context of DevOps, linting proves to be a useful tool for testing and analyzing code before pushing into a production environment. By linting code before pushing to production, syntax errors are found, unused variables are detected, and unhandled exceptions are spotted. In my current project I hope to use it to standardize my code-base with a particular style for when future developers need to navigate their way through it.
