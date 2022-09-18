/**
 * apps/web/src/pages/course/html-basics/forms.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import * as React from "react";
import HTMLCourseSections from "@codeup/components/course/HTMLCourseSections";
import { Box, Flex, Heading, List, ListItem, Text } from "@chakra-ui/react";
import CodeBlock from "../../../special-components/CodeBlock";
import { Quiz } from "@codeup/components/course";

export default function forms() {
  return (
    <>
      <HTMLCourseSections />
      <Flex
        direction="column"
        gap="2rem"
        margin={["1.2rem", "4rem"]}
        marginInline={["1.2rem", "16rem"]}
      >
        <Heading size="xl">HTML Basics - Formulare</Heading>
        <Box>
          <Heading size="lg">Formulare</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Formulare werden mit dem Tag <code>&lt;form&gt;</code> erstellt. Das
            Formular kann mit dem Attribut <code>action</code> eine URL angeben,
            an die die Daten gesendet werden sollen. Mit dem Attribut&nbsp;
            <code>method</code> kann die Methode angegeben werden, mit der die
            Daten gesendet werden sollen. Die Methode kann entweder&nbsp;
            <code>get</code>&nbsp; oder <code>post</code> sein. Die
            Methode&nbsp;
            <code>get</code> sendet die Daten als Query-Parameter in der URL.
            Die Methode <code>post</code>&nbsp; sendet die Daten als Body in der
            HTTP-Anfrage. Ein Formular kann mehrere Elemente erhalten. Das
            können zum Beispiel Textfelder, Checkboxen, Radio-Buttons, Dropdowns
            oder Knöpfe sein.
            <CodeBlock className="html">
              {`<form action="https://example.com" method="post">
  <input type="text" name="username" />
  <input type="password" name="password" />
  <input type="submit" value="Login" />
</form>`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">Textfelder</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Textfelder werden mit dem Tag <code>&lt;input&gt;</code> erstellt.
            Das Attribut <code>type</code> muss auf <code>text</code> gesetzt
            werden. Mit dem Attribut <code>name</code> kann der Name des Feldes
            angegeben werden. Dieser Name wird später verwendet, um die Daten
            aus dem Formular zu erhalten. Mit dem Attribut <code>value</code>
            &nbsp;kann ein Standardwert angegeben werden. Dieser wird dann
            angezeigt, wenn das Formular geladen wird.
            <CodeBlock className="html">
              {`<input type="text" name="username" value="Ben" />`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">Passwortfelder</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Passwortfelder werden mit dem Tag <code>&lt;input&gt;</code>
            erstellt. Das Attribut <code>type</code> muss auf&nbsp;
            <code>password</code> gesetzt werden. Mit dem Attribut&nbsp;
            <code>name</code> kann der Name des Feldes angegeben werden. Dieser
            Name wird später verwendet, um die Daten aus dem Formular zu
            erhalten. Mit dem Attribut <code>value</code>
            &nbsp;kann ein Standardwert angegeben werden. Dieser wird dann
            angezeigt, wenn das Formular geladen wird.
            <CodeBlock className="html">
              {`<input type="password" name="password" value="123456" />`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">Checkboxen</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Checkboxen werden mit dem Tag <code>&lt;input&gt;</code> erstellt.
            Das Attribut <code>type</code> muss auf <code>checkbox</code>
            gesetzt werden. Mit dem Attribut <code>name</code> kann der Name des
            Feldes angegeben werden. Dieser Name wird später verwendet, um die
            Daten aus dem Formular zu erhalten. Mit dem Attribut&nbsp;
            <code>value</code> kann ein Standardwert angegeben werden. Dieser
            wird dann angezeigt, wenn das Formular geladen wird. Mit dem
            Attribut <code>checked</code> kann angegeben werden, ob die Checkbox
            standardmäßig angehakt ist.
            <CodeBlock className="html">
              {`<input type="checkbox" name="agb" value="1" checked />`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">Knöpfe</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Knöpfe werden mit dem Tag <code>&lt;button&gt;</code> erstellt. Mit
            dem Attribut <code>type</code> kann der Typ des Knopfes angegeben
            werden. Der Typ kann entweder <code>submit</code> oder&nbsp;
            <code>reset</code> sein. Der Typ <code>submit</code> sendet das
            Formular ab. Der Typ <code>reset</code> setzt das Formular zurück.
            Mit dem Attribut <code>onClick</code> kann eine JavaScript Funktion
            angegeben werden, die ausgeführt werden soll, wenn der Knopf
            geklickt wird.
            <CodeBlock className="html">{`<button type="submit" onClick="alert('Hello World')">Button</button>`}</CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">Dropdowns</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Dropdowns werden mit dem Tag <code>&lt;select&gt;</code> erstellt.
            Mit dem Attribut <code>name</code> kann der Name des Feldes
            angegeben werden. Dieser Name wird später verwendet, um die Daten
            aus dem Formular zu erhalten. Mit dem Tag{" "}
            <code>&lt;option&gt;</code>
            &nbsp;kann ein Element in der Dropdown-Liste erstellt werden. Mit
            dem Attribut <code>value</code> kann der Wert des Elements angegeben
            werden. Dieser Wert wird später verwendet, um die Daten aus dem
            Formular zu erhalten. Mit dem Attribut <code>selected</code>
            kann angegeben werden, ob das Element standardmäßig ausgewählt ist.
            <CodeBlock className="html">
              {`<select name="color">
  <option value="red">Rot</option>
  <option value="green" selected>Grün</option>
  <option value="blue">Blau</option>
</select>`}
            </CodeBlock>
          </Text>
        </Box>
        <Quiz
          title={"Formulare"}
          questions={[
            {
              question: "Welche HTML-Elemente werden für Textfelder verwendet?",
              answers: [
                { answer: '<input type="text" />', correct: true },
                { answer: '<input type="password" />', correct: false },
                { answer: '<input type="checkbox" />', correct: false },
                { answer: '<input type="radio" />', correct: false },
              ],
              difficulty: "easy",
            },
            {
              question:
                "Welche HTML-Elemente werden für Passwortfelder verwendet?",
              answers: [
                { answer: '<input type="text" />', correct: false },
                { answer: '<input type="password" />', correct: true },
                { answer: '<input type="checkbox" />', correct: false },
                { answer: '<input type="radio" />', correct: false },
              ],
              difficulty: "easy",
            },
            {
              question: "Welche HTTP-Methoden werden für Formulare verwendet?",
              answers: [
                { answer: "GET und POST", correct: true },
                { answer: "PUT und POST", correct: false },
                { answer: "GET und PUT", correct: false },
                { answer: "POST und DELETE", correct: false },
              ],
              difficulty: "medium",
            },
            {
              question: "Welche HTML-Elemente werden für Checkboxen verwendet?",
              answers: [
                { answer: '<input type="text" />', correct: false },
                { answer: '<input type="password" />', correct: false },
                { answer: '<input type="checkbox" />', correct: true },
                { answer: '<input type="radio" />', correct: false },
              ],
              difficulty: "easy",
            },
            {
              question: "Welche HTML-Elemente werden für Dropdowns verwendet?",
              answers: [
                { answer: '<input type="dd" />', correct: false },
                { answer: '<input type="dropdown" />', correct: false },
                { answer: "<dropdown>", correct: false },
                { answer: "<select>", correct: true },
              ],
              difficulty: "easy",
            },
            {
              question: "Welche HTML-Elemente werden für Knöfpe verwendet?",
              answers: [
                { answer: "<btn>", correct: false },
                { answer: "<knopf>", correct: false },
                { answer: "<button>", correct: true },
              ],
              difficulty: "easy",
            },
          ]}
        />
      </Flex>
    </>
  );
}
