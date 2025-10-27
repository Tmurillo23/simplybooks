import { Component, Input } from '@angular/core';
import { CommentTree } from '../../../shared/services/comment-service';
import {FormsModule} from '@angular/forms';
import {ReviewDetail} from '../review-detail/review-detail';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.html',
  styleUrls: ['./comment-item.css'],
  imports: [
    FormsModule
  ],
  standalone: true
})
export class CommentItem {
  @Input() comment!: CommentTree;
  @Input() replyingTo!: string | null;
  @Input() newComment!: string;
  @Input() level: number = 0;

  constructor(public parent: ReviewDetail) {} // acceso a funciones del padre
}
