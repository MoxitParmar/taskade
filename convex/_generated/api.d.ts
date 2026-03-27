/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _dashboard_queries from "../_dashboard/queries.js";
import type * as _project_id_queries from "../_project_id/queries.js";
import type * as _projects_queries from "../_projects/queries.js";
import type * as _settings_queries from "../_settings/queries.js";
import type * as _sidebar_queries from "../_sidebar/queries.js";
import type * as activityLogs_models from "../activityLogs/models.js";
import type * as activityLogs_queries from "../activityLogs/queries.js";
import type * as comments_models from "../comments/models.js";
import type * as comments_mutation from "../comments/mutation.js";
import type * as comments_queries from "../comments/queries.js";
import type * as http from "../http.js";
import type * as lib_activityLogs from "../lib/activityLogs.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_paginateOrTake from "../lib/paginateOrTake.js";
import type * as lib_permissions from "../lib/permissions.js";
import type * as memberships_models from "../memberships/models.js";
import type * as memberships_mutations from "../memberships/mutations.js";
import type * as memberships_queries from "../memberships/queries.js";
import type * as organizations_models from "../organizations/models.js";
import type * as organizations_mutations from "../organizations/mutations.js";
import type * as organizations_queries from "../organizations/queries.js";
import type * as projects_models from "../projects/models.js";
import type * as projects_mutations from "../projects/mutations.js";
import type * as projects_queries from "../projects/queries.js";
import type * as tasks_models from "../tasks/models.js";
import type * as tasks_mutations from "../tasks/mutations.js";
import type * as tasks_queries from "../tasks/queries.js";
import type * as users_models from "../users/models.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";
import type * as webhooks_clerk from "../webhooks/clerk.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "_dashboard/queries": typeof _dashboard_queries;
  "_project_id/queries": typeof _project_id_queries;
  "_projects/queries": typeof _projects_queries;
  "_settings/queries": typeof _settings_queries;
  "_sidebar/queries": typeof _sidebar_queries;
  "activityLogs/models": typeof activityLogs_models;
  "activityLogs/queries": typeof activityLogs_queries;
  "comments/models": typeof comments_models;
  "comments/mutation": typeof comments_mutation;
  "comments/queries": typeof comments_queries;
  http: typeof http;
  "lib/activityLogs": typeof lib_activityLogs;
  "lib/auth": typeof lib_auth;
  "lib/paginateOrTake": typeof lib_paginateOrTake;
  "lib/permissions": typeof lib_permissions;
  "memberships/models": typeof memberships_models;
  "memberships/mutations": typeof memberships_mutations;
  "memberships/queries": typeof memberships_queries;
  "organizations/models": typeof organizations_models;
  "organizations/mutations": typeof organizations_mutations;
  "organizations/queries": typeof organizations_queries;
  "projects/models": typeof projects_models;
  "projects/mutations": typeof projects_mutations;
  "projects/queries": typeof projects_queries;
  "tasks/models": typeof tasks_models;
  "tasks/mutations": typeof tasks_mutations;
  "tasks/queries": typeof tasks_queries;
  "users/models": typeof users_models;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
  "webhooks/clerk": typeof webhooks_clerk;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
