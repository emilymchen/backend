type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type InputTag = "input" | "textarea" | "json";
type Field = InputTag | { [key: string]: Field };
type Fields = Record<string, Field>;

type Operation = {
  name: string;
  endpoint: string;
  method: HttpMethod;
  fields: Fields;
};

/**
 * This list of operations is used to generate the manual testing UI.
 */
const operations: Operation[] = [
  {
    name: "Get Session User (logged in user)",
    endpoint: "/api/session",
    method: "GET",
    fields: {},
  },
  {
    name: "Create User",
    endpoint: "/api/users",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Login",
    endpoint: "/api/login",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Logout",
    endpoint: "/api/logout",
    method: "POST",
    fields: {},
  },
  {
    name: "Update Password",
    endpoint: "/api/users/password",
    method: "PATCH",
    fields: { currentPassword: "input", newPassword: "input" },
  },
  {
    name: "Delete User",
    endpoint: "/api/users",
    method: "DELETE",
    fields: {},
  },
  {
    name: "Get Users (empty for all)",
    endpoint: "/api/users/:username",
    method: "GET",
    fields: { username: "input" },
  },
  {
    name: "Get Posts (empty for all)",
    endpoint: "/api/posts",
    method: "GET",
    fields: { author: "input" },
  },
  {
    name: "Create Post",
    endpoint: "/api/posts",
    method: "POST",
    fields: { content: "input" },
  },
  {
    name: "Update Post",
    endpoint: "/api/posts/:id",
    method: "PATCH",
    fields: { id: "input", content: "input", options: { backgroundColor: "input" } },
  },
  {
    name: "Delete Post",
    endpoint: "/api/posts/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  {
    name: "Get Catalog",
    endpoint: "/api/catalog",
    method: "GET",
    fields: {},
  },
  {
    name: "Add to Catalog",
    endpoint: "/api/catalog",
    method: "POST",
    fields: { name: "input", category: "input", photoUrl: "input" },
  },
  {
    name: "Remove from Catalog",
    endpoint: "/api/catalog/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  {
    name: "Get Favorites",
    endpoint: "/api/favorites",
    method: "GET",
    fields: {},
  },
  {
    name: "Favorite Item",
    endpoint: "/api/favorites/:itemId",
    method: "POST",
    fields: { itemId: "input" },
  },
  {
    name: "Unfavorite Item",
    endpoint: "/api/favorites/:itemId",
    method: "DELETE",
    fields: { itemId: "input" },
  },
  {
    name: "Update Username",
    endpoint: "/api/users/username",
    method: "PATCH",
    fields: { username: "input" },
  },
  {
    name: "Remove Friend",
    endpoint: "/api/friends/:friend",
    method: "DELETE",
    fields: { friend: "input" },
  },
  {
    name: "Get Friend Requests",
    endpoint: "/api/friend/requests",
    method: "GET",
    fields: {},
  },
  {
    name: "Send Friend Request",
    endpoint: "/api/friend/requests/:to",
    method: "POST",
    fields: { to: "input" },
  },
  {
    name: "Remove Friend Request",
    endpoint: "/api/friend/requests/:to",
    method: "DELETE",
    fields: { to: "input" },
  },
  {
    name: "Accept Friend Request",
    endpoint: "/api/friend/accept/:from",
    method: "PUT",
    fields: { from: "input" },
  },
  {
    name: "Reject Friend Request",
    endpoint: "/api/friend/reject/:from",
    method: "PUT",
    fields: { from: "input" },
  },
  {
    name: "Get Labels for Catalog Item",
    endpoint: "/api/catalog/:itemId/labels",
    method: "GET",
    fields: { itemId: "input" },
  },
  {
    name: "Add Label to Catalog Item",
    endpoint: "/api/catalog/:itemId/labels",
    method: "POST",
    fields: { itemId: "input", label: "input" },
  },
  {
    name: "Remove Label from Catalog Item",
    endpoint: "/api/catalog/:itemId/labels/:label",
    method: "DELETE",
    fields: { itemId: "input", label: "input" },
  },
  {
    name: "Get Messages",
    endpoint: "/api/messages",
    method: "GET",
    fields: {},
  },
  {
    name: "Send Message",
    endpoint: "/api/messages",
    method: "POST",
    fields: { recipient: "input", content: "textarea" },
  },
  {
    name: "Get Messages with Recipient",
    endpoint: "/api/messages/:recipient",
    method: "GET",
    fields: { recipient: "input" },
  },
  {
    name: "List an Item for Donation",
    endpoint: "/api/donations/:itemId",
    method: "POST",
    fields: { itemId: "input" },
  },
  {
    name: "Get User Donations",
    endpoint: "/api/donations",
    method: "GET",
    fields: {},
  },
  {
    name: "Remove an Item from Donation List",
    endpoint: "/api/donations/:itemId",
    method: "DELETE",
    fields: { itemId: "input" },
  },
  {
    name: "Update Donation Status (Mark as Donated)",
    endpoint: "/api/donations/:itemId/status",
    method: "PATCH",
    fields: { itemId: "input" },
  },
  {
    name: "Get Donation Status of an Item",
    endpoint: "/api/donations/:itemId",
    method: "GET",
    fields: { itemId: "input" },
  },
  {
    name: "Get User's Previously Donated Items",
    endpoint: "/api/donations/donated",
    method: "GET",
    fields: { itemId: "input" },
  },
];

