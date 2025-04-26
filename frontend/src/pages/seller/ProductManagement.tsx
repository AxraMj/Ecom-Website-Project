import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Divider,
  Alert 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SubmitProductForm from '../../components/seller/SubmitProductForm';
import MySubmissions from '../../components/seller/MySubmissions';
import SellerLayout from '../../layouts/SellerLayout';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-management-tabpanel-${index}`}
      aria-labelledby={`product-management-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `product-management-tab-${index}`,
    'aria-controls': `product-management-tabpanel-${index}`,
  };
}

const ProductManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Reset submission success message when changing tabs
    if (newValue !== 0) {
      setSubmissionSuccess(false);
    }
  };

  const handleSubmissionSuccess = () => {
    setSubmissionSuccess(true);
    // Automatically switch to the submissions tab after successful submission
    setActiveTab(1);
  };

  return (
    <SellerLayout>
      <Typography variant="h4" component="h1" gutterBottom>
        Product Management
      </Typography>
      
      <Paper sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="product management tabs"
          variant="fullWidth"
        >
          <Tab icon={<AddIcon />} label="Submit New Product" {...a11yProps(0)} />
          <Tab icon={<ListAltIcon />} label="My Submissions" {...a11yProps(1)} />
        </Tabs>
        
        <Divider />
        
        {submissionSuccess && (
          <Alert severity="success" sx={{ m: 2 }}>
            Product submitted successfully! It will be reviewed by our team.
          </Alert>
        )}
        
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ px: { xs: 2, md: 3 }, pb: 3 }}>
            <Typography variant="body1" paragraph>
              Fill out the form below to submit a new product for approval. Our team will review your submission and get back to you within 2-3 business days.
            </Typography>
            <SubmitProductForm onSubmissionSuccess={handleSubmissionSuccess} />
          </Box>
        </TabPanel>
        
        <TabPanel value={activeTab} index={1}>
          <MySubmissions />
        </TabPanel>
      </Paper>
    </SellerLayout>
  );
};

export default ProductManagement; 