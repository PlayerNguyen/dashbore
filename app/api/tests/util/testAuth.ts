import AuthService from "@/services/auth/auth.service";
import TokenService from "@/services/token/token.service";
import TestContext from "tests/test.context.spec";

async function login() {
  const user = await AuthService.login("dashbore@test.com", "dashbore");
  const token = await TokenService.generateToken(user);
  TestContext.getTestContext().setToken(token);
}

const TestAuthUtil = {
  login,
};

export default TestAuthUtil;
