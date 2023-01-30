import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Restaurant } from '../interfaces/restaurant';
import {
  ReactiveFormsModule,
  NgForm,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  NonNullableFormBuilder,
} from '@angular/forms';
import { RestaurantsService } from 'src/app/restaurants/services/restaurants.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OneIsCheckedDirective } from 'src/app/shared/validators/one-is-checked.directive';
import { CanDeactivateComponent } from 'src/app/guards/leave-page.guard';
import { PhoneValidatorDirective } from 'src/app/shared/validators/phone-validator.directive';
@Component({
  selector: 'fs-restaurant-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OneIsCheckedDirective,
    PhoneValidatorDirective,
  ],
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css'],
})
export class RestaurantFormComponent implements OnInit, CanDeactivateComponent {
  //Constants
  daysOpen: boolean[] = new Array(7).fill(true);
  readonly days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  @Output() add = new EventEmitter<Restaurant>();

  newRestaurant: Restaurant;
  imageName = '';
  saved = false;
  editing = false;

  //CREATE THE FORM OBJECT
  restaurantForm!: FormGroup;
  // CREATE THE CONTROL OBJECTS
  nameControl!: FormControl<string>;
  descControl!: FormControl<string>;
  phoneControl!: FormControl<number>;
  cuisineControl!: FormControl<string>;
  daysControl!: FormControl<string[]>;
  imageControl!: FormControl<string>;
  constructor(
    // INJECT RestaurantService TO USE ADD
    private readonly restaurantsService: RestaurantsService,
    private route: ActivatedRoute,
    private readonly router: Router,
    private fb: NonNullableFormBuilder
  ) {
    this.newRestaurant = this.resetRestaurant();
  }

  resetRestaurant() {
    return {
      name: '',
      description: '',
      image: '',
      cuisine: '',
      daysOpen: [],
      phone: '',
    };
  }

  changeImage(fileInput: HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', (e) => {
      this.newRestaurant.image = reader.result as string;
    });
  }

  /*
    WHEN FORM IS LOADED IT WILL LOAD THE RESTAURANT INFO AND RESET saved VALUE
  */
  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.saved = false;
    // INITIATE EACH CONTROL
    this.nameControl = this.fb.control('');
    this.descControl = this.fb.control('');
    this.cuisineControl = this.fb.control('');
    this.daysControl = this.fb.control(this.days);
    this.phoneControl = this.fb.control(0);
    this.imageControl = this.fb.control('');

    // SET INITIAL VALUES FOR EACH FORM HTML ELEMENT
    this.restaurantForm = this.fb.group({
      nameForm: this.nameControl,
      descForm: this.descControl,
      cuisineForm: this.cuisineControl,
      daysForm: this.daysControl,
      phoneForm: this.phoneControl,
      imageForm: this.imageControl,
    });

    this.route.data.subscribe((data) => {
      if (data['restaurant']) {
        this.editing = true;
        this.newRestaurant = data['restaurant'];
        this.newRestaurant.daysOpen = this.newRestaurant.daysOpen.slice(0, 10);

        // LOAD RESTAURANT VALUES IN EACH INPUT ELEMENT
        this.restaurantForm.patchValue({
          nameForm: this.newRestaurant.name,
          descForm: this.newRestaurant.description,
          cuisineForm: this.newRestaurant.cuisine,
          priceForm: this.newRestaurant.phone,
          daysForm: this.newRestaurant.daysOpen,
        });
      } else {
        this.editing = false;
        this.resetRestaurant();
      }
    });
  }
  // METHOD TO PREVENT LEAVING THE PAGE WHILE WRITING
  canDeactivate() {
    // IF saved IS FALSE IT WILL TRIGGER A CONFIRM WINDOW
    return (
      this.saved ||
      confirm('Do you want to leave this page?. Changes can be lost')
    );
  }
  addRestaurant() {
    this.newRestaurant.daysOpen = this.daysOpen
      .map((open, i) => (open ? String(i) : ''))
      .filter((day) => day !== '');
    console.log(this.newRestaurant);
    this.restaurantsService.addRestaurant(this.newRestaurant).subscribe({
      next: (response) => {
        this.saved = true;
        this.router.navigate(['/restaurants']);
      },
      error: (error) => console.error(error),
    });
  }

  /* REPLACE NgModel ELEMENT TO USE CONTROLS NOW
  validClasses(ngModel: NgModel, validClass: string, errorClass: string) {
  */
  validClasses(control: FormControl, validClass: string, errorClass: string) {
    return {
      [validClass]: control.touched && control.valid,
      [errorClass]: control.touched && control.invalid,
    };
  }

  /*
    editRestaurant() WILL CALL edit(restaurant) FROM SERVICE
    IT WILL PASS THE LOCAL RESTAURANT VALUES TO THE PUT METHOD
  editRestaurant() {
    this.restaurantsService.editRestaurant(this.newRestaurant).subscribe({
      next: () => {
        this.saved = true; // IF EVERYTHING GOES OK SET SAVED TO TRUE
        this.router.navigate(['/restaurants']); //REDIRECT TO /restaurants
      },
      error: (error) => console.error(error),
    });
  }
  */
}
