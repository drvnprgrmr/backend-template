import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { UserGuard, UserPopulatedRequest } from 'src/user/user.guard';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';

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
}
