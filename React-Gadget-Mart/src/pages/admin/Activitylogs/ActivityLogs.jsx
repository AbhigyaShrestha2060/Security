import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Box,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { activityLogsApi } from '../../../Apis/api';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await activityLogsApi();
        setLogs(response.data.logs || []);
        setIsLoading(false);
      } catch (error) {
        toast.error('Failed to fetch activity logs');
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleMethodFilter = (event) => {
    setMethodFilter(event.target.value);
    setPage(0);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod = methodFilter === 'all' || log.method === methodFilter;

    return matchesSearch && matchesMethod;
  });

  const getMethodColor = (method) => {
    const colors = {
      GET: {
        backgroundColor: '#E3F2FD',
        color: '#1976D2',
      },
      POST: {
        backgroundColor: '#E8F5E9',
        color: '#2E7D32',
      },
      PUT: {
        backgroundColor: '#FFF3E0',
        color: '#E65100',
      },
      DELETE: {
        backgroundColor: '#FFEBEE',
        color: '#C62828',
      },
    };
    return colors[method] || { backgroundColor: '#F5F5F5', color: '#424242' };
  };

  const getStatusIcon = (status) => {
    const statusCode = parseInt(status);
    if (statusCode >= 200 && statusCode < 300) {
      return (
        <CheckCircleIcon
          fontSize='small'
          sx={{ color: 'success.main' }}
        />
      );
    } else if (statusCode >= 400) {
      return (
        <ErrorIcon
          fontSize='small'
          sx={{ color: 'error.main' }}
        />
      );
    }
    return (
      <WarningIcon
        fontSize='small'
        sx={{ color: 'warning.main' }}
      />
    );
  };

  if (isLoading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='400px'>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box p={3}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          mb={3}>
          <Typography
            variant='h5'
            fontWeight='500'>
            System Activity Logs
          </Typography>
          <IconButton
            onClick={() => window.location.reload()}
            size='small'
            sx={{ ml: 2 }}>
            <RefreshIcon />
          </IconButton>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          mb={3}
          alignItems='center'>
          <TextField
            placeholder='Search logs...'
            variant='outlined'
            size='small'
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon
                    fontSize='small'
                    color='action'
                  />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: { sm: '300px' } }}
          />

          <FormControl
            size='small'
            sx={{ minWidth: '150px' }}>
            <InputLabel>Method</InputLabel>
            <Select
              value={methodFilter}
              onChange={handleMethodFilter}
              label='Method'>
              <MenuItem value='all'>All Methods</MenuItem>
              <MenuItem value='GET'>GET</MenuItem>
              <MenuItem value='POST'>POST</MenuItem>
              <MenuItem value='PUT'>PUT</MenuItem>
              <MenuItem value='DELETE'>DELETE</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <TableContainer sx={{ maxHeight: 650 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Device Type</TableCell>
                <TableCell>IP Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log) => (
                  <TableRow
                    key={log._id}
                    hover
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}>
                    <TableCell sx={{ maxWidth: 150 }}>
                      <Typography
                        noWrap
                        variant='body2'>
                        {log.username}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography
                        noWrap
                        variant='body2'>
                        {log.url}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.method}
                        size='small'
                        sx={{
                          ...getMethodColor(log.method),
                          minWidth: 70,
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.role}
                        size='small'
                        sx={{
                          backgroundColor: 'rgba(147, 51, 234, 0.1)',
                          color: '#9333EA',
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        display='flex'
                        alignItems='center'
                        gap={0.5}>
                        {getStatusIcon(log.status)}
                        <Typography variant='body2'>{log.status}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>
                        {new Date(log.time).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography
                        noWrap
                        variant='body2'>
                        {log.device.split('/')[1]}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>{log.ipAddress}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component='div'
          count={filteredLogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Paper>
  );
};

export default ActivityLog;
