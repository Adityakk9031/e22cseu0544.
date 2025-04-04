import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Paper, Chip, Skeleton, useTheme, Badge } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { User } from '../types';
import mockApi from '../services/mockData';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PostAddIcon from '@mui/icons-material/PostAdd';

const TopUsers: React.FC = () => {
  const theme = useTheme();
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['top-users'],
    queryFn: () => mockApi.getTopUsers(),
  });

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Top Users
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Paper key={i} elevation={2} sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Skeleton variant="text" width={50} height={40} />
                    <Skeleton variant="circular" width={100} height={100} sx={{ my: 2 }} />
                    <Skeleton variant="text" width={150} height={30} />
                    <Skeleton variant="text" width={100} height={20} />
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
          Error loading top users
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please try again later
        </Typography>
      </Box>
    );
  }

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return '#FFD700'; // Gold
      case 1: return '#C0C0C0'; // Silver
      case 2: return '#CD7F32'; // Bronze
      default: return theme.palette.primary.main;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Top Users
        </Typography>
        <Chip 
          icon={<EmojiEventsIcon />} 
          label={`Top ${users?.length || 0} Users`} 
          color="primary" 
          variant="outlined" 
          sx={{ fontWeight: 500 }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {users?.map((user, index) => (
          <Paper 
            key={user.id} 
            elevation={2} 
            sx={{ 
              flex: '1 1 300px', 
              maxWidth: '400px',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                bgcolor: getMedalColor(index),
              }
            }}
          >
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Badge
                    badgeContent={index + 1}
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: getMedalColor(index),
                        color: index < 3 ? 'white' : 'inherit',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                      }
                    }}
                  >
                    <Avatar
                      src={`https://i.pravatar.cc/150?u=${user.id}`}
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        mb: 2,
                        border: `3px solid ${getMedalColor(index)}`,
                        boxShadow: `0 0 10px ${getMedalColor(index)}40`
                      }}
                    />
                  </Badge>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {user.username}
                  </Typography>
                  <Chip 
                    icon={<PostAddIcon />} 
                    label={`${user.postCount} posts`} 
                    color="primary" 
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    User ID: {user.id}
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

export default TopUsers; 