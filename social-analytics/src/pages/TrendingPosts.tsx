import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Avatar, Paper, Chip, Skeleton, useTheme, Badge } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Post } from '../types';
import mockApi from '../services/mockData';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CommentIcon from '@mui/icons-material/Comment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const TrendingPosts: React.FC = () => {
  const theme = useTheme();
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['trending-posts'],
    queryFn: () => mockApi.getTrendingPosts(),
  });

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Trending Posts
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {[1, 2].map((i) => (
            <Paper key={i} elevation={2} sx={{ flex: '1 1 400px', maxWidth: '600px' }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width={120} sx={{ ml: 2 }} />
                  </Box>
                  <Skeleton variant="text" width="100%" height={60} />
                  <Skeleton variant="rectangular" width="100%" height={300} sx={{ mt: 2, borderRadius: 1 }} />
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Skeleton variant="text" width={150} />
                    <Skeleton variant="text" width={100} />
                  </Box>
                </CardContent>
              </Card>
            </Paper>
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error loading trending posts
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please try again later
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Trending Posts
        </Typography>
        <Chip 
          icon={<TrendingUpIcon />} 
          label={`${posts?.length || 0} Trending Posts`} 
          color="secondary" 
          variant="outlined" 
          sx={{ fontWeight: 500 }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {posts?.map((post, index) => (
          <Paper 
            key={post.id} 
            elevation={2} 
            sx={{ 
              flex: '1 1 400px', 
              maxWidth: '600px',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                bgcolor: theme.palette.secondary.main,
              }
            }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <LocalFireDepartmentIcon 
                        sx={{ 
                          color: '#FF4500', 
                          fontSize: 20,
                          filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.3))'
                        }} 
                      />
                    }
                  >
                    <Avatar 
                      src={`https://i.pravatar.cc/150?u=${post.userId}`} 
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        border: `2px solid ${theme.palette.secondary.main}` 
                      }}
                    />
                  </Badge>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {post.username}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: '0.875rem' }}>
                      <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">
                        {new Date(post.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                  {post.content}
                </Typography>
                {post.image && (
                  <CardMedia
                    component="img"
                    height="300"
                    image={post.image}
                    alt="Post image"
                    sx={{ 
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      mb: 2
                    }}
                  />
                )}
                <Box sx={{ 
                  mt: 2, 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: `1px solid ${theme.palette.divider}`,
                  pt: 2
                }}>
                  <Chip 
                    icon={<CommentIcon />} 
                    label={`${post.commentCount} Comments`} 
                    color="secondary" 
                    variant="outlined"
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Post ID: {post.id}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default TrendingPosts; 