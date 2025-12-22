import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Create the server instance with request handlers
export const server = setupServer(...handlers);
