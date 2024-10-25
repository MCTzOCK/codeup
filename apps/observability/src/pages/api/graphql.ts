/**
 * apps/observability/src/pages/api/graphql.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.10.2024
 *
 */

import { schemaComposer } from "graphql-compose";
import { composeMongoose } from "graphql-compose-mongoose";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import ApplicationModel from "@/models/ApplicationModel";
import PageViewModel from "@/models/PageViewModel";
import SessionReplayModel from "@/models/SessionReplayModel";
import REST from "@codeup/rest/dist";
import { GraphQLError } from "graphql/error";
import { RESTAPI } from "@codeup/rest/dist/makeRequest";
import gql from "graphql-tag";
import { GraphQLInputObjectType } from "graphql/type";
import { ObjectId } from "mongodb";

const customizationOptions = {};
const newFields: any = {};
const newMutations: any = {};

let schema;

// @ts-ignore
if (global.gqlSchema) {
  // @ts-ignore
  schema = global.gqlSchema;
}

if (process.env.NODE_ENV !== "production") {
  // @ts-ignore
  global.gqlSchema = null;
  schemaComposer.clear();
}

const resolvers = {
  createdChart: async (model: any, args: any, context: any) => {
    if (!context.auth) {
      throw new GraphQLError("User not authorized", {
        extensions: {
          code: "UNAUTHORIZED",
          http: { status: 401 },
        },
      });
    }

    const app = await ApplicationModel.findOne({
      _id: args.applicationId,
      username: context.user.username,
    });

    if (!app) {
      throw new GraphQLError("Application not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    let groupByFormat = "%Y-%m-%d";

    const res = await model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(args.startDate),
            $lte: new Date(args.endDate),
          },
          application: new ObjectId(args.applicationId),
        },
      },
      {
        $project: {
          interval: {
            $dateToString: { format: groupByFormat, date: `$createdAt` },
          },
          amount: 1,
        },
      },
      {
        $group: {
          _id: "$interval",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    let intervalList = [];

    for (
      let i = new Date(args.startDate);
      i <= new Date(args.endDate);
      i.setDate(i.getDate() + 1)
    ) {
      intervalList.push(i.toISOString().split("T")[0]);
    }

    const intervals = intervalList.map((interval) => {
      const found = res.find((r: any) => r._id === interval);
      return {
        id: interval,
        count: found ? found.count : 0,
      };
    });

    return intervals;
  },
  many: async (model: any, args: any, context: any) => {
    if (!context.auth) {
      throw new GraphQLError("User not authorized", {
        extensions: {
          code: "UNAUTHORIZED",
          http: { status: 401 },
        },
      });
    }

    const app = await ApplicationModel.findOne({
      _id: args.applicationId,
      username: context.user.username,
    });

    if (!app) {
      throw new GraphQLError("Application not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    const docs = await model.find({
      application: args.applicationId,
      ...args.filter,
    });

    return docs;
  },
  pagination: async (model: any, args: any, context: any) => {
    if (!context.auth) {
      throw new GraphQLError("User not authorized", {
        extensions: {
          code: "UNAUTHORIZED",
          http: { status: 401 },
        },
      });
    }

    const page = args.page || 1;
    const limit = args.limit || 10;
    const applicationId = args.applicationId;

    const app = await ApplicationModel.findOne({
      _id: applicationId,
      username: context.user.username,
    });

    if (!app) {
      throw new GraphQLError("Application not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    const docs = await model
      .find({
        application: applicationId,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    return docs;
  },
  chartField: async (model: any, args: any, context: any) => {
    if (!context.auth) {
      throw new GraphQLError("User not authorized", {
        extensions: {
          code: "UNAUTHORIZED",
          http: { status: 401 },
        },
      });
    }

    const app = await ApplicationModel.findOne({
      _id: args.applicationId,
      username: context.user.username,
    });

    if (!app) {
      throw new GraphQLError("Application not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    const res = await model.aggregate([
      {
        $match: {
          application: new ObjectId(args.applicationId),
        },
      },
      {
        $group: {
          _id: "$" + args.field,
          count: { $sum: 1 },
        },
      },
    ]);

    return res;
  },
  byId: async (model: any, args: any, context: any) => {
    if (!context.auth) {
      throw new GraphQLError("User not authorized", {
        extensions: {
          code: "UNAUTHORIZED",
          http: { status: 401 },
        },
      });
    }

    const app = await ApplicationModel.find({
      _id: args.applicationId,
      username: context.user.username,
    });

    if (!app) {
      throw new GraphQLError("Application not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    const doc = await model.findOne({
      _id: args.id,
      application: args.applicationId,
    });

    return doc;
  },
  count: async (model: any, args: any, context: any) => {
    if (!context.auth) {
      throw new GraphQLError("User not authorized", {
        extensions: {
          code: "UNAUTHORIZED",
          http: { status: 401 },
        },
      });
    }

    const app = await ApplicationModel.find({
      _id: args.applicationId,
      username: context.user.username,
    });

    if (!app) {
      throw new GraphQLError("Application not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    const count = await model.countDocuments({
      application: args.applicationId,
    });

    return count;
  },
};

if (!schema) {
  const ApplicationTC = composeMongoose(ApplicationModel, customizationOptions);
  const PageViewTC = composeMongoose(PageViewModel, customizationOptions);
  const SReplayTC = composeMongoose(SessionReplayModel, customizationOptions);

  ApplicationTC.addResolver({
    name: "ById",
    type: [ApplicationTC],
    args: {
      id: "String!",
    },
    resolve: async ({ args, context }: any) => {
      if (!context.auth) {
        throw new GraphQLError("User not authorized", {
          extensions: {
            code: "UNAUTHORIZED",
            http: { status: 401 },
          },
        });
      }

      const app = await ApplicationModel.find({
        _id: args.id,
        username: context.user.username,
      });

      return app;
    },
  });
  PageViewTC.addResolver({
    name: "ChartCreated",
    type: "JSON",
    args: {
      startDate: "Date!",
      endDate: "Date!",
      applicationId: "String!",
    },
    resolve: async ({ args, context }: any) => {
      return resolvers.createdChart(PageViewModel, args, context);
    },
  });
  PageViewTC.addResolver({
    name: "Many",
    type: [PageViewTC],
    args: {
      applicationId: "String!",
      filter: "JSON",
    },
    resolve: async ({ args, context }: any) => {
      return resolvers.many(PageViewModel, args, context);
    },
  });
  PageViewTC.addResolver({
    name: "Pagination",
    type: [PageViewTC],
    args: {
      page: "Int",
      limit: "Int",
      applicationId: "String!",
    },
    resolve: async ({ args, context }: any) => {
      return resolvers.pagination(PageViewModel, args, context);
    },
  });
  PageViewTC.addResolver({
    name: "ChartField",
    type: "JSON",
    args: {
      applicationId: "String!",
      field: "String!",
    },
    resolve: async ({ args, context }: any) => {
      return resolvers.chartField(PageViewModel, args, context);
    },
  });
  PageViewTC.addResolver({
    name: "ById",
    type: PageViewTC,
    args: {
      applicationId: "String!",
      id: "String!",
    },
    resolve: async ({ args, context }: any) => {
      return resolvers.byId(PageViewModel, args, context);
    },
  });
  PageViewTC.addResolver({
    name: "Count",
    type: "Int",
    args: {
      applicationId: "String!",
    },
    resolve: async ({ args, context }: any) => {
      return resolvers.count(PageViewModel, args, context);
    },
  });
  SReplayTC.addResolver({
    name: "ChartCreated",
    type: "JSON",
    args: {
      startDate: "Date!",
      endDate: "Date!",
      applicationId: "String!",
    },
    resolve: async ({ args, context }: any) => {
      return resolvers.createdChart(SessionReplayModel, args, context);
    },
  });
  SReplayTC.addResolver({
    name: "Many",
    type: [SReplayTC],
    args: {
      applicationId: "String!",
      filter: "JSON",
    },
    resolve: async ({ args, context }: any) => {
      return resolvers.many(SessionReplayModel, args, context);
    },
  });
  SReplayTC.addResolver({
    name: "Pagination",
    type: [SReplayTC],
    args: {
      page: "Int",
      limit: "Int",
      applicationId: "String!",
    },
    resolve: async ({ args, context }: any) => {
      return resolvers.pagination(SessionReplayModel, args, context);
    },
  });
  SReplayTC.addResolver({
    name: "ChartField",
    type: "JSON",
    args: {
      applicationId: "String!",
      field: "String!",
    },
    resolve: async ({ args, context }: any) => {
      return resolvers.chartField(SessionReplayModel, args, context);
    },
  });
  SReplayTC.addResolver({
    name: "ById",
    type: SReplayTC,
    args: {
      applicationId: "String!",
      id: "String!",
    },
    resolve: async ({ args, context }: any) => {
      return resolvers.byId(SessionReplayModel, args, context);
    },
  });
  SReplayTC.addResolver({
    name: "Count",
    type: "Int",
    args: {
      applicationId: "String!",
    },
    resolve: async ({ args, context }: any) => {
      return resolvers.count(SessionReplayModel, args, context);
    },
  });

  schemaComposer.Query.addFields({
    ApplicationById: ApplicationTC.getResolver("ById"),
    PageViewChartCreated: PageViewTC.getResolver("ChartCreated"),
    PageViewMany: PageViewTC.getResolver("Many"),
    PageViewPagination: PageViewTC.getResolver("Pagination"),
    PageViewChart: PageViewTC.getResolver("ChartField"),
    PageViewById: PageViewTC.getResolver("ById"),
    PageViewCount: PageViewTC.getResolver("Count"),
    SReplayChartCreated: SReplayTC.getResolver("ChartCreated"),
    SReplayMany: SReplayTC.getResolver("Many"),
    SReplayPagination: SReplayTC.getResolver("Pagination"),
    SReplayChart: SReplayTC.getResolver("ChartField"),
    SReplayById: SReplayTC.getResolver("ById"),
    SReplayCount: SReplayTC.getResolver("Count"),
  });
  // @ts-ignore
  global.gqlSchema = schemaComposer.buildSchema();
  // @ts-ignore
  schema = global.gqlSchema;
}
RESTAPI.path_prefix = "https://codeup.space";

const server = new ApolloServer({
  schema,
});

export default startServerAndCreateNextHandler(server, {
  context: async (req) => {
    if (!req.headers.authorization) {
      return { auth: false };
    }

    const res = await REST.Account.verify(req.headers.authorization as string);

    if (res.status !== 200) {
      return { auth: false };
    }

    return { auth: true, user: res.payload.data };
  },
});
