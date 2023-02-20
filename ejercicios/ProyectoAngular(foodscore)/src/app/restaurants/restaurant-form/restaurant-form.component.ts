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
import { RestaurantsService } from '../services/restaurant-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CanDeactivateComponent } from 'src/app/guards/leave-page.guard';
//Custom Validators
import { OneCheckedDirective } from 'src/app/shared/validators/one-is-checked.directive';
import Swal from 'sweetalert2';
import { ArcgisMapComponent } from 'src/app/maps/arcgis-map/arcgis-map.component';
import { ArcgisMarkerDirective } from 'src/app/maps/arcgis-marker/arcgis-marker.directive';
import { ArcgisSearchDirective } from 'src/app/maps/arcgis-search/arcgis-search.directive';
import { SearchResult } from 'src/app/maps/interfaces/search-result';
@Component({
  selector: 'fs-restaurant-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OneCheckedDirective,
    ArcgisMapComponent,
    ArcgisMarkerDirective,
    ArcgisSearchDirective,
  ],
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css'],
})

export class RestaurantFormComponent implements OnInit, CanDeactivateComponent {
  //Constants
  daysOpen: boolean[] = new Array(7).fill(true);
  readonly days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  //Emitters
  @Output() add = new EventEmitter<Restaurant>();
  //Values to initialize
  newRestaurant: Restaurant;
  //Variables utilities
  saved = false;
  editing = false;
  latitude: number = 0;
  longitude: number = 0;
  inputAddress = " ";
  // FORM OBJECT
  restaurantForm!: FormGroup;
  daysControl!: FormArray;
  // CONTROL OBJECTS
  nameControl!: FormControl<string>;
  descControl!: FormControl<string>;
  phoneControl!: FormControl<string>;
  cuisineControl!: FormControl<string>;
  imageControl!: FormControl<string>;
  addressControl!: FormControl<string>;

  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly router: Router,
    private route: ActivatedRoute,
    private fb: NonNullableFormBuilder,
  ) {
    this.newRestaurant = this.resetRestaurant();

  }

  ngOnInit(): void {
    this.getGeolocation();
    this.createFormControls();
    this.createForm();
    this.route.data.subscribe((data: { [x: string]: Restaurant; }) => {
      if (data['restaurant']) {
        this.editing = true;
        this.newRestaurant = data['restaurant'];
        this.loadRestaurantValues();
      } else {
        this.editing = false;
        this.resetRestaurantForm();
      }
    });
  }

  createFormControls(): void {
    this.nameControl = this.fb.control('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z][a-zA-Z ]*$'),
      Validators.minLength(3),
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
    this.addressControl = this.fb.control('', [Validators.required,]);
    this.imageControl = this.fb.control('', [Validators.required,]);
    this.days.forEach((day) => {
      this.daysControl.push(this.fb.control(false));
    })
  }

  createForm(): void {
    this.restaurantForm = this.fb.group({
      name: this.nameControl,
      description: this.descControl,
      cuisine: this.cuisineControl,
      phone: this.phoneControl,
      days: this.daysControl,
      address: this.addressControl,
      image: this.imageControl,
    });
  }

  loadRestaurantValues(): void {
    this.restaurantForm.patchValue({
      name: this.newRestaurant.name,
      description: this.newRestaurant.description,
      cuisine: this.newRestaurant.cuisine,
      phone: this.newRestaurant.phone,
      days: this.convertFromOpenDays(),
      address: this.newRestaurant.address,
      image: this.newRestaurant.image,
    });
  }

  getGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.newRestaurant.lat = position.coords.latitude;
        this.newRestaurant.lng = position.coords.longitude;
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  searchResult(result: SearchResult) {
    console.log(result);

    this.addressControl.setValue(result.address);
    this.newRestaurant.address = result.address;
    this.newRestaurant.lat = result.latitude;
    this.newRestaurant.lng = result.longitude;
  }

  addRestaurant() {
    if (this.restaurantForm.valid) {
      this.newRestaurant.name = this.nameControl.value;
      this.newRestaurant.description = this.descControl.value;
      this.newRestaurant.cuisine = this.cuisineControl.value;
      this.newRestaurant.phone = this.phoneControl.value;
      this.newRestaurant.address = this.addressControl.value;
      this.newRestaurant.daysOpen = this.daysControl.value;
    }
    this.convertOpenDays();

    console.log(this.newRestaurant);

    if (this.editing) {

      this.restaurantsService.edit(this.newRestaurant)
        .subscribe({
          next: () => {
            console.log('Editing restaurant');
            this.saved = true;
            this.router.navigate(['/restaurants/' + this.newRestaurant.id]);
          },
          error: (error: any) => console.error(error)
        });
    } else {
      this.restaurantsService.create(this.newRestaurant).subscribe({
        next: (response) => {
          this.saved = true;
          Swal.fire({
            title: 'New restaurant created!',
            text: 'Your restaurant has been successfully created.',
            icon: 'success',
            confirmButtonText: 'OK'
          })

          this.router.navigate(['/restaurants']);
        },
        error: (error) => {
          console.error(error);

          Swal.fire({
            title: 'Could not create new restaurant',
            text: 'Some error have ocurred. We are sorry',
            icon: 'warning',
            confirmButtonText: 'OK'
          })


        },
      });
    }

  }
  convertOpenDays() {
    const result = [];

    for (let i = 0; i < this.daysControl.value.length; i++) {
      if (this.daysControl.value[i]) {
        result.push(i.toString());
      }
    }
    this.newRestaurant.daysOpen = result;
  }

  convertFromOpenDays(): boolean[] {
    console.log(this.newRestaurant.daysOpen);

    let result = this.days.map(day => this.newRestaurant.daysOpen.includes(day));
    console.log(result);

    return result
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
      address: '',
      lat: 0,
      lng: 0,
    };
  }

  // METHOD TO PREVENT LEAVING THE PAGE WHILE WRITING
  async canDeactivate(): Promise<boolean> {
    if (this.saved || this.restaurantForm.pristine) {
      return true;
    }
    const result = await Swal.fire({
      title: 'Do you really want to leave the page?',
      text: 'Your restaurant data will be lost',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
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

}

