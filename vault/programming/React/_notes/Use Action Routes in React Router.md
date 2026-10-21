---
source: https://sergiodxa.com/tutorials/use-action-routes-in-react-router
fetched: 2026-09-11
status: fresh
---
The "Action Routes" pattern uses React Router's Resource Routes (a route module exporting only a `loader`/`action`, no default component) to centralize a reusable action — create, update, delete — in one file. Reach for it when the same action, with its auth, validation, typed responses and client-side effects (toast, redirect), needs to be triggered from more than one part of the app.

## how
```ts
const [routes, actionRoutes] = await Promise.all([
  flatRoutes({ rootDirectory: "./routes" }),
  flatRoutes({ rootDirectory: "./routes/actions" }),
]);

export default [
  ...routes,
  ...prefix("/actions", actionRoutes),
] satisfies RouteConfig;
```
```ts
export async function action({ request }: Route.ActionArgs) {
  let user = await authenticate(request);
  if (!user) return unauthorized({ message: "You must be logged in..." });
  let result = z.object({ title: z.string(), content: z.string() })
    .safeParse(Object.fromEntries(await request.formData()));
  if (!result.success) return badRequest({ errors: z.treeifyError(result.error) });
  let post = await Post.create({ userId: user.id, ...result.data });
  return created({ message: "Post created successfully", post });
}
export async function clientAction({ serverAction }: Route.ClientActionArgs) {
  let result = await serverAction();
  if (result.status < 300) {
    toast.success(result.message);
    return redirect(href("/posts/:postId", { postId: result.post.id }));
  } else if (result.status >= 400) {
    toast.error(result.message);
  }
  return result;
}
```

## gotchas
- middleware-based authentication only tells you the user is logged in — you still need a separate authorization check (e.g. `hasActiveSubscription`) before returning a 403
