import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BlogPost } from './schemas/blog-post.schema';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { GetBlogPostsDto } from './dto/get-blog-posts.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(BlogPost.name) private readonly blogPostModel: Model<BlogPost>,
  ) {}

  async createBlogPost(userId: Types.ObjectId, dto: CreateBlogPostDto) {
    const blog = await this.blogPostModel.create({ user: userId, ...dto });

    return { message: 'Blog created successfully!', data: { blog } };
  }

  async getBlogPosts(dto: GetBlogPostsDto) {}

  async getBlogPost(id: Types.ObjectId) {}
}
