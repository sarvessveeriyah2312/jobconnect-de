import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '../../core/services/profile.service';
import { CustomMultiStepProgressBarComponent } from '../../core/components/custom-multistepprogressbar/custom-multistepprogressbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, CustomMultiStepProgressBarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  profile = this.profileService.getProfile();
  loading = this.profileService.isLoading();

  stepLabels = ['profile.step1', 'profile.step2', 'profile.step3'];

  fullName = '';
  email = '';
  address = '';
  city = '';
  country = '';
  phoneNumber = '';
  dateOfBirth = '';
  profileImageBase64 = '';

  saveSuccess = signal(false);
  uploadProgress = signal<number>(0);

  currentStep = 1;
  totalSteps = 3;

  constructor(private profileService: ProfileService) {
    this.profileService.fetchProfile();

    effect(() => {
      const data = this.profile();
      if (data) {
        this.fullName = data.fullName || '';
        this.email = data.email || '';
        this.address = data.address || '';
        this.city = data.city || '';
        this.country = data.country || '';
        this.phoneNumber = data.phoneNumber || '';
        this.dateOfBirth = data.dateOfBirth || '';
        this.profileImageBase64 = data.profileImageBase64 || '';
      }
    });
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  async onSave() {
    console.log('Save button clicked');

    this.uploadProgress.set(10);

    const cleanBase64 = this.profileImageBase64?.includes(',')
      ? this.profileImageBase64.split(',')[1]
      : this.profileImageBase64;

    const payload = {
      fullName: this.fullName,
      address: this.address,
      city: this.city,
      country: this.country,
      phoneNumber: this.phoneNumber,
      dateOfBirth: this.dateOfBirth,
      profileImageBase64: cleanBase64
    };

    console.log('Payload to send:', payload);

    const success = await this.profileService.saveProfile(payload);
    console.log('Save response:', success);

    if (success) {
      this.uploadProgress.set(100);
      setTimeout(() => this.uploadProgress.set(0), 1000);
      this.saveSuccess.set(true);
      setTimeout(() => this.saveSuccess.set(false), 3000);
    } else {
      console.error('Save failed - check backend response or logs');
      alert('Profile save failed. Check console for details.');
    }
  }

  async onImageUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Result = reader.result as string;
      const cleanBase64 = base64Result.split(',')[1];
      this.profileImageBase64 = `data:image/png;base64,${cleanBase64}`;

      this.uploadProgress.set(30);
      this.uploadProgress.set(100);
      setTimeout(() => this.uploadProgress.set(0), 1000);

      console.log('Image uploaded and preview updated.');
    };
    reader.readAsDataURL(file);
  }

  get profileImage() {
    return this.profileImageBase64
      ? this.profileImageBase64
      : 'assets/images/default-avatar.png';
  }
}
