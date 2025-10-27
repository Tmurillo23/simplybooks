import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { CommentInterface } from '../interfaces/comment-interface';

export interface CommentTree extends CommentInterface {
  replies: CommentTree[];
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private comments: CommentInterface[] = [];

  constructor() {}

  /**
   * Crear un comentario principal o una respuesta a otro comentario.
   * parentId es opcional: si se proporciona, se trata de una respuesta.
   */
  addComment(
    reviewId: string,
    userId: string,
    content: string,
    parentId?: string
  ): CommentInterface {
    const comment: CommentInterface = {
      id: uuid(),
      reviewId,
      userId,
      content,
      parentId,
      createdAt: new Date(),
      likes: 0
    };

    this.comments.push(comment);
    return comment;
  }

  /**
   * Obtener todos los comentarios de un review en forma de árbol.
   */
  getCommentsTree(reviewId: string): CommentTree[] {
    const reviewComments = this.comments.filter(c => c.reviewId === reviewId);

    const buildTree = (parentId?: string): CommentTree[] => {
      return reviewComments
        .filter(c => c.parentId === parentId)
        .map(c => ({
          ...c,
          replies: buildTree(c.id)
        }));
    };

    return buildTree();
  }

  /**
   * Eliminar un comentario y todas sus respuestas de forma recursiva.
   */
  deleteComment(commentId: string): void {
    const deleteRecursively = (id: string) => {
      const children = this.comments.filter(c => c.parentId === id);
      children.forEach(child => deleteRecursively(child.id));
      this.comments = this.comments.filter(c => c.id !== id);
    };

    deleteRecursively(commentId);
  }

  /**
   * Dar o quitar like a un comentario. No se guarda el usuario,
   * solo se incrementa o decrementa el contador.
   * hasLiked indica si el usuario ya dio like previamente.
   */
  toggleLike(commentId: string, hasLiked: boolean): void {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (hasLiked) {
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.likes += 1;
    }
  }

  /**
   * Opcional: obtener comentarios planos para un review.
   */
  getCommentsFlat(reviewId: string): CommentInterface[] {
    return this.comments.filter(c => c.reviewId === reviewId);
  }
}
