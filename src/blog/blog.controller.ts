import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { UserGuard, UserPopulatedRequest } from 'src/user/user.guard';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { GetPublishedBlogPostsDto } from './dto/get-published-blog-posts.dto';
import { GetUserBlogPostsDto } from './dto/get-user-blog-posts.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Controller('/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(UserGuard)
  @Post('/post')
  createBlogPost(
    @Req() req: UserPopulatedRequest,
    @Body() body: CreateBlogPostDto,
  ) {
    return this.blogService.createBlogPost(req.user.id, body);
  }

  @UseGuards(UserGuard)
  @Patch('/post')
  updateBlogPost(
    @Req() req: UserPopulatedRequest,
    @Body() body: UpdateBlogPostDto,
  ) {
    return this.blogService.updateBlogPost(req.user.id, body);
  }

  @Get('/post')
  getPublishedBlogPosts(@Query() query: GetPublishedBlogPostsDto) {
    return this.blogService.getPublishedBlogPosts(query);
  }

  @UseGuards(UserGuard)
  @Get('/post/me')
  getUserBlogPosts(
    @Req() req: UserPopulatedRequest,
    @Query() query: GetUserBlogPostsDto,
  ) {
    return this.blogService.getUserBlogPosts(req.user.id, query);
  }
}
