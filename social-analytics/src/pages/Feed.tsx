import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Avatar, Paper, Chip, Skeleton, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Post } from '../types';
import mockApi from '../services/mockData';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CommentIcon from '@mui/icons-material/Comment';

const Feed: React.FC = () => {
  const theme = useTheme();
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () => mockApi.getPosts(),
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Latest Posts
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[1, 2, 3].map((i) => (
            <Paper key={i} elevation={2}>
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
          Error loading posts
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
          Latest Posts
        </Typography>
        <Chip 
          label={`${posts?.length || 0} posts`} 
          color="primary" 
          variant="outlined" 
          sx={{ fontWeight: 500 }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {posts?.map((post) => (
          <Paper key={post.id} elevation={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={`https://i.pravatar.cc/150?u=${post.userId}`} 
                    sx={{ width: 48, height: 48, border: `2px solid ${theme.palette.primary.main}` }}
                  />
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
                    color="primary" 
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

export default Feed; 