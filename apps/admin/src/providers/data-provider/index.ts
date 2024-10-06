"use client";

import dataProviderHasura, { GraphQLClient } from "@refinedev/hasura";

const API_URL = "https://codeup.hasura.app/v1/graphql";

export const client = new GraphQLClient(API_URL, {
  headers: {
    "x-hasura-admin-secret": process.env
      .NEXT_PUBLIC_HASURA_ADMIN_SECRET as string,
  },
});

export const dataProvider = dataProviderHasura(client);
