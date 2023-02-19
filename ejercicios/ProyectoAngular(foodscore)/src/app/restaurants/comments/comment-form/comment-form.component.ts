import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth-service';
import { RestaurantsService } from '../../services/restaurant-service';
import { Comment } from 'src/app/interfaces/comment';
@Component({
  selector: 'fs-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent {
  private comment: string = '';
  rating: number = 0;
  stars: Array<number> = [1, 2, 3, 4, 5];

  constructor(private restaurantsService: RestaurantsService, private authService: AuthService) { }

  onSubmit(): void {
    console.log('Submiting new comment');

    /*
    this.restaurantsService.addComment(this.comment, this.rating).subscribe(
      (response) => {
        console.log('Comment added successfully');
        // Aquí podrías hacer algo para notificar al usuario de que se ha añadido el comentario correctamente
      },
      (error) => {
        console.log('Error adding comment');
        // Aquí podrías hacer algo para notificar al usuario de que ha habido un error al añadir el comentario
      }
    );
    */
  }

  onClickStar(index: number): void {
    this.rating = index + 1;
  }
}
