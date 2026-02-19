import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Public/HomePage/HomePage';
import EventsPage from './pages/Public/EventsPage/EventsPage';
import CataloguePage from './pages/Public/CataloguePage/CataloguePage';
import EventDetailPage from './pages/Public/EventDetailPage/EventDetailPage';
import LoginPage from './pages/Auth/LoginPage/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRedirect from './pages/Dashboard/DashboardRedirect';
import BuyerDashboard from './pages/Dashboard/BuyerDashboard/BuyerDashboard';
import OrganizerDashboard from './pages/Dashboard/OrganizerDashboard/OrganizerDashboard';
import OrganizerEventsPage from './pages/Dashboard/OrganizerEventsPage/OrganizerEventsPage';
import OrganizerSalesPage from './pages/Dashboard/OrganizerSalesPage/OrganizerSalesPage';
import OrganizerScanPage from './pages/Dashboard/OrganizerScanPage/OrganizerScanPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Routes Publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/catalogue" element={<CataloguePage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Dashboard role-aware */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardRedirect />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['BUYER']} />}>
                <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['ORGANIZER']} />}>
                <Route path="/dashboard/organizer" element={<OrganizerDashboard />} />
                <Route path="/dashboard/organizer/events" element={<OrganizerEventsPage />} />
                <Route path="/dashboard/organizer/sales" element={<OrganizerSalesPage />} />
                <Route path="/dashboard/organizer/scan" element={<OrganizerScanPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
