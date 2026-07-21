export class ApiClient {
  static async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');

    const headers = new Headers(options.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let message = `Error ${response.status}: ${response.statusText}`;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await response.json();
          message = errorData.message || errorData.error || message;
        } catch (e) {
          // Fallback to default message
        }
      } else {
        try {
          const text = await response.text();
          console.error("Non-JSON error response:", text);
          message = `Server error (${response.status}). See console for details.`;
        } catch (e) {
          // Fallback
        }
      }
      throw new Error(message);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  static get(endpoint: string, params?: Record<string, string>) {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    return this.request(url, { method: 'GET' });
  }

  static post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}
