import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogPost, BlogPostSchema } from './schemas/blog-post.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: BlogPost.name,
        useFactory() {
          const schema = BlogPostSchema;

          schema.index({ user: 1 });

          return schema;
        },
      },
    ]),
  ],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
