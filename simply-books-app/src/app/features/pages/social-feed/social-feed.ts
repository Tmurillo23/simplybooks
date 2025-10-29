import { Component, signal, inject } from '@angular/core';
import {SocialFeedService} from '../../../shared/services/social-feed-service';
import {Post} from '../../../shared/interfaces/post';

@Component({
  selector: 'app-social-feed',
  templateUrl: './social-feed.html',
  styleUrl: './social-feed.css',
  standalone: true
})
export class SocialFeed {
  feedService = inject(SocialFeedService);
  posts = signal<Post[]>([]);

  ngOnInit() {
    this.posts.set(this.feedService.feedItems);
  }

  // Métodos de ejemplo
  viewPostDetail(post: Post) {
    console.log('Ver detalle de:', post);
  }

  deletePost(postId: string) {
    this.feedService.removePost(postId);
    this.posts.set(this.feedService.feedItems);
  }
}
