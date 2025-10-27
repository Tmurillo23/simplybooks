import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ReviewService } from '../../../shared/services/review-service';
import { CommentService, CommentTree } from '../../../shared/services/comment-service';
import { ReviewInterface } from '../../../shared/interfaces/review-interface';
import { Auth } from '../../../shared/services/auth';
import { TINYMCE_KEY } from '../../../../environments/environment';


@Component({
  selector: 'app-review-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, EditorModule],
  templateUrl: './review-detail.html',
  styleUrls: ['./review-detail.css']
})
export class ReviewDetail implements OnInit {
  review: ReviewInterface | null = null;
  comments: CommentTree[] = [];
  reviewId!: string;
  userEmail!: string;
  tinyMCEApiKey = TINYMCE_KEY;

  newComment = '';
  replyingTo: string | null = null;

  hasLikedReviewFlag = false;
  likedComments: Record<string, boolean> = {};

  readonlyEditorConfig = {
    menubar: false,
    toolbar: false,
    statusbar: false,
    height: 300,
    readonly: true,
    content_style: 'body { font-family: Helvetica, Arial, sans-serif; font-size: 16px; }',
    setup: (editor: any) => {
      editor.on('init', () => {
        editor.mode.set('readonly');
      });
    }
  };

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private commentService: CommentService,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.userEmail = this.auth.getUserLogged().email!;
    this.reviewId = this.route.snapshot.paramMap.get('id')!;
    this.loadReview();
    this.loadComments();
  }

  private loadReview(): void {
    const allUserReviews = this.reviewService.getReviewsForUser(this.userEmail);
    this.review = allUserReviews.find(r => r.id === this.reviewId) || null;
  }

  private loadComments(): void {
    this.comments = this.commentService.getCommentsTree(this.reviewId);
  }

  // ===== Comentarios =====
  addComment(): void {
    if (!this.newComment.trim()) return;

    this.commentService.addComment(
      this.reviewId,
      this.userEmail,
      this.newComment,
      this.replyingTo || undefined
    );

    this.newComment = '';
    this.replyingTo = null;
    this.loadComments();
  }

  replyTo(commentId: string): void {
    this.replyingTo = commentId;
  }

  cancelReply(): void {
    this.replyingTo = null;
  }

  deleteComment(commentId: string): void {
    this.commentService.deleteComment(commentId);
    this.loadComments();
  }

  // ===== Likes de reseña =====
  toggleReviewLike(): void {
    if (!this.review || this.review.draft) return;

    this.review.likes += this.hasLikedReviewFlag ? -1 : 1;
    this.hasLikedReviewFlag = !this.hasLikedReviewFlag;
  }

  hasUserLikedReview(): boolean {
    return this.hasLikedReviewFlag;
  }

  // ===== Likes de comentarios =====
  toggleCommentLike(commentId: string): void {
    const hasLiked = this.likedComments[commentId];
    this.commentService.toggleLike(commentId, hasLiked);
    this.likedComments[commentId] = !hasLiked;
    this.loadComments();
  }

  hasUserLikedComment(commentId: string): boolean {
    return this.likedComments[commentId];
  }
}
