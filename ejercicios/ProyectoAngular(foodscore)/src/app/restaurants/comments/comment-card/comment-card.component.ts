import { Component, Input, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Comment } from 'src/app/interfaces/comment';
import { User } from 'src/app/interfaces/user';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'fs-comment-card',
  standalone: true,
  imports: [RouterModule, CommonModule, NgFor],
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css']
})
export class CommentCardComponent {
  @Input() comment!: Comment;

  constructor(private router: Router) {
  }

}
