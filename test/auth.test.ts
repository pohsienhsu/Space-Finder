import { AuthService } from "./AuthService";

async function testAuth() {
  const service = new AuthService();
  const loginResult = await service.login(
    process.env.USERNAME,
    process.env.PASSWORD
  )
  console.log(loginResult.getSignInUserSession().getIdToken().getJwtToken());
}

testAuth();