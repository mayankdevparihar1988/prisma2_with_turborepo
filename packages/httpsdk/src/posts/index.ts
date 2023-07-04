import { Base } from '../base.js';
import { Post } from './model.js';

const resource = 'posts';

export class Posts extends Base {
  getPostById(id: number): Promise<Post> {
    return this.invoke<Post>(`/${resource}/${id}`);
  }

  getPosts(): Promise<Post[]> {
    return this.invoke(`/${resource}`);
  }

  createPost(post: Partial<Post>): Promise<Post> {
    const config = {
      method: 'POST',
      body: JSON.stringify(post)
    };

    return this.invoke(`/${resource}`, config);
  }
}
