import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/auth/auth-service';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { CanDeactivateComponent } from 'src/app/guards/leave-page.guard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { EmailMatchValidator, emailMatchValidator } from '../validators/email-match.validator';
import Swal from "sweetalert2";
import { passwordMatchingValidator } from '../validators/password-confirm.validator';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterLink,
    EmailMatchValidator
  ],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit, CanDeactivateComponent {
  icons = { faGoogle, faFacebook }

  //Values to initialize
  newUser: User;
  //Variables utilities
  saved = false;
  editing = false;
  imageSelected = false;
  previewImage = '';

  // FORM OBJECT
  registerForm!: FormGroup;
  // CONTROL OBJECTS
  nameControl!: FormControl<string>;
  emailControl!: FormControl<string>;
  emailRepControl!: FormControl<string>;
  passwordControl!: FormControl<string>;
  avatarControl!: FormControl<string>;
  latControl!: FormControl<number>;
  lngControl!: FormControl<number>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.newUser = this.resetUser();

  }

  ngOnInit(): void {

    // ADD VALIDATORS TO EACH CONTROL ELEMENT
    this.nameControl = <FormControl<string>>this.fb.control('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z][a-zA-Z ]*$'),
      Validators.minLength(3),
    ]);
    this.emailControl = <FormControl<string>>this.fb.control('', [
      Validators.required,
      Validators.email,
    ]);
    this.emailRepControl = <FormControl<string>>this.fb.control('', [
      Validators.required,
      Validators.email,
    ]);
    this.passwordControl = <FormControl<string>>this.fb.control('', [
      Validators.required,
      Validators.minLength(4),
    ]);
    this.avatarControl = <FormControl<string>>this.fb.control('', [Validators.required,]);
    this.latControl = <FormControl<number>>this.fb.control(0, [Validators.required,]);
    this.lngControl = <FormControl<number>>this.fb.control(0, [Validators.required,]);

    //BUILD FORM
    this.registerForm = this.fb.group({
      name: this.nameControl,
      email: this.emailControl,
      emailRep: this.emailRepControl,
      password: this.passwordControl,
      avatar: this.avatarControl,
      lat: this.latControl,
      lng: this.lngControl,
    }
      /*, { validators:
        emailMatchValidator,
        //passwordMatchingValidator
      }*/
    );

    //GET USER LOCATION
    navigator.geolocation.getCurrentPosition((position) => {
      this.registerForm.patchValue({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });


    this.route.data.subscribe((data: { [x: string]: User; }) => {
      if (data['user']) {
        this.editing = true;
        this.newUser = data['user'];

        // LOAD RESTAURANT VALUES IN EACH INPUT ELEMENT
        this.registerForm.patchValue({
          name: this.newUser.name,
          email: this.newUser.email,
          avatar: this.newUser.avatar,
          password: this.newUser.password,
          lat: this.newUser.lat,
          lng: this.newUser.lng,
        });
      } else {
        this.editing = false;
        this.resetRegisterForm();
      }
    });
  }

  registerNewUser() {

    if (this.registerForm.invalid) {
      return;
    }
    this.newUser.name = this.nameControl.value;
    this.newUser.email = this.emailControl.value;
    this.newUser.lat = this.latControl.value;
    this.newUser.lng = this.lngControl.value;
    this.newUser.password = this.passwordControl.value;

    console.table(this.newUser);


    this.authService.register(
      this.newUser
      )
      .subscribe((result) => {
        this.saved = true
        Swal.fire({
          title: 'Welcome to our platform!',
          text: 'We are excited that you have joined us.',
          icon: 'success',
          confirmButtonText: 'Continue'
        });


        this.router.navigate(['/restaurants']);
      }, (error: Error) => {
        console.error(error);
      });
  }


  changeImage(fileInput: HTMLInputElement) {

    if (!fileInput.files || fileInput.files.length === 0) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', (e) => {
      this.newUser.avatar = reader.result as string;
      this.previewImage = reader.result as string;
    });
    console.log(reader.result);

  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.registerForm.patchValue({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  // METHOD TO PREVENT LEAVING THE PAGE WHILE WRITING
  async canDeactivate(): Promise<boolean> {
    if (this.saved || this.registerForm.pristine) {
      return true;
    }
    const result = await Swal.fire({
      title: 'Do you really want to leave the page?',
      text: 'Your data will be lost',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Login!',
      cancelButtonText: 'No, keep it'
    });

    return result.isConfirmed;
  }

  validClasses(control: FormControl | FormArray | FormGroup, validClass: string, errorClass: string) {
    return {
      [validClass]: control.touched && control.valid,
      [errorClass]: control.touched && control.invalid,
    };
  }
  resetUser(): User {
    return {
      name: '',
      email: '',
      avatar: '',
      password: '',
      lat: 0,
      lng: 0,
    };
  }
  resetRegisterForm() {
    this.registerForm.reset();
  }

}
