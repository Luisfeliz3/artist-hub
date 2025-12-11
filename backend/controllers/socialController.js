// controllers/socialController.js
const SocialPost = require('../models/SocialPost');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get social feed with advanced filtering
exports.getSocialFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 20,
      platform,
      category,
      hashtag,
      trending = false,
      following = true,
      sortBy = 'latest', // latest, popular, trending, recommended
      search,
      minDuration,
      maxDuration,
      excludeViewed = false
    } = req.query;

    const skip = (page - 1) * limit;
    
    // Build match conditions
    const matchConditions = { 
      visibility: 'public',
      moderationStatus: 'approved'
    };

    // Platform filter
    if (platform) {
      matchConditions.platform = platform;
    }

    // Category filter
    if (category) {
      matchConditions.categories = category;
    }

    // Hashtag filter
    if (hashtag) {
      matchConditions.hashtags = hashtag.toLowerCase();
    }

    // Duration filter for videos
    if (minDuration || maxDuration) {
      matchConditions['media.duration'] = {};
      if (minDuration) matchConditions['media.duration'].$gte = parseInt(minDuration);
      if (maxDuration) matchConditions['media.duration'].$lte = parseInt(maxDuration);
    }

    // Search
    if (search) {
      matchConditions.$or = [
        { content: { $regex: search, $options: 'i' } },
        { hashtags: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    // Get user's following if needed
    let followingArtists = [];
    if (following) {
      const user = await User.findById(userId).select('following');
      followingArtists = user?.following || [];
    }

    // Build pipeline
    const pipeline = [
      { $match: matchConditions },
      
      // Exclude already viewed posts if requested
      ...(excludeViewed ? [{
        $match: {
          'userEngagement.views.user': { $ne: mongoose.Types.ObjectId(userId) }
        }
      }] : []),
      
      // Following filter
      ...(following && followingArtists.length > 0 ? [{
        $match: {
          artist: { $in: followingArtists }
        }
      }] : []),
      
      // Lookup artist details
      {
        $lookup: {
          from: 'users',
          localField: 'artist',
          foreignField: '_id',
          as: 'artistDetails'
        }
      },
      { $unwind: '$artistDetails' },
      
      // Calculate engagement score
      {
        $addFields: {
          engagementScore: {
            $add: [
              { $multiply: ['$metrics.likes', 1] },
              { $multiply: ['$metrics.comments', 2] },
              { $multiply: ['$metrics.shares', 3] },
              { $multiply: ['$metrics.saves', 1.5] },
              { $divide: ['$metrics.views', 1000] }
            ]
          },
          trendingScore: {
            $cond: {
              if: {
                $and: [
                  { $gt: ['$metrics.views', 1000] },
                  { $gt: [{
                    $divide: [
                      { $add: ['$metrics.likes', { $multiply: ['$metrics.comments', 2] }] },
                      { $max: ['$metrics.views', 1] }
                    ]}, 0.05]
                  }
                ]
              },
              then: {
                $multiply: [
                  '$engagementScore',
                  { $divide: [72, { $add: [{
                    $divide: [{
                      $subtract: [new Date(), '$publishedAt']
                    }, 1000 * 60 * 60] }, 1]
                  }] }]
              },
              else: 0
            }
          },
          isLiked: {
            $in: [mongoose.Types.ObjectId(userId), '$userEngagement.likes']
          },
          isSaved: {
            $in: [mongoose.Types.ObjectId(userId), '$userEngagement.saves']
          }
        }
      },
      
      // Sorting
      {
        $sort: (() => {
          switch(sortBy) {
            case 'popular':
              return { engagementScore: -1, publishedAt: -1 };
            case 'trending':
              return { trendingScore: -1, publishedAt: -1 };
            case 'recommended':
              // For now, same as popular - can implement ML-based recommendations later
              return { engagementScore: -1, publishedAt: -1 };
            default: // 'latest'
              return { publishedAt: -1 };
          }
        })()
      },
      
      // Pagination
      { $skip: skip },
      { $limit: parseInt(limit) },
      
      // Project only needed fields
      {
        $project: {
          title: 1,
          content: 1,
          platform: 1,
          contentType: 1,
          media: 1,
          platformData: 1,
          metrics: 1,
          hashtags: 1,
          categories: 1,
          products: 1,
          publishedAt: 1,
          engagementScore: 1,
          trendingScore: 1,
          isLiked: 1,
          isSaved: 1,
          artistDetails: {
            _id: 1,
            username: 1,
            profileImage: 1,
            artistProfile: {
              stageName: 1,
              genre: 1
            }
          },
          userEngagement: {
            likes: { $size: '$userEngagement.likes' },
            comments: { $slice: ['$userEngagement.comments', 5] }, // Top 5 comments
            hasMoreComments: { $gt: [{ $size: '$userEngagement.comments' }, 5] }
          }
        }
      }
    ];

    // Execute aggregation
    const posts = await SocialPost.aggregate(pipeline);
    
    // Get total count for pagination
    const countPipeline = [
      { $match: matchConditions },
      ...(following && followingArtists.length > 0 ? [{
        $match: { artist: { $in: followingArtists } }
      }] : []),
      { $count: 'total' }
    ];
    
    const countResult = await SocialPost.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    res.json({
      success: true,
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        platform,
        category,
        hashtag,
        sortBy
      }
    });

  } catch (error) {
    console.error('Error fetching social feed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch social feed'
    });
  }
};

