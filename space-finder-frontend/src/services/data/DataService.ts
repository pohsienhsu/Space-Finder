
export class DataService {
  public async createSpace(name: string, location:string, photo?: File) {
    console.log(name);
    console.log(location);
    console.log(photo);
    return '123';
  }

  public isAuthorized() {
    return true;
  }
}