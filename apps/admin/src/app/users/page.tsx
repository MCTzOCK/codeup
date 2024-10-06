"use client";
/**
 * apps/admin/src/app/users/page.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.10.2024
 *
 */

import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";

export default function UserList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
    meta: {
      fields: [
        "_id",
        "username",
        "email",
        "firstName",
        "lastName",
        "role",
        "active",
      ],
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="_id">
        <Table.Column dataIndex="_id" title={"ID"} />
        <Table.Column dataIndex="email" title={"E-Mail"} />
        <Table.Column dataIndex="username" title={"Username"} />
        <Table.Column dataIndex="firstName" title={"First name"} />
        <Table.Column dataIndex="lastName" title={"Last name"} />
        <Table.Column dataIndex="role" title={"Role"} />
        <Table.Column dataIndex="active" title={"Active"} />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
