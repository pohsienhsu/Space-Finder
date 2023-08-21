export class AuthService {
  public async login(username: string, password: string): Promise<Object | undefined> {
    return {
      user: 'pohsu'
    }
  }

  public getUsername() {
    return "the username";
  }
}