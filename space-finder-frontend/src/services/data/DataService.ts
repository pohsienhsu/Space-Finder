import { AuthService } from "../auth/AuthService";

export class DataService {

  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public async createSpace(name: string, location:string, photo?: File) {
    const credentials = await this.authService.getTemporaryCredentials();
    console.log(credentials);
    console.log(name, location, photo);
    return '123';
  }

  public isAuthorized() {
    return true;
  }
}