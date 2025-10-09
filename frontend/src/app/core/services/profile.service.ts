import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  id?: string;
  fullName: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  profileImageBase64?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;
  private profile = signal<UserProfile | null>(null);
  private loading = signal<boolean>(false);

  constructor() {}

  getProfile() {
    return this.profile.asReadonly();
  }

  isLoading() {
    return this.loading.asReadonly();
  }

  // --- Retrieve token and user info from localStorage ---
  private getAuthHeaders(): HeadersInit | null {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No token found in localStorage.');
      return null;
    }

    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  private getCurrentUser(): any {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!user || !user.userId) {
        console.error('❌ No userId found in localStorage.currentUser.');
        return null;
      }
      return user;
    } catch {
      console.error('❌ Failed to parse currentUser from localStorage.');
      return null;
    }
  }

  // --- GET PROFILE ---
  async fetchProfile(): Promise<UserProfile | null> {
    const user = this.getCurrentUser();
    const headers = this.getAuthHeaders();

    if (!user || !headers) {
      console.warn('⚠ Missing user or token, cannot fetch profile.');
      return null;
    }

    const url = `${this.apiUrl}/users/${user.userId}/profile`;
    console.log('Fetching profile from:', url);

    this.loading.set(true);
    try {
      const response = await fetch(url, { headers });
      console.log('Response status:', response.status);

      if (!response.ok) {
        console.error('Failed to fetch profile:', response.status);
        return null;
      }

      const data = await response.json();
      console.log('Fetched profile data:', data);
      this.profile.set(data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  // --- SAVE / UPDATE PROFILE ---
  async saveProfile(updates: Partial<UserProfile>): Promise<boolean> {
    const user = this.getCurrentUser();
    const headers = this.getAuthHeaders();

    if (!user || !headers) {
      console.warn('⚠ Missing user or token, cannot save profile.');
      return false;
    }

    const url = `${this.apiUrl}/users/${user.userId}/profile`;
    console.log('Sending profile update to:', url);
    console.log('Payload:', updates);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(updates)
      });

      console.log('Response status:', response.status);

      let responseBody: any = null;
      try {
        responseBody = await response.json();
      } catch {
        console.warn('Response body is not valid JSON');
      }

      console.log('Response body:', responseBody);

      if (!response.ok) {
        console.error('Profile save failed:', response.status, responseBody);
        return false;
      }

      this.profile.set(responseBody);
      console.log('✅ Profile successfully saved.');
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      return false;
    }
  }

  // --- UPLOAD PROFILE PICTURE (BASE64) ---
  async uploadProfilePictureBase64(base64Image: string): Promise<boolean> {
    const user = this.getCurrentUser();
    const headers = this.getAuthHeaders();

    if (!user || !headers) {
      console.warn('⚠ Missing user or token, cannot upload picture.');
      return false;
    }

    const url = `${this.apiUrl}/users/${user.userId}/profile/upload-picture-base64`;
    console.log('Uploading Base64 profile picture to:', url);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(base64Image)
      });

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        console.error('Profile picture upload failed:', response.status);
        return false;
      }

      const updated = await response.json();
      console.log('Uploaded profile picture response:', updated);
      this.profile.set(updated);
      return true;
    } catch (error) {
      console.error('Error uploading Base64 profile picture:', error);
      return false;
    }
  }

  // --- HELPER: Return image URL for display ---
  getProfileImageUrl(): string {
    const profile = this.profile();
    if (profile?.profileImageBase64) {
      return `data:image/jpeg;base64,${profile.profileImageBase64}`;
    }
    return 'assets/images/default-avatar.png';
  }
}
