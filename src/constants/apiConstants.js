// API Base URLs
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    PROFILE: '/auth/profile',
    REFRESH_TOKEN: '/auth/refresh',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  
  // Employee endpoints
  EMPLOYEES: {
    BASE: '/employees',
    GET_ALL: '/employees',
    GET_BY_ID: (id) => `/employees/${id}`,
    CREATE: '/employees',
    UPDATE: (id) => `/employees/${id}`,
    DELETE: (id) => `/employees/${id}`,
    SEARCH: '/employees/search',
  },
  
  // Attendance endpoints
  ATTENDANCE: {
    BASE: '/attendance',
    CHECKIN: '/attendance/checkin',
    CHECKOUT: '/attendance/checkout',
    REPORT: '/attendance/report',
    LEAVE: '/attendance/leave',
  },
  
  // Payroll endpoints
  PAYROLL: {
    BASE: '/payroll',
    SALARY_SLIPS: '/payroll/slips',
    GENERATE: '/payroll/generate',
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// API Timeouts
export const API_TIMEOUT = 10000;