const API_BASE = '/api';

class ApiClient {
  private orgId: string | null = null;

  setOrgId(orgId: string | null) {
    this.orgId = orgId;
    if (orgId) {
      localStorage.setItem('rento_current_org', orgId);
    } else {
      localStorage.removeItem('rento_current_org');
    }
  }

  getOrgId(): string | null {
    if (!this.orgId) {
      this.orgId = localStorage.getItem('rento_current_org');
    }
    return this.orgId;
  }

  private async request(path: string, options: RequestInit = {}): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    
    const orgId = this.getOrgId();
    if (orgId) {
      headers['X-Org-Id'] = orgId;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (response.status === 401) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        return this.request(path, options);
      }
      throw new Error('Session expired');
    }

    if (response.status === 403) {
      throw new Error('Permission denied');
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  }

  async refreshToken(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async get<T>(path: string): Promise<T> {
    return this.request(path, { method: 'GET' });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request(path, { method: 'POST', body: JSON.stringify(body) });
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request(path, { method: 'PUT', body: JSON.stringify(body) });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request(path, { method: 'DELETE' });
  }
}

export const api = new ApiClient();