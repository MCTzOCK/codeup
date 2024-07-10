/**
 * packages/components/tasks/TaskListViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.07.2024
 *
 */

import * as React from "react";
import CodeUpModal from "../codeup/CodeUpModal";

export default function TaskListViewer(props: {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  list?: {
    _id: string;
    name: string;
    owner: string;
    createdAt: string;
    items: {
      createdAt: string;
      _id: string;
      name: string;
      done: boolean;
      description: string;
      list: string;
    }[];
  };
  reloadLists: () => void;
}) {
  if (!props.list) return <></>;

  return (
    <>
      <CodeUpModal
        onOpen={props.onOpen}
        onClose={props.onClose}
        isOpen={props.isOpen}
        title={props.list.name}
      >
        <pre>{JSON.stringify(props.list, null, 2)}</pre>
      </CodeUpModal>
    </>
  );
}
