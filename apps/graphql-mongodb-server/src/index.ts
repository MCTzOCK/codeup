/**
 * apps/graphql-mongodb-server/src/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.10.2024
 *
 */

import { config } from "dotenv";
import { ApolloServer } from "apollo-server";
import { schemaComposer } from "graphql-compose";
import { composeMongoose } from "graphql-compose-mongoose";
import AnalyticsModel from "@codeup/util/dist/models/AnalyticsModel";
import BlogModel from "@codeup/util/dist/models/BlogModel";
import Certificate from "@codeup/util/dist/models/Certificate";
import CodeChallengeModel from "@codeup/util/dist/models/CodeChallengeModel";
import CodeSnippet from "@codeup/util/dist/models/CodeSnippet";
import CodeUpKidsProjectModel from "@codeup/util/dist/models/CodeUpKidsProjectModel";
import ContactModel from "@codeup/util/dist/models/ContactModel";
import ContentModel from "@codeup/util/dist/models/ContentModel";
import CourseEnrollment from "@codeup/util/dist/models/CourseEnrollment";
import CourseModel from "@codeup/util/dist/models/CourseModel";
import CourseProgressModel from "@codeup/util/dist/models/CourseProgressModel";
import CourseSectionProgressModel from "@codeup/util/dist/models/CourseSectionProgressModel";
import CustomerChoiceModel from "@codeup/util/dist/models/CustomerChoiceModel";
import EditorProjectFunctionModel from "@codeup/util/dist/models/EditorProjectFunctionModel";
import EditorProjectKVStorageModel from "@codeup/util/dist/models/EditorProjectKVStorageModel";
import EditorProjectModel from "@codeup/util/dist/models/EditorProjectModel";
import EditorProjectPageModel from "@codeup/util/dist/models/EditorProjectPageModel";
import ErrorModel from "@codeup/util/dist/models/ErrorModel";
import ForumChatModel from "@codeup/util/dist/models/ForumChatModel";
import ForumPostModel from "@codeup/util/dist/models/ForumPostModel";
import ForumProfileModel from "@codeup/util/dist/models/ForumProfileModel";
import IDEProjectModel from "@codeup/util/dist/models/IDEProjectModel";
import IDETemplateModel from "@codeup/util/dist/models/IDETemplateModel";
import InteractiveSectionModel from "@codeup/util/dist/models/InteractiveSectionModel";
import NewsletterModel from "@codeup/util/dist/models/NewsletterModel";
import OAuthApp from "@codeup/util/dist/models/OAuthApp";
import ObtainedCertificateModel from "@codeup/util/dist/models/ObtainedCertificateModel";
import OrgBlogModel from "@codeup/util/dist/models/OrgBlogModel";
import OrgProjectTemplateModel from "@codeup/util/dist/models/OrgProjectTemplateModel";
import ProjectFlowModel from "@codeup/util/dist/models/ProjectFlowModel";
import ProjectI18nModel from "@codeup/util/dist/models/ProjectI18nModel";
import ProjectIdeaModel from "@codeup/util/dist/models/ProjectIdeaModel";
import ProjectIssueModel from "@codeup/util/dist/models/ProjectIssueModel";
import ProjectModel from "@codeup/util/dist/models/ProjectModel";
import ProjectUMLModel from "@codeup/util/dist/models/ProjectUMLModel";
import ProjectWikiPageModel from "@codeup/util/dist/models/ProjectWikiPageModel";
import SessionReplayModel from "@codeup/util/dist/models/SessionReplayModel";
import ShortURLModel from "@codeup/util/dist/models/ShortURLModel";
import TodoListModel from "@codeup/util/dist/models/TodoListModel";
import ToDoListV2ItemModel from "@codeup/util/dist/models/ToDoListV2ItemModel";
import ToDoListV2Model from "@codeup/util/dist/models/ToDoListV2Model";
import ToDoProjectModel from "@codeup/util/dist/models/ToDoProjectModel";
import UserModel from "@codeup/util/dist/models/UserModel";
import UserAIQuotaModel from "@codeup/util/dist/models/UserAIQuotaModel";
import UserDashboardPreferencesModel from "@codeup/util/dist/models/UserDashboardPreferencesModel";
import UserXPModel from "@codeup/util/dist/models/UserXPModel";
import UserAIChatModel from "@codeup/util/dist/models/UserAIChatModel";
import mongoose from "mongoose";
import { GraphQLError } from "graphql/error";
import * as jwt from "jsonwebtoken";

config();

