import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { BlogPost, BlogPostStatus } from './schemas/blog-post.schema';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { GetPublishedBlogPostsDto } from './dto/get-published-blog-posts.dto';
import { GetUserBlogPostsDto } from './dto/get-user-blog-posts.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import {
  BlogPostNotFoundException,
  PathAlreadyExistsException,
} from './exceptions';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(BlogPost.name) private readonly blogPostModel: Model<BlogPost>,
  ) {}

  async createBlogPost(userId: Types.ObjectId, dto: CreateBlogPostDto) {
    const blogPost = new this.blogPostModel({ user: userId, ...dto });

    if (!dto.path) blogPost.path = blogPost.id;
    else if (await this.blogPostModel.findOne({ path: dto.path }).exec())
      throw new PathAlreadyExistsException();

    await blogPost.save();

    return { message: 'Blog post created!', data: { blogPost } };
  }

  async updateBlogPost(userId: Types.ObjectId, dto: UpdateBlogPostDto) {
    const { id, ...rest } = dto;
    console.log(await this.blogPostModel.findOne({ path: dto.path }).exec());
    if (
      dto.path &&
      (await this.blogPostModel.findOne({ path: dto.path }).exec())
    )
      throw new PathAlreadyExistsException();

    const results = await this.blogPostModel
      .updateOne(
        {
          user: userId,
          _id: id,
        },
        { $set: rest },
      )
      .exec();

    if (results.matchedCount < 1) throw new BlogPostNotFoundException();

    return { message: 'Blog post updated!' };
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
      .select('-body -status')
      .sort('-createdAt')
      .populate('user', '-_id name')
      .lean()
      .exec();

    return {
      message: 'Published blog posts fetched!',
      data: { blogPosts },
    };
  }

  async getPublishedBlogPost(path: string) {
    const blogPost = await this.blogPostModel
      .findOne({
        status: BlogPostStatus.PUBLISHED,
        path,
      })
      .select('-preview')
      .exec();

    if (!blogPost) throw new BlogPostNotFoundException();

    blogPost.reads++;

    await blogPost.save();

    return { message: 'Blog post fetched!', data: { blogPost } };
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

  async getUserBlogPost(userId: Types.ObjectId, id: Types.ObjectId) {
    const blogPost = await this.blogPostModel
      .findOne({ user: userId, _id: id })
      .lean()
      .exec();

    if (!blogPost) throw new BlogPostNotFoundException();

    return { message: 'Blog post fetched!', data: { blogPost } };
  }
}
