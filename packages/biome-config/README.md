# Ultrasight and Biome: A Powerful Linting and Formatting Toolchain

## 🚀 Introduction and Setup
- Ultrasight offers a zero-config setup for Biome, a fast Rust-based linter and formatter replacing ESLint and Prettier.
- Setup requires just one command (e.g., `npx ultrasight init`), launching a wizard to configure package managers, editors, AI assistants, and pre-commit hooks.
- Supports editors like VS Code, Cursor, and Zed, configuring them to use Biome for formatting on save and paste.
- Automatically installs necessary dependencies and creates config files, ensuring seamless integration without altering global editor settings.

## ⚡ Performance and Core Features
- Biome powers Ultrasight with blazing-fast linting and formatting, reportedly up to 35 times faster than Prettier.
- Provides all standard linting features: error highlighting, quick fixes, auto-format on save, and CLI commands for linting and formatting.
- Ultrasight CLI is a wrapper around Biome commands, simplifying usage with commands like `npx ultrasight lint` and `npx ultrasight format`.

## 🤖 AI Integration
- Ultrasight generates AI-friendly rule files during setup, guiding AI assistants (e.g., Claude, Cursor) to produce code adhering to project standards.
- This reduces post-generation fixes by ensuring AI writes cleaner, compliant code upfront.
- Supports multiple AI assistants by generating different markdown rule files, though standardization among AI tools is lacking.

## 🔧 Extensibility and Collaboration
- Comes with built-in scaffolding to configure popular pre-commit hooks such as Husky, lint-staged, and Lefthook.
- Automates hook setup to enforce formatting and linting on commit, improving code quality without manual intervention.
- Encourages customizing rules via Biome’s config, with Ultrasight providing a highly opinionated default rule set for TypeScript, React, Next.js, Node, and accessibility.

## 📡 MCP Server and Rule Accessibility
- Ultrasight includes an MCP server allowing AI assistants to access linting and formatting rules dynamically during chats.
- This integration enables AI tools to understand and apply project-specific standards without manual rule copying.
- Enhances AI-assisted coding experiences, ensuring consistent adherence to coding guidelines across environments.

# Structured Mind Map Outline

## 🚀 Introduction and Setup
- Zero-config setup with a single command
- Editor support and configuration (VS Code, Cursor, Zed)
- Dependency installation and config file creation
- Non-intrusive; does not modify global editor settings

## ⚡ Performance and Core Features
- Biome: Rust-based, extremely fast linter and formatter
- Standard linting and formatting features in VS Code
- CLI wrapper commands for ease of use
- Auto-format and lint on save and paste

## 🤖 AI Integration
- AI-friendly rule files generated during setup
- Supports multiple AI assistants (Claude, Cursor)
- Reduces AI-generated code errors and fixes
- Calls for standardization of AI markdown rule files

## 🔧 Extensibility and Collaboration
- Pre-commit hooks integration (Husky, lint-staged, Lefthook)
- Automated hook setup for enforcing code quality
- Highly opinionated default ruleset (TypeScript, React, Next.js, Node, accessibility)
- Customizable config for personal or team preferences

## 📡 MCP Server and Rule Accessibility
- MCP server exposes rules to AI assistants in real-time
- Enables AI tools to follow project rules during code generation
- Removes need for manual rule copying into AI chats
- Improves consistency and coding standards adherence