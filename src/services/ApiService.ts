import client from "./AxiosClient";

export class ApiService {

  public async getUsers() {  
    return client.get("/users")
      .then(res => res.data)
      .catch(err => console.log(err));
  }
}