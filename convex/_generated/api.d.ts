/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activityLogs_queries from "../activityLogs/queries.js";
import type * as comments_mutation from "../comments/mutation.js";
import type * as comments_queries from "../comments/queries.js";
import type * as http from "../http.js";
import type * as lib_activityLogs from "../lib/activityLogs.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_permissions from "../lib/permissions.js";
import type * as memberships_mutations from "../memberships/mutations.js";
import type * as organizations_mutations from "../organizations/mutations.js";
import type * as organizations_queries from "../organizations/queries.js";
import type * as projects_mutations from "../projects/mutations.js";
import type * as projects_queries from "../projects/queries.js";
import type * as tasks_mutations from "../tasks/mutations.js";
import type * as tasks_queries from "../tasks/queries.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";
import type * as webhooks_clerk from "../webhooks/clerk.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "activityLogs/queries": typeof activityLogs_queries;
  "comments/mutation": typeof comments_mutation;
  "comments/queries": typeof comments_queries;
  http: typeof http;
  "lib/activityLogs": typeof lib_activityLogs;
  "lib/auth": typeof lib_auth;
  "lib/permissions": typeof lib_permissions;
  "memberships/mutations": typeof memberships_mutations;
  "organizations/mutations": typeof organizations_mutations;
  "organizations/queries": typeof organizations_queries;
  "projects/mutations": typeof projects_mutations;
  "projects/queries": typeof projects_queries;
  "tasks/mutations": typeof tasks_mutations;
  "tasks/queries": typeof tasks_queries;
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
