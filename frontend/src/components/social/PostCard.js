// client/src/components/social/PostCard.jsx
import React, { useState, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Chip,
  Button,
  TextField,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  Bookmark,
  BookmarkBorder,
  MoreVert,
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  ShoppingBag,
  Link,
  Visibility,
  Repeat
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch } from 'react-redux';
import { engageWithPost } from '../../redux/slices/socialFeedSlice';
import CommentSection from './CommentSection';

const PostCard = ({ post, onEngagement }) => {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [shareDialog, setShareDialog] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  const isVideo = post.media?.[0]?.type === 'video';
  const isInstagramReel = post.platform === 'instagram' && post.contentType === 'reel';
  const isTikTok = post.platform === 'tiktok';

  const handleLike = () => {
    dispatch(engageWithPost({ 
      postId: post._id, 
      action: 'like' 
    }));
  };

  const handleSave = () => {
    dispatch(engageWithPost({ 
      postId: post._id, 
      action: 'save' 
    }));
  };

  const handleShare = () => {
    setShareDialog(true);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      dispatch(engageWithPost({ 
        postId: post._id, 
        action: 'comment',
        comment: comment.trim()
      }));
      setComment('');
    }
  };

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleVolumeToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setPlaybackTime(videoRef.current.currentTime);
      
      // Track view duration every 5 seconds
      if (Math.floor(videoRef.current.currentTime) % 5 === 0) {
        dispatch(engageWithPost({ 
          postId: post._id, 
          action: 'view',
          duration: 5
        }));
      }
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  return (
    <>
      <Card sx={{ 
        mb: 3,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Platform Badge */}
        <Chip
          label={post.platform.toUpperCase()}
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontWeight: 'bold'
          }}
        />
        
        {/* Header */}
        <CardHeader
          avatar={
            <Avatar
              src={post.artistDetails?.profileImage}
              alt={post.artistDetails?.username}
              sx={{ width: 48, height: 48 }}
            />
          }
          action={
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVert />
            </IconButton>
          }
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {post.artistDetails?.artistProfile?.stageName || post.artistDetails?.username}
              </Typography>
              {post.artistDetails?.isVerified && (
                <Box sx={{ color: 'primary.main', fontSize: 18 }}>
                  ✓
                </Box>
              )}
            </Box>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
              {post.location?.name && ` • ${post.location.name}`}
            </Typography>
          }
        />
        
        {/* Media Content */}
        <Box sx={{ position: 'relative' }}>
          {isVideo ? (
            <Box sx={{ position: 'relative', backgroundColor: '#000' }}>
              <video
                ref={videoRef}
                src={post.media[0].url}
                poster={post.media[0].thumbnail}
                style={{
                  width: '100%',
                  maxHeight: '600px',
                  objectFit: 'contain',
                  display: 'block'
                }}
                onTimeUpdate={handleVideoTimeUpdate}
                onClick={handleVideoPlay}
              />
              
              {/* Video Controls */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton 
                    onClick={handleVideoPlay}
                    sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    {playing ? <Pause /> : <PlayArrow />}
                  </IconButton>
                  
                  <IconButton 
                    onClick={handleVolumeToggle}
                    sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    {muted ? <VolumeOff /> : <VolumeUp />}
                  </IconButton>
                  
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {Math.floor(playbackTime / 60)}:{Math.floor(playbackTime % 60).toString().padStart(2, '0')}
                  </Typography>
                </Box>
                
                {/* Platform-specific features */}
                {(isInstagramReel || isTikTok) && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {post.platformData?.tiktok?.sound && (
                      <Chip
                        size="small"
                        label={post.platformData.tiktok.sound.title}
                        icon={"<MusicNote />"}
                        sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                      />
                    )}
                  </Box>
                )}
              </Box>
              
              {/* Progress Bar */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: 'rgba(255,255,255,0.3)'
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${(playbackTime / (post.media[0]?.duration || 1)) * 100}%`,
                    backgroundColor: 'primary.main'
                  }}
                />
              </Box>
            </Box>
          ) : (
            <CardMedia
              component="img"
              image={post.media[0]?.url}
              alt={post.title || 'Social media post'}
              sx={{
                maxHeight: 600,
                objectFit: 'contain',
                backgroundColor: '#f5f5f5'
              }}
            />
          )}
          
          {/* Engagement Stats Overlay */}
          <Box
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Tooltip title="Likes">
              <Box sx={{ textAlign: 'center' }}>
                <IconButton
                  onClick={handleLike}
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: post.isLiked ? 'error.main' : 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.7)'
                    }
                  }}
                >
                  {post.isLiked ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
                  {formatNumber(post.metrics.likes)}
                </Typography>
              </Box>
            </Tooltip>
            
            <Tooltip title="Comments">
              <Box sx={{ textAlign: 'center' }}>
                <IconButton
                  onClick={() => setShowComments(!showComments)}
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.7)'
                    }
                  }}
                >
                  <ChatBubbleOutline />
                </IconButton>
                <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
                  {formatNumber(post.metrics.comments)}
                </Typography>
              </Box>
            </Tooltip>
            
            <Tooltip title="Shares">
              <Box sx={{ textAlign: 'center' }}>
                <IconButton
                  onClick={handleShare}
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.7)'
                    }
                  }}
                >
                  <Share />
                </IconButton>
                <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
                  {formatNumber(post.metrics.shares)}
                </Typography>
              </Box>
            </Tooltip>
            
            <Tooltip title="Save">
              <Box sx={{ textAlign: 'center' }}>
                <IconButton
                  onClick={handleSave}
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: post.isSaved ? 'primary.main' : 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.7)'
                    }
                  }}
                >
                  {post.isSaved ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
                <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
                  {formatNumber(post.metrics.saves)}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Content */}
        <CardContent>
          <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
            {post.content}
          </Typography>
          
          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {post.hashtags.slice(0, 10).map((tag, index) => (
                <Chip
                  key={index}
                  label={`#${tag}`}
                  size="small"
                  clickable
                  sx={{ cursor: 'pointer' }}
                />
              ))}
              {post.hashtags.length > 10 && (
                <Typography variant="caption" color="text.secondary">
                  +{post.hashtags.length - 10} more
                </Typography>
              )}
            </Box>
          )}
          
          {/* Products */}
          {post.products && post.products.length > 0 && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Featured Products
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
                {post.products.map((product, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    size="small"
                    startIcon={<ShoppingBag />}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    {product.product?.name || `Product ${index + 1}`}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
        
        {/* Comments Section */}
        {showComments && (
          <CommentSection postId={post._id} />
        )}
        
        {/* Add Comment */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
            />
            <Button
              variant="contained"
              onClick={handleCommentSubmit}
              disabled={!comment.trim()}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Card>
      
      {/* More Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
          setAnchorEl(null);
        }}>
          <Link sx={{ mr: 1 }} /> Copy Link
        </MenuItem>
        <MenuItem onClick={() => {
          // Report post functionality
          setAnchorEl(null);
        }}>
          <Visibility sx={{ mr: 1 }} /> Report
        </MenuItem>
        <MenuItem onClick={() => {
          // Save to collections
          setAnchorEl(null);
        }}>
          <Bookmark sx={{ mr: 1 }} /> Save to Collection
        </MenuItem>
      </Menu>
      
      {/* Share Dialog */}
      <Dialog open={shareDialog} onClose={() => setShareDialog(false)}>
        <DialogTitle>Share Post</DialogTitle>
        <DialogContent>
          <Typography>Share this post on other platforms or copy the link.</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ChatBubbleOutline />}
              onClick={() => {
                // Share to Twitter
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.content)}&url=${window.location.origin}/post/${post._id}`);
              }}
            >
              Twitter
            </Button>
            <Button
              variant="outlined"
              startIcon={"<CameraAlt />"}
              onClick={() => {
                // Share to Instagram
                alert('Open Instagram to share this post');
              }}
            >
              Instagram
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
              setShareDialog(false);
            }}
          >
            Copy Link
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostCard;