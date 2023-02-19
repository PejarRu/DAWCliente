import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from 'src/app/interfaces/comment';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'fs-comment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css'],
})
export class CommentFormComponent {
  @Output() addComment = new EventEmitter<Comment>();
  newComment: Comment = {
    stars: 0,
    text: '',
  };
  starsHighlighted: number = 0;
  showStars() {
    console.log(this.newComment.stars);

  }
  highlightStars(number: number){
    console.log(number);

    this.starsHighlighted = this.newComment.stars;
    for (let i = this.newComment.stars; i <= 5; i++) {
      const element = document.querySelector(`span[data-score="${i}"]`) as HTMLElement;
      if (element) {
        element.style.color = 'orange';
      }
    }
  }
  resetStars(){
    this.starsHighlighted = 0;
    for (let i = 1; i <= 5; i++) {
      const element = document.querySelector(`span[data-score="${i}"]`) as HTMLElement;
      if (element) {
        element.style.fontSize = '';
        element.style.color = '';
      }
    }
  }
  addNewComment() {
    this.addComment.emit(this.newComment)
    /*
    let id = this.restaurant.id;
    this.restaurantsService.addComment(id, this.newComment).subscribe(
      () => console.log('posting comment on restaurant: ' + id)
    );
    */
  }
}
