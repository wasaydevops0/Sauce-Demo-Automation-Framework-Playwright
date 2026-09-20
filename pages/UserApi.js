class UserApi {
  constructor(request) {
    this.request = request;
    this.baseURL = 'https://api-testing-postman.vercel.app/api/v1/users';
  }

  async login(data) {
    const response = await this.request.post(`${this.baseURL}/login`, { data });
    return response;
  }

  async register(data) {
    const response = await this.request.post(`${this.baseURL}/register`, { data });
    return response;
  }

  async getCurrentUser(token) {
    const response = await this.request.get(`${this.baseURL}/current-user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  }

  async deleteAccount(token) {
    const response = await this.request.delete(`${this.baseURL}/delete-account`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  }

  async logout(token) {
    const response = await this.request.post(`${this.baseURL}/logout`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  }

  async changePassword(data, token) {
    const response = await this.request.post(`${this.baseURL}/change-password`, {
      data,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  }

  async updateAccount(data, token) {
    const response = await this.request.patch(`${this.baseURL}/update-account`, {
      data,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  }

  async replaceAccount(data, token) {
    const response = await this.request.put(`${this.baseURL}/replace-account`, {
      data,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  }

  async getAllUsers() {
    const response = await this.request.get(`${this.baseURL}/all-users`);
    return response;
  }

  async getUserByUsername(username) {
    const response = await this.request.get(`${this.baseURL}/user/${username}`);
    return response;
  }
}

export { UserApi };
