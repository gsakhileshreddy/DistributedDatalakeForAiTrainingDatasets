import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) return null;

    const breadcrumbNameMap: Record<string, string> = {
        datasets: 'Datasets',
        jobs: 'Processing Jobs',
        storage: 'Storage Analytics',
        'ai-training': 'AI Training',
        users: 'Users & Roles',
        'audit-logs': 'Audit Logs',
        settings: 'Settings',
        upload: 'Upload Wizard',
        validation: 'Dataset Validation',
        versions: 'Dataset Versions',
    };

    return (
        <nav className="flex items-center text-xs text-muted-foreground gap-1.5 py-1 mb-4 select-none">
            <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                <span className="sr-only">Dashboard Home</span>
            </Link>

            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const displayName = breadcrumbNameMap[value] || value;

                return (
                    <React.Fragment key={to}>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                        {isLast ? (
                            <span className="font-semibold text-foreground truncate max-w-[200px]">{displayName}</span>
                        ) : (
                            <Link to={to} className="hover:text-foreground transition-colors truncate max-w-[150px]">
                                {displayName}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};
