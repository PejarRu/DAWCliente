
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/auth-service';
import { User } from 'src/app/interfaces/user';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnInit {
  //User
  user!: User;
  //Form
  profileForm!: FormGroup;
  avatarForm!: FormGroup;
  passwordForm!: FormGroup;
  //Controls
  newNameControl!: FormControl<string>;
  newEmailControl!: FormControl<string>;
  newPasswordControl!: FormControl<string>;
  repPasswordControl!: FormControl<string>;
  newAvatarControl!: FormControl<string>;
  //Extra
  previewImage: string = '';

  constructor(
    private readonly authService: AuthService,
    private router: Router,
    private fb: NonNullableFormBuilder,) { }

  ngOnInit() {
    this.getUserData();
    this.createFormControls();
    this.createForms();
  }

  getUserData() {
    this.authService.getProfile().subscribe(
      user => {
        this.user = user
        console.log('Current data: ');
        console.table(user);
      },
      error => {
        console.log(error);
      }
    );
  }

  createFormControls() {
    this.newNameControl = <FormControl<string>>this.fb.control('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z][a-zA-Z ]*$'),
      Validators.minLength(3),
    ]);
    this.newEmailControl = <FormControl<string>>this.fb.control('', [
      Validators.required,
      Validators.email,
    ]);

    this.newAvatarControl = <FormControl<string>>this.fb.control('', [Validators.required,]);
    this.newPasswordControl = <FormControl<string>>this.fb.control('', [
      Validators.required,
      Validators.minLength(4),
    ]);
    this.repPasswordControl = <FormControl<string>>this.fb.control('', [
      Validators.required,
      Validators.minLength(4),
    ]);

  }

  private createForms(): void {
    this.avatarForm = this.fb.group({
      newAvatar: this.newAvatarControl,
    });
    this.profileForm = this.fb.group({
      newEmail: this.newEmailControl,
      newName: this.newNameControl,
    });
    this.passwordForm = this.fb.group({
      newPassword: this.newPasswordControl,
      repPassword: this.repPasswordControl,
    });
  }

  onSubmitProfile() {
    if (this.profileForm.invalid) {
      return
    }
    this.user.name = this.newNameControl.value;
    this.user.email = this.newEmailControl.value;
    this.authService.updateProfile(this.user.email, this.user.name)
      .subscribe(
        result => {
          console.log('Profile Edited');
          this.router.navigate(['/users/me']);

        },
        error => {
          console.log(error);
        }
      );
  }

  onSubmitPassword() {
    if (this.passwordForm.invalid) {
      return
    }
    if (this.newPasswordControl.value !== this.repPasswordControl.value) {
      Swal.fire(
        'Passwords dont match',
        'Both password must match',
        'error'
      );
      return
    }
    this.user.password = this.newPasswordControl.value;
    this.authService.updatePassword(this.user.password)
      .subscribe(
        result => {
          console.log('Password Edited');

          Swal.fire(
            'Password changed',
            'Dont forget to note your password',
            'success'
          );
          this.passwordForm.reset();
        },
        error => {
          console.log(error);
        }
      );
  }

  onSubmitAvatar() {
    if (this.avatarForm.invalid) {
      return
    }
    if (!this.avatarForm.touched) {
      return
    }

    const isBase64 = this.user.avatar.startsWith('data:image/');
    if (!isBase64) {
      console.log('The selected image is not in base64 format');
      Swal.fire(
        'Error ocurred',
        'The selected image have not been passed to base64 format',
        'error'
      );

      return;
    }

    this.authService.updateAvatar(this.user.avatar)
      .subscribe(
        result => {
          console.log('Password Edited');
          Swal.fire(
            'Image Edited',
            'You have just changed your avatar image',
            'success'
          );
          this.router.navigate(['/users/me']);

        },
        error => {
          console.log(error);
        }
      );
  }




  changeImage(fileInput: HTMLInputElement) {

    if (!fileInput.files || fileInput.files.length === 0) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', (e) => {
      this.user.avatar = reader.result as string;
      this.previewImage = reader.result as string;
    });

  }

}
