import { Box, Typography, Grid, Link, Divider } from '@mui/material'
import { Work } from '@mui/icons-material'

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#1a237e', color: '#fff', pt: 6, pb: 3, mt: 'auto' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Grid container spacing={4} sx={{ mb: 4 }}>

          {/* Brand */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Work sx={{ color: '#90caf9' }} />
              <Typography variant="h6" fontWeight={700}>JobPortal By Abhay</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#90caf9', lineHeight: 1.8 }}>
              Find your dream job with thousands of opportunities from top companies across India.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Quick Links</Typography>
            {['Home', 'Jobs', 'Login'].map((item) => (
              <Box key={item} sx={{ mb: 1 }}>
                <Link href="#" underline="hover" sx={{ color: '#90caf9', fontSize: 14 }}>{item}</Link>
              </Box>
            ))}
          </Grid>

          {/* Categories */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Categories</Typography>
            {['Technology', 'Marketing', 'Finance', 'Healthcare', 'Design'].map((cat) => (
              <Box key={cat} sx={{ mb: 1 }}>
                <Link href="#" underline="hover" sx={{ color: '#90caf9', fontSize: 14 }}>{cat}</Link>
              </Box>
            ))}
          </Grid>

          {/* Contact */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Contact</Typography>
            <Typography variant="body2" sx={{ color: '#90caf9', mb: 1 }}>abhaysnath502@gmail.com</Typography>
            <Typography variant="body2" sx={{ color: '#90caf9', mb: 1 }}>+91 7907940178</Typography>
            <Typography variant="body2" sx={{ color: '#90caf9' }}>Kerala,Bangalore,India</Typography>
          </Grid>

        </Grid>

        <Divider sx={{ borderColor: '#3949ab', mb: 3 }} />

        <Typography variant="body2" sx={{ color: '#90caf9', textAlign: 'center' }}>
          © {new Date().getFullYear()} JobPortal by abhay. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}

export default Footer