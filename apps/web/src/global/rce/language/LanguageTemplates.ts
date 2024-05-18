/**
 * apps/web/src/global/rce/language/LanguageTemplates.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.05.2024
 *
 */

export const LanguageTemplates: {
  [key: string]: string;
} = {
  typescript: "const x: string = 'Hello World';",
  javascript: "const x = 'Hello World';",
  python: "x = 'Hello World'",
  java: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tString x = "Hello World";\n\t}\n}',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tx := "Hello World"\n}',
};
