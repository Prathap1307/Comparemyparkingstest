import { describe, expect, it } from "vitest";
import { canTransitionStatus } from "@/lib/rbac";

describe("booking status transitions", () => {
  it("allows forward transitions", () => {
    expect(canTransitionStatus("new", "confirmed")).toBe(true);
    expect(canTransitionStatus("confirmed", "checked_in")).toBe(true);
  });

  it("blocks backwards transitions", () => {
    expect(canTransitionStatus("parked", "new")).toBe(false);
  });

  it("allows cancellation at any point", () => {
    expect(canTransitionStatus("checked_in", "cancelled")).toBe(true);
  });
});
