import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReviewService } from '../../../shared/services/review-service';
import { CommentService, CommentTree } from '../../../shared/services/comment-service';
import { ReviewInterface } from '../../../shared/interfaces/review-interface';
import { Auth } from '../../../shared/services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-detail',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './review-detail.html',
  styleUrls: ['./review-detail.css']
})
export class ReviewDetail implements OnInit {
  review: ReviewInterface | null = null;
  comments: CommentTree[] = [];
  reviewId!: string;
  userEmail!: string;

  newComment = '';
  replyingTo: string | null = null;

  // Estado local para likes
  hasLikedReviewFlag = false;
  likedComments: Record<string, boolean> = {}; // commentId => liked

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

    // Contador local
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
    this.loadComments(); // recarga árbol actualizado
  }

  hasUserLikedComment(commentId: string): boolean {
    return this.likedComments[commentId];
  }
}
