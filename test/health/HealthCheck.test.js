import { request, assert } from "../TestHelper";

describe("GET /health/health-check", () => {
  it("Response body status should be true", async () => {
    const response = await request.get("/health/health-check");

    assert.equal(response.status, 200);
    assert.equal(response.body.status, true);
  });
});