(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Connected to MongoDB");

  const customizationOptions = {};

  const data = {
    Analytics: {
      model: AnalyticsModel,
      tc: composeMongoose(AnalyticsModel, customizationOptions),
      name: "analytics",
    },
    Blog: {
      model: BlogModel,
      tc: composeMongoose(BlogModel, customizationOptions),
      name: "blog",
    },
    Certificate: {
      model: Certificate,
      tc: composeMongoose(Certificate, customizationOptions),
      name: "certificate",
    },
    CodeChallenge: {
      model: CodeChallengeModel,
      tc: composeMongoose(CodeChallengeModel, customizationOptions),
      name: "codeChallenge",
    },
    CodeSnippet: {
      model: CodeSnippet,
      tc: composeMongoose(CodeSnippet, customizationOptions),
      name: "codeSnippet",
    },
    CodeUpKidsProject: {
      model: CodeUpKidsProjectModel,
      tc: composeMongoose(CodeUpKidsProjectModel, customizationOptions),
      name: "codeUpKidsProject",
    },
    Contact: {
      model: ContactModel,
      tc: composeMongoose(ContactModel, customizationOptions),
      name: "contact",
    },
    Content: {
      model: ContentModel,
      tc: composeMongoose(ContentModel, customizationOptions),
      name: "content",
    },
    CourseEnrollment: {
      model: CourseEnrollment,
      tc: composeMongoose(CourseEnrollment, customizationOptions),
      name: "courseEnrollment",
    },
    Course: {
      model: CourseModel,
      tc: composeMongoose(CourseModel, customizationOptions),
      name: "course",
    },
    CourseProgress: {
      model: CourseProgressModel,
      tc: composeMongoose(CourseProgressModel, customizationOptions),
      name: "courseProgress",
    },
    CourseSectionProgress: {
      model: CourseSectionProgressModel,
      tc: composeMongoose(CourseSectionProgressModel, customizationOptions),
      name: "courseSectionProgress",
    },
    CustomerChoice: {
      model: CustomerChoiceModel,
      tc: composeMongoose(CustomerChoiceModel, customizationOptions),
      name: "customerChoice",
    },
    EditorProjectFunction: {
      model: EditorProjectFunctionModel,
      tc: composeMongoose(EditorProjectFunctionModel, customizationOptions),
      name: "editorProjectFunction",
    },
    EditorProjectKVStorage: {
      model: EditorProjectKVStorageModel,
      tc: composeMongoose(EditorProjectKVStorageModel, customizationOptions),
      name: "editorProjectKVStorage",
    },
    EditorProject: {
      model: EditorProjectModel,
      tc: composeMongoose(EditorProjectModel, customizationOptions),
      name: "editorProject",
    },
    EditorProjectPage: {
      model: EditorProjectPageModel,
      tc: composeMongoose(EditorProjectPageModel, customizationOptions),
      name: "editorProjectPage",
    },
    Error: {
      model: ErrorModel,
      tc: composeMongoose(ErrorModel, customizationOptions),
      name: "error",
    },
    ForumChat: {
      model: ForumChatModel,
      tc: composeMongoose(ForumChatModel, customizationOptions),
      name: "forumChat",
    },
    ForumPost: {
      model: ForumPostModel,
      tc: composeMongoose(ForumPostModel, customizationOptions),
      name: "forumPost",
    },
    ForumProfile: {
      model: ForumProfileModel,
      tc: composeMongoose(ForumProfileModel, customizationOptions),
      name: "forumProfile",
    },
    IDEProject: {
      model: IDEProjectModel,
      tc: composeMongoose(IDEProjectModel, customizationOptions),
      name: "ideProject",
    },
    IDETemplate: {
      model: IDETemplateModel,
      tc: composeMongoose(IDETemplateModel, customizationOptions),
      name: "ideTemplate",
    },
    InteractiveSection: {
      model: InteractiveSectionModel,
      tc: composeMongoose(InteractiveSectionModel, customizationOptions),
      name: "interactiveSection",
    },
    Newsletter: {
      model: NewsletterModel,
      tc: composeMongoose(NewsletterModel, customizationOptions),
      name: "newsletter",
    },
    OAuthApp: {
      model: OAuthApp,
      tc: composeMongoose(OAuthApp, customizationOptions),
      name: "oauthApp",
    },
    ObtainedCertificate: {
      model: ObtainedCertificateModel,
      tc: composeMongoose(ObtainedCertificateModel, customizationOptions),
      name: "obtainedCertificate",
    },
    OrgBlog: {
      model: OrgBlogModel,
      tc: composeMongoose(OrgBlogModel, customizationOptions),
      name: "orgBlog",
    },
    OrgProjectTemplate: {
      model: OrgProjectTemplateModel,
      tc: composeMongoose(OrgProjectTemplateModel, customizationOptions),
      name: "orgProjectTemplate",
    },
    ProjectFlow: {
      model: ProjectFlowModel,
      tc: composeMongoose(ProjectFlowModel, customizationOptions),
      name: "projectFlow",
    },
    ProjectI18n: {
      model: ProjectI18nModel,
      tc: composeMongoose(ProjectI18nModel, customizationOptions),
      name: "projectI18n",
    },
    ProjectIdea: {
      model: ProjectIdeaModel,
      tc: composeMongoose(ProjectIdeaModel, customizationOptions),
      name: "projectIdea",
    },
    ProjectIssue: {
      model: ProjectIssueModel,
      tc: composeMongoose(ProjectIssueModel, customizationOptions),
      name: "projectIssue",
    },
    Project: {
      model: ProjectModel,
      tc: composeMongoose(ProjectModel, customizationOptions),
      name: "project",
    },
    ProjectUML: {
      model: ProjectUMLModel,
      tc: composeMongoose(ProjectUMLModel, customizationOptions),
      name: "projectUML",
    },
    ProjectWikiPage: {
      model: ProjectWikiPageModel,
      tc: composeMongoose(ProjectWikiPageModel, customizationOptions),
      name: "projectWikiPage",
    },
    SessionReplay: {
      model: SessionReplayModel,
      tc: composeMongoose(SessionReplayModel, customizationOptions),
      name: "sessionReplay",
    },
    ShortURL: {
      model: ShortURLModel,
      tc: composeMongoose(ShortURLModel, customizationOptions),
      name: "shortURL",
    },
    TodoList: {
      model: TodoListModel,
      tc: composeMongoose(TodoListModel, customizationOptions),
      name: "todoList",
    },
    ToDoListV2Item: {
      model: ToDoListV2ItemModel,
      tc: composeMongoose(ToDoListV2ItemModel, customizationOptions),
      name: "toDoListV2Item",
    },
    ToDoListV2: {
      model: ToDoListV2Model,
      tc: composeMongoose(ToDoListV2Model, customizationOptions),
      name: "toDoListV2",
    },
    ToDoProject: {
      model: ToDoProjectModel,
      tc: composeMongoose(ToDoProjectModel, customizationOptions),
      name: "toDoProject",
    },
    User: {
      model: UserModel,
      tc: composeMongoose(UserModel, customizationOptions),
      name: "user",
    },
    UserAIQuota: {
      model: UserAIQuotaModel,
      tc: composeMongoose(UserAIQuotaModel, customizationOptions),
      name: "userAIQuota",
    },
    UserDashboardPreferences: {
      model: UserDashboardPreferencesModel,
      tc: composeMongoose(UserDashboardPreferencesModel, customizationOptions),
      name: "userDashboardPreferences",
    },
    UserXP: {
      model: UserXPModel,
      tc: composeMongoose(UserXPModel, customizationOptions),
      name: "userXP",
    },
    UserAIChat: {
      model: UserAIChatModel,
      tc: composeMongoose(UserAIChatModel, customizationOptions),
      name: "userAIChat",
    },
  };

  const newFields: any = {};
  const newMutations: any = {};

  for (const key in data) {
    // @ts-ignore
    newFields[key + "ById"] = data[key].tc.mongooseResolvers.findById();
    // @ts-ignore
    newFields[key + "ByIds"] = data[key].tc.mongooseResolvers.findByIds();
    // @ts-ignore
    newFields[key + "One"] = data[key].tc.mongooseResolvers.findOne();
    // @ts-ignore
    newFields[key + "Many"] = data[key].tc.mongooseResolvers.findMany();
    // @ts-ignore
    newFields[key + "Count"] = data[key].tc.mongooseResolvers.count();
    // @ts-ignore
    newFields[key + "Connection"] = data[key].tc.mongooseResolvers.connection();
    // @ts-ignore
    newFields[key + "Pagination"] = data[key].tc.mongooseResolvers.pagination();
    // @ts-ignore
    newMutations[key + "Create"] = data[key].tc.mongooseResolvers.createOne();
    newMutations[key + "UpdateById"] =
      // @ts-ignore
      data[key].tc.mongooseResolvers.updateById();
    newMutations[key + "RemoveById"] =
      // @ts-ignore
      data[key].tc.mongooseResolvers.removeById();
  }

  schemaComposer.Query.addFields(newFields);
  schemaComposer.Mutation.addFields(newMutations);

  const graphqlSchema = schemaComposer.buildSchema();

  const server = new ApolloServer({
    schema: graphqlSchema,
    context: async ({ req }) => {
      const auth_key = req.headers.authorization || "";

      let auth;

      try {
        const v = jwt.verify(auth_key, process.env.JWT_SECRET as string);
        if (v.role === "admin") {
          auth = true;
        }
      } catch (e) {
        auth = false;
      }

      if (!auth) {
        throw new GraphQLError("User not authorized", {
          extensions: {
            code: "UNAUTHORIZED",
            http: { status: 401 },
          },
        });
      }
      return { auth };
    },
  });

  const port = process.env.PORT || 4000;

  server
    .listen(port)
    .then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
})();
