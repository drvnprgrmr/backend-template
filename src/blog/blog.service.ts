import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { BlogPost, BlogPostStatus } from './schemas/blog-post.schema';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { GetPublishedBlogPostsDto } from './dto/get-published-blog-posts.dto';
import { GetUserBlogPostsDto } from './dto/get-user-blog-posts.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(BlogPost.name) private readonly blogPostModel: Model<BlogPost>,
  ) {}

  async createBlogPost(userId: Types.ObjectId, dto: CreateBlogPostDto) {
    const blogPost = await this.blogPostModel.create({ user: userId, ...dto });

    return { message: 'Blog post created successfully!', data: { blogPost } };
  }

  async getPublishedBlogPosts(dto: GetPublishedBlogPostsDto) {
    const { userId, q } = dto;

    const filter: FilterQuery<BlogPost> = {
      $and: [
        {
          status: BlogPostStatus.PUBLISHED,
        },
      ],
    };

    if (userId) filter.$and.push({ user: userId });
    if (q) filter.$and.push({ $or: [{ title: { $regex: q, $options: 'i' } }] });

    const blogPosts = await this.blogPostModel
      .find(filter)
      .sort('-createdAt')
      .populate('user', 'name')
      .lean()
      .exec();

    return {
      message: 'Published blog posts fetched!',
      data: { blogPosts },
    };
  }

  async getUserBlogPosts(userId: Types.ObjectId, dto: GetUserBlogPostsDto) {
    const { q, status } = dto;

    const filter: FilterQuery<BlogPost> = { $and: [{ user: userId }] };

    if (q) filter.$and.push({ $or: [{ title: { $regex: q, $options: 'i' } }] });
    if (status) filter.$and.push({ status });

    const blogPosts = await this.blogPostModel
      .find(filter)
      .sort('-updatedAt')
      .lean()
      .exec();

    return { message: "User's blog posts fetched!", data: { blogPosts } };
  }
}
