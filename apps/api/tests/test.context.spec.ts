/**
 * @description Test context class
 */
class TestContext {
  private token: string | null = null;

  public getToken(): string | null {
    return this.token;
  }
  public setToken(token: string): void {
    this.token = token;
  }
  public clearToken(): void {
    this.token = null;
  }
}

let testContext: TestContext;
function getTestContext() {
  if (!testContext) {
    testContext = new TestContext();
  }

  return testContext;
}
export default { getTestContext };
