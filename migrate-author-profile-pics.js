const mongoose = require('mongoose');
const Post = require('./Models/Post'); // Adjust the path to your Post model
const User = require('./Models/User'); // Adjust the path to your User model
const dotenv = require("dotenv")

dotenv.config()

// Migration function to add authorProfilePics to existing posts
const addAuthorProfilePicsToExistingPosts = async () => {
  try {
    console.log('Starting migration: Adding authorProfilePics to existing posts...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');
    
    // Find all posts that don't have authorProfilePics field
    const postsWithoutProfilePics = await Post.find({ 
      authorProfilePics: { $exists: false } 
    }).populate('authorId', 'profilePic');
    
    console.log(`Found ${postsWithoutProfilePics.length} posts without authorProfilePics field`);
    
    if (postsWithoutProfilePics.length === 0) {
      console.log('All posts already have authorProfilePics field. Migration not needed.');
      return;
    }
    
    // Update each post with the author's profile picture
    let updatedCount = 0;
    
    for (const post of postsWithoutProfilePics) {
      try {
        // Get the author's profile picture
        const authorProfilePic = post.authorId?.profilePic || null;
        
        // Update the post with authorProfilePics field
        await Post.findByIdAndUpdate(
          post._id,
          { $set: { authorProfilePics: authorProfilePic } }
        );
        
        updatedCount++;
        
        if (updatedCount % 100 === 0) {
          console.log(`Updated ${updatedCount} posts so far...`);
        }
        
      } catch (error) {
        console.error(`Error updating post ${post._id}:`, error.message);
      }
    }
    
    console.log(`Migration completed successfully!`);
    console.log(`Total posts updated: ${updatedCount}`);
    
    // Verify the migration
    const remainingPosts = await Post.countDocuments({ 
      authorProfilePics: { $exists: false } 
    });
    
    console.log(`Posts without authorProfilePics after migration: ${remainingPosts}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Alternative: Simple migration without populating author data
const addAuthorProfilePicsSimple = async () => {
  try {
    console.log('Starting simple migration...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Simply add the field with null value to all posts that don't have it
    const result = await Post.updateMany(
      { authorProfilePics: { $exists: false } },
      { $set: { authorProfilePics: null } }
    );
    
    console.log(`Simple migration completed: Updated ${result.modifiedCount} posts`);
    
  } catch (error) {
    console.error('Simple migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

const forceAddAuthorProfilePics = async () => {
  try {
    console.log('Force adding authorProfilePics to ALL posts...');
    
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');
    
    // Get all posts with their authors
    const posts = await Post.find({}).populate('authorId', 'profilePic');
    console.log(`Found ${posts.length} total posts`);
    
    if (posts.length === 0) {
      console.log('No posts found in database');
      return;
    }
    
    let updatedCount = 0;
    
    // Force update each post
    for (const post of posts) {
      try {
        // Get the author's profile picture or set to null
        const authorProfilePic = post.authorId?.profilePic || null;
        
        // Force update using $set - this will add the field if it doesn't exist
        await Post.findByIdAndUpdate(
          post._id,
          { 
            $set: { 
              authorProfilePics: authorProfilePic 
            } 
          },
          { new: true }
        );
        
        updatedCount++;
        console.log(`Updated post ${updatedCount}/${posts.length}: ${post.title}`);
        
      } catch (error) {
        console.error(`Error updating post ${post._id}:`, error.message);
      }
    }
    
    console.log(`\nMigration completed!`);
    console.log(`Total posts processed: ${posts.length}`);
    console.log(`Posts updated: ${updatedCount}`);
    
    // Verify by checking one post
    const samplePost = await Post.findOne({}).select('title authorProfilePics');
    console.log('\nSample post after migration:');
    console.log(JSON.stringify(samplePost, null, 2));
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Alternative: Direct MongoDB update (more forceful)
const directMongoUpdate = async () => {
  try {
    console.log('Using direct MongoDB update...');
    
    await mongoose.connect(process.env.MONGODB_URL);
    
    // Update ALL posts, forcing the field to be added
    const result = await Post.updateMany(
      {}, // Empty filter = all documents
      { 
        $set: { 
          authorProfilePics: null // Set to null for now, we'll populate later
        } 
      }
    );
    
    console.log(`Direct update result: ${result.modifiedCount} documents modified`);
    
    // Now populate with actual profile pics
    const posts = await Post.find({}).populate('authorId', 'profilePic');
    
    for (const post of posts) {
      if (post.authorId?.profilePic) {
        await Post.findByIdAndUpdate(
          post._id,
          { $set: { authorProfilePics: post.authorId.profilePic } }
        );
      }
    }
    
    console.log('Profile pics populated successfully');
    
  } catch (error) {
    console.error('Direct update failed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the force migration
console.log('Choose migration method:');
console.log('Running force migration...\n');

// Run the migration
// Choose one of the methods below:
directMongoUpdate()

// Method 1: Full migration with author profile pics
// addAuthorProfilePicsToExistingPosts();

// Method 2: Simple migration (uncomment to use instead)
// addAuthorProfilePicsSimple();

// forceAddAuthorProfilePics();