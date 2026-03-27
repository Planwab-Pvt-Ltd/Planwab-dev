import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["wedding", "birthday", "corporate", "tips", "anniversary", "other"],
      default: "other",
      index: true,
    },
    tags: [{ type: String, trim: true, lowercase: true }],

    
    authorClerkId: {
      type: String,
      required: [true, "Author Clerk ID is required"],
      index: true,
    },
    authorName: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    authorPhoto: {
      type: String,
      trim: true,
    },


    isPublished: { type: Boolean, default: true, index: true },

  
    viewCount:    { type: Number, default: 0, min: 0 },
    likeCount:    { type: Number, default: 0, min: 0 },
    shareCount:   { type: Number, default: 0, min: 0 },

   
    likedBy: [{ type: String, trim: true }],
    savedBy: [{ type: String, trim: true }],

    
    readTime: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);


blogSchema.index({ isPublished: 1, category: 1, createdAt: -1 });
blogSchema.index({ authorClerkId: 1, createdAt: -1 });
blogSchema.index({ viewCount: -1 });
blogSchema.index({ likeCount: -1 });
blogSchema.index(
  { title: "text", excerpt: "text", content: "text", tags: "text" },
  { name: "blog_text_search", default_language: "english", language_override: "none" }
);


blogSchema.pre("save", function (next) {
  if (this.content) {
    const wordCount = this.content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(wordCount / 200));
    this.readTime = `${minutes} min read`;
  }
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/<[^>]*>/g, "").substring(0, 300);
  }
  next();
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export default Blog;