/*
 * You should not need to edit below.
 * Please ask if you have questions about what this test code is doing!
 */

function updateResponse(code: string, response: string) {
  document.querySelector("#status-code")!.innerHTML = code;
  document.querySelector("#response-text")!.innerHTML = response;
}

async function request(method: HttpMethod, endpoint: string, params?: unknown) {
  try {
    if (method === "GET" && params) {
      endpoint += "?" + new URLSearchParams(params as Record<string, string>).toString();
      params = undefined;
    }

    const res = fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: params ? JSON.stringify(params) : undefined,
    });

    return {
      $statusCode: (await res).status,
      $response: await (await res).json(),
    };
  } catch (e) {
    console.log(e);
    return {
      $statusCode: "???",
      $response: { error: "Something went wrong, check your console log.", details: e },
    };
  }
}

function fieldsToHtml(fields: Record<string, Field>, indent = 0, prefix = ""): string {
  return Object.entries(fields)
    .map(([name, tag]) => {
      const htmlTag = tag === "json" ? "textarea" : tag;
      return `
        <div class="field" style="margin-left: ${indent}px">
          <label>${name}:
          ${typeof tag === "string" ? `<${htmlTag} name="${prefix}${name}"></${htmlTag}>` : fieldsToHtml(tag, indent + 10, prefix + name + ".")}
          </label>
        </div>`;
    })
    .join("");
}

function getHtmlOperations() {
  return operations.map((operation) => {
    return `<li class="operation">
      <h3>${operation.name}</h3>
      <form class="operation-form">
        <input type="hidden" name="$endpoint" value="${operation.endpoint}" />
        <input type="hidden" name="$method" value="${operation.method}" />
        ${fieldsToHtml(operation.fields)}
        <button type="submit">Submit</button>
      </form>
    </li>`;
  });
}

function prefixedRecordIntoObject(record: Record<string, string>) {
  const obj: any = {}; // eslint-disable-line
  for (const [key, value] of Object.entries(record)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    const keys = key.split(".");
    const lastKey = keys.pop()!;
    let currentObj = obj;
    for (const key of keys) {
      if (!currentObj[key]) {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }
    currentObj[lastKey] = value;
  }
  return obj;
}

async function submitEventHandler(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const { $method, $endpoint, ...reqData } = Object.fromEntries(new FormData(form));

  // Replace :param with the actual value.
  const endpoint = ($endpoint as string).replace(/:(\w+)/g, (_, key) => {
    const param = reqData[key] as string;
    delete reqData[key];
    return param;
  });

  const op = operations.find((op) => op.endpoint === $endpoint && op.method === $method);
  const pairs = Object.entries(reqData);
  for (const [key, val] of pairs) {
    if (val === "") {
      delete reqData[key];
      continue;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const type = key.split(".").reduce((obj, key) => obj[key], op?.fields as any);
    if (type === "json") {
      reqData[key] = JSON.parse(val as string);
    }
  }

  const data = prefixedRecordIntoObject(reqData as Record<string, string>);

  updateResponse("", "Loading...");
  const response = await request($method as HttpMethod, endpoint as string, Object.keys(data).length > 0 ? data : undefined);
  updateResponse(response.$statusCode.toString(), JSON.stringify(response.$response, null, 2));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#operations-list")!.innerHTML = getHtmlOperations().join("");
  document.querySelectorAll(".operation-form").forEach((form) => form.addEventListener("submit", submitEventHandler));
});
