import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Restaurant } from '../interfaces/restaurant';
import {
  ReactiveFormsModule,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
  NonNullableFormBuilder,
} from '@angular/forms';
import { RestaurantsService } from 'src/app/restaurants/services/restaurants.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CanDeactivateComponent } from 'src/app/guards/leave-page.guard';
//Custom Validators
import { OneCheckedDirective } from 'src/app/shared/validators/one-is-checked.directive';
import Swal from "sweetalert2";
@Component({
  selector: 'fs-restaurant-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OneCheckedDirective,
  ],
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css'],
})

export class RestaurantFormComponent implements OnInit, CanDeactivateComponent {
  //Constants
  daysOpen: boolean[] = new Array(7).fill(true);
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  /*days = [
    { id: 0, select: false, value: 'Sun' },
    { id: 1, select: true, value: 'Mon' },
    { id: 2, select: true, value: 'Tue' },
    { id: 3, select: true, value: 'Wed' },
    { id: 4, select: true, value: 'Thu' },
    { id: 5, select: true, value: 'Fri' },
    { id: 6, select: true, value: 'Sat' },
  ];*/
  //Emitters
  @Output() add = new EventEmitter<Restaurant>();
  //Values to initialize
  newRestaurant: Restaurant;
  //Variables utilities
  saved = false;
  editing = false;

  // FORM OBJECT
  restaurantForm!: FormGroup;
  daysControl!: FormArray;
  // CONTROL OBJECTS
  nameControl!: FormControl<string>;
  descControl!: FormControl<string>;
  phoneControl!: FormControl<string>;
  cuisineControl!: FormControl<string>;
  imageControl!: FormControl<string>;

  constructor(
    private readonly restaurantsService: RestaurantsService,
    private route: ActivatedRoute,
    private readonly router: Router,
    private fb: NonNullableFormBuilder
  ) {
    this.newRestaurant = this.resetRestaurant();

  }

  ngOnInit(): void {

    // ADD VALIDATORS TO EACH CONTROL ELEMENT
    this.nameControl = this.fb.control('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z][a-zA-Z ]*$'),
    ]);
    this.descControl = this.fb.control('', [
      Validators.required,
    ]);
    this.phoneControl = this.fb.control('', [
      Validators.required,
      Validators.pattern('([+0]?[0-9]{2} ?)?[0-9]{9}')
    ]);
    this.cuisineControl = this.fb.control('', [Validators.required,]);
    this.daysControl = this.fb.array([], [Validators.required,])
    this.imageControl = this.fb.control('', [Validators.required,]);
    this.days.forEach((day) => {
      this.daysControl.push(this.fb.control(false));
    })

    //BUILD FORM
    this.restaurantForm = this.fb.group({
      name: this.nameControl,
      description: this.descControl,
      cuisine: this.cuisineControl,
      phone: this.phoneControl,
      days: this.daysControl,
      image: this.imageControl,
    });


    this.route.data.subscribe((data: { [x: string]: Restaurant; }) => {
      if (data['restaurant']) {
        this.editing = true;
        this.newRestaurant = data['restaurant'];

        // LOAD RESTAURANT VALUES IN EACH INPUT ELEMENT
        this.restaurantForm.patchValue({
          name: this.newRestaurant.name,
          description: this.newRestaurant.description,
          cuisine: this.newRestaurant.cuisine,
          phone: this.newRestaurant.phone,
          days: this.newRestaurant.daysOpen,
          image: this.newRestaurant.image,
        });
      } else {
        this.editing = false;
        this.resetRestaurantForm();
      }
    });
  }

  addRestaurant() {
    if (this.restaurantForm.valid) {
      this.newRestaurant.name = this.nameControl.value;
      this.newRestaurant.description = this.descControl.value;
      this.newRestaurant.cuisine = this.cuisineControl.value;
      this.newRestaurant.phone = this.phoneControl.value;
      this.newRestaurant.daysOpen = this.daysControl.value;
    }
    this.newRestaurant.daysOpen = this.daysOpen
      .map((open, i) => (open ? String(i) : ''))
      .filter((day) => day !== '');
    console.log(this.newRestaurant);

    if (this.editing) {
      this.restaurantsService.editRestaurant(this.newRestaurant)
        .subscribe({
          next: () => {
            console.log('Editing restaurant');
            this.saved = true;
            this.router.navigate(['/restaurants/' + this.newRestaurant.id]);
          },
          error: (error) => console.error(error)
        });
    } else {
      this.restaurantsService.addRestaurant(this.newRestaurant).subscribe({
        next: (response) => {
          this.saved = true;
          this.router.navigate(['/restaurants']);
          /*
          Swal.fire({
            icon: ' success ',
            title: 'Added! ',
            text: 'DONE',
          });
          */
        },
        error: (error) => {
          /*
          Swal.fire({
            icon: ' error ',
            title: 'ERROR! ',
            text: error.message,
          });
          */
          console.error(error.message);

        },
      });
    }
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

  resetRestaurantForm() {
    this.restaurantForm.reset();
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

  // METHOD TO PREVENT LEAVING THE PAGE WHILE WRITING
  canDeactivate() {
    return this.saved ||
    this.restaurantForm.pristine ||
    window.confirm('Do you want to leave this page?. Changes can be lost');

  }

  validClasses(control: FormControl | FormArray | FormGroup, validClass: string, errorClass: string) {
    return {
      [validClass]: control.touched && control.valid,
      [errorClass]: control.touched && control.invalid,
    };
  }

}

