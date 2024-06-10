/**
 * packages/components/editorv2/EditorFileExplorerIcon.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.06.2024
 *
 */

import * as React from "react";
import { FaFile, FaFolder, FaGit, FaJsSquare } from "react-icons/fa";
import {
  FaCss3,
  FaDocker,
  FaFileCircleQuestion,
  FaHtml5,
  FaNodeJs,
} from "react-icons/fa6";
import {
  BsFiletypeCss,
  BsFiletypeHtml,
  BsFiletypeJava,
  BsFiletypeJs,
  BsFiletypeJson,
  BsFiletypeJsx,
  BsFiletypeMd,
  BsFiletypeMdx,
  BsFiletypeSass,
  BsFiletypeScss,
  BsFiletypeSh,
  BsFiletypeSql,
  BsFiletypeSvg,
  BsFiletypeTsx,
} from "react-icons/bs";
import { SiTypescript } from "react-icons/si";

export default function EditorFileExplorerIcon(props: {
  entry: {
    type: string;
    name: string;
    content: string;
    children: any[];
  };
}) {
  const iconByType: {
    [key: string]: JSX.Element;
  } = {
    directory: <FaFolder />,
    file: <FaFile />,
  };

  const iconByExtension: {
    [key: string]: JSX.Element;
  } = {
    html: <BsFiletypeHtml />,
    js: <BsFiletypeJs />,
    css: <BsFiletypeCss />,
    jsx: <BsFiletypeJsx />,
    tsx: <BsFiletypeTsx />,
    md: <BsFiletypeMd />,
    mdx: <BsFiletypeMdx />,
    java: <BsFiletypeJava />,
    json: <BsFiletypeJson />,
    sass: <BsFiletypeSass />,
    scss: <BsFiletypeScss />,
    sh: <BsFiletypeSh />,
    sql: <BsFiletypeSql />,
    svg: <BsFiletypeSvg />,
  };

  const iconByName: {
    [key: string]: JSX.Element;
  } = {
    "package.json": <FaNodeJs />,
    "tsconfig.json": <SiTypescript />,
    Dockerfile: <FaDocker />,
    ".git": <FaGit />,
    "project.codeup.json": <img src={"/codeup.svg"} width={26} height={26} />,
  };

  if (!props.entry) return <></>;

  return (
    <>
      {Object.keys(iconByName).includes(props.entry.name) ? (
        iconByName[props.entry.name]
      ) : Object.keys(iconByExtension).includes(
          props.entry.name.split(".").pop() as string
        ) ? (
        iconByExtension[props.entry.name.split(".").pop() as string]
      ) : Object.keys(iconByType).includes(props.entry.type) ? (
        iconByType[props.entry.type]
      ) : (
        <FaFileCircleQuestion />
      )}
    </>
  );
}
