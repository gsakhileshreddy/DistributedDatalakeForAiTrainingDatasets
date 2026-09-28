import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/ToastContext';
import { AppLayout } from './components/layout/AppLayout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Datasets } from './pages/Datasets';
import { DatasetDetails } from './pages/DatasetDetails';
import { DatasetValidation } from './pages/DatasetValidation';
import { DatasetVersions } from './pages/DatasetVersions';
import { ProcessingJobs } from './pages/ProcessingJobs';
import { StorageAnalytics } from './pages/StorageAnalytics';
import { AITraining } from './pages/AITraining';
import { Users } from './pages/Users';
import { AuditLogs } from './pages/AuditLogs';
import { Settings } from './pages/Settings';

export function App() {
    return (
        <ToastProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Auth />} />

                    <Route element={<AppLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/datasets" element={<Datasets />} />
                        <Route path="/datasets/:id" element={<DatasetDetails />} />
                        <Route path="/validation" element={<DatasetValidation />} />
                        <Route path="/versions" element={<DatasetVersions />} />
                        <Route path="/jobs" element={<ProcessingJobs />} />
                        <Route path="/storage" element={<StorageAnalytics />} />
                        <Route path="/training" element={<AITraining />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/audit" element={<AuditLogs />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ToastProvider>
    );
}

export default App;