// Get trending posts
exports.getTrendingPosts = async (req, res) => {
  try {
    const { limit = 10, timeRange = 'day' } = req.query;
    
    // Calculate time range
    const timeRanges = {
      hour: 1,
      day: 24,
      week: 168,
      month: 720
    };
    
    const hours = timeRanges[timeRange] || 24;
    const timeAgo = new Date(Date.now() - hours * 60 * 60 * 1000);

    const pipeline = [
      {
        $match: {
          publishedAt: { $gte: timeAgo },
          visibility: 'public',
          moderationStatus: 'approved'
        }
      },
      {
        $addFields: {
          engagementVelocity: {
            $divide: [
              {
                $add: [
                  '$metrics.likes',
                  { $multiply: ['$metrics.comments', 2] },
                  { $multiply: ['$metrics.shares', 3] }
                ]
              },
              {
                $divide: [
                  { $subtract: [new Date(), '$publishedAt'] },
                  1000 * 60 * 60 // Convert to hours
                ]
              }
            ]
          }
        }
      },
      { $sort: { engagementVelocity: -1, publishedAt: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'artist',
          foreignField: '_id',
          as: 'artistDetails'
        }
      },
      { $unwind: '$artistDetails' },
      {
        $project: {
          title: 1,
          content: 1,
          platform: 1,
          media: 1,
          metrics: 1,
          hashtags: 1,
          publishedAt: 1,
          engagementVelocity: 1,
          artistDetails: {
            username: 1,
            profileImage: 1,
            artistProfile: { stageName: 1 }
          }
        }
      }
    ];

    const trendingPosts = await SocialPost.aggregate(pipeline);
    
    res.json({
      success: true,
      trendingPosts,
      timeRange,
      updatedAt: new Date()
    });

  } catch (error) {
    console.error('Error fetching trending posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending posts'
    });
  }
};

// Engage with post (like, save, etc.)
exports.engageWithPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { action, comment, duration } = req.body;
    const userId = req.user.id;

    const post = await SocialPost.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    let result;
    switch (action) {
      case 'view':
        result = await post.addView(userId, duration);
        break;
      
      case 'like':
        const newLikeCount = await post.toggleLike(userId);
        result = { likes: newLikeCount };
        break;
      
      case 'save':
        const saveIndex = post.userEngagement.saves.indexOf(userId);
        if (saveIndex > -1) {
          post.userEngagement.saves.splice(saveIndex, 1);
          post.metrics.saves -= 1;
        } else {
          post.userEngagement.saves.push(userId);
          post.metrics.saves += 1;
        }
        result = await post.save();
        break;
      
      case 'comment':
        if (!comment) {
          return res.status(400).json({
            success: false,
            error: 'Comment content is required'
          });
        }
        result = await post.addComment(userId, comment);
        break;
      
      case 'share':
        if (!post.userEngagement.shares.includes(userId)) {
          post.userEngagement.shares.push(userId);
          post.metrics.shares += 1;
          result = await post.save();
        }
        break;
      
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action'
        });
    }

    res.json({
      success: true,
      action,
      result,
      postId
    });

  } catch (error) {
    console.error('Error engaging with post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to engage with post'
    });
  }
};

// Get post comments
exports.getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20, sort = 'latest' } = req.query;
    const skip = (page - 1) * limit;

    const post = await SocialPost.findById(postId)
      .select('userEngagement.comments')
      .populate({
        path: 'userEngagement.comments.user',
        select: 'username profileImage'
      })
      .populate({
        path: 'userEngagement.comments.replies.user',
        select: 'username profileImage'
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    let comments = [...post.userEngagement.comments];
    
    // Sorting
    if (sort === 'popular') {
      comments.sort((a, b) => {
        const aScore = a.likes.length + a.replies.length * 0.5;
        const bScore = b.likes.length + b.replies.length * 0.5;
        return bScore - aScore;
      });
    } else { // latest
      comments.sort((a, b) => b.createdAt - a.createdAt);
    }

    // Pagination
    const total = comments.length;
    comments = comments.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comments'
    });
  }
};

// Sync social media posts
exports.syncSocialMediaPosts = async (req, res) => {
  try {
    const { platform, artistId } = req.body;
    const userId = req.user.id;

    // Check if user is the artist or admin
    const user = await User.findById(userId);
    if (!user || (user.role !== 'admin' && user._id.toString() !== artistId)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to sync posts'
      });
    }

    // This is where you would integrate with actual social media APIs
    // For now, we'll return a mock response
    
    // Example: Instagram Graph API integration placeholder
    const mockPosts = [
      {
        platform: 'instagram',
        platformPostId: `insta_${Date.now()}`,
        content: 'Check out my latest track! 🎵',
        media: [{
          url: 'https://example.com/insta-post.jpg',
          type: 'image'
        }],
        metrics: {
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 100),
          views: Math.floor(Math.random() * 5000)
        },
        publishedAt: new Date()
      }
    ];

    // Save posts to database
    const savedPosts = [];
    for (const postData of mockPosts) {
      const post = new SocialPost({
        ...postData,
        artist: artistId,
        platformData: {
          [platform]: {
            syncedAt: new Date(),
            lastSynced: new Date()
          }
        }
      });
      await post.save();
      savedPosts.push(post);
    }

    res.json({
      success: true,
      message: `Synced ${savedPosts.length} posts from ${platform}`,
      posts: savedPosts
    });

  } catch (error) {
    console.error('Error syncing social media:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync social media posts'
    });
  }
};