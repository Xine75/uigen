import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

test("shows 'Created filename' for str_replace_editor create with result state", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "result",
        result: "Success",
        args: { command: "create", path: "/components/App.tsx" },
      }}
    />
  );

  expect(screen.getByText("Created App.tsx")).toBeDefined();
});

test("shows 'Edited filename' for str_replace_editor str_replace with result state", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "2",
        toolName: "str_replace_editor",
        state: "result",
        result: "Success",
        args: { command: "str_replace", path: "/src/styles.css" },
      }}
    />
  );

  expect(screen.getByText("Edited styles.css")).toBeDefined();
});

test("shows 'Creating filename' with spinner for in-progress create", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "3",
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "create", path: "/components/App.tsx" },
      }}
    />
  );

  expect(screen.getByText("Creating App.tsx")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("shows 'Renamed filename' for file_manager rename", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "4",
        toolName: "file_manager",
        state: "result",
        result: "Success",
        args: { command: "rename", path: "/old-name.tsx" },
      }}
    />
  );

  expect(screen.getByText("Renamed old-name.tsx")).toBeDefined();
});

test("shows 'Deleted filename' for file_manager delete", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "5",
        toolName: "file_manager",
        state: "result",
        result: "Success",
        args: { command: "delete", path: "/components/OldComponent.tsx" },
      }}
    />
  );

  expect(screen.getByText("Deleted OldComponent.tsx")).toBeDefined();
});

test("falls back to raw tool name for unknown tool", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "6",
        toolName: "unknown_tool",
        state: "result",
        result: "Success",
        args: {},
      }}
    />
  );

  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("extracts filename from full path", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "7",
        toolName: "str_replace_editor",
        state: "result",
        result: "Success",
        args: { command: "create", path: "/deeply/nested/dir/Component.tsx" },
      }}
    />
  );

  expect(screen.getByText("Created Component.tsx")).toBeDefined();
});

test("shows 'Edited filename' for insert command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "8",
        toolName: "str_replace_editor",
        state: "result",
        result: "Success",
        args: { command: "insert", path: "/index.tsx" },
      }}
    />
  );

  expect(screen.getByText("Edited index.tsx")).toBeDefined();
});

test("shows 'Viewed filename' for view command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "9",
        toolName: "str_replace_editor",
        state: "result",
        result: "Success",
        args: { command: "view", path: "/README.md" },
      }}
    />
  );

  expect(screen.getByText("Viewed README.md")).toBeDefined();
});

test("shows 'Reverted filename' for undo_edit command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "10",
        toolName: "str_replace_editor",
        state: "result",
        result: "Success",
        args: { command: "undo_edit", path: "/App.tsx" },
      }}
    />
  );

  expect(screen.getByText("Reverted App.tsx")).toBeDefined();
});
