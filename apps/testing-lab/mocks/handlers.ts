import { http, HttpResponse, delay } from "msw";

// Types for our mock data
export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

// Mock data
export const mockUsers: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "user" },
];

export const mockPosts: Post[] = [
  { id: 1, title: "First Post", body: "This is the first post", userId: 1 },
  { id: 2, title: "Second Post", body: "This is the second post", userId: 1 },
  { id: 3, title: "Third Post", body: "This is the third post", userId: 2 },
];

export const mockTodos: Todo[] = [
  { id: 1, title: "Learn Vitest", completed: true, userId: 1 },
  { id: 2, title: "Write tests", completed: false, userId: 1 },
  { id: 3, title: "Setup MSW", completed: true, userId: 2 },
];

// Request handlers
export const handlers = [
  // GET /api/users
  http.get("/api/users", async () => {
    await delay(100);
    return HttpResponse.json(mockUsers);
  }),

  // GET /api/users/:id
  http.get("/api/users/:id", async ({ params }) => {
    await delay(100);
    const user = mockUsers.find((u) => u.id === Number(params.id));
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(user);
  }),

  // POST /api/users
  http.post("/api/users", async ({ request }) => {
    await delay(100);
    const body = (await request.json()) as Partial<User>;
    const newUser: User = {
      id: mockUsers.length + 1,
      name: body.name || "",
      email: body.email || "",
      role: body.role || "user",
    };
    return HttpResponse.json(newUser, { status: 201 });
  }),

  // GET /api/posts
  http.get("/api/posts", async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (userId) {
      const filtered = mockPosts.filter((p) => p.userId === Number(userId));
      return HttpResponse.json(filtered);
    }
    return HttpResponse.json(mockPosts);
  }),

  // GET /api/todos
  http.get("/api/todos", async () => {
    await delay(100);
    return HttpResponse.json(mockTodos);
  }),

  // PATCH /api/todos/:id
  http.patch("/api/todos/:id", async ({ params, request }) => {
    await delay(100);
    const body = (await request.json()) as Partial<Todo>;
    const todo = mockTodos.find((t) => t.id === Number(params.id));
    if (!todo) {
      return new HttpResponse(null, { status: 404 });
    }
    const updated = { ...todo, ...body };
    return HttpResponse.json(updated);
  }),

  // Error endpoint for testing error handling
  http.get("/api/error", async () => {
    await delay(100);
    return HttpResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }),

  // Slow endpoint for testing loading states
  http.get("/api/slow", async () => {
    await delay(2000);
    return HttpResponse.json({ message: "This was slow!" });
  }),
];
