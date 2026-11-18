import { Module } from '@nestjs/common';
import { AdminCasesController } from './cases/admin-cases.controller';
import { AdminCasesService } from './cases/admin-cases.service';
import { AdminCatalogController } from './catalog/admin-catalog.controller';
import { AdminCatalogService } from './catalog/admin-catalog.service';
import { AdminDashboardController } from './dashboard/admin-dashboard.controller';
import { AdminDashboardService } from './dashboard/admin-dashboard.service';
import { AdminIssuesController } from './issues/admin-issues.controller';
import { AdminIssuesService } from './issues/admin-issues.service';
import { AdminResourcesController } from './resources/admin-resources.controller';
import { AdminResourcesService } from './resources/admin-resources.service';
import { AdminSystemController } from './system/admin-system.controller';
import { AdminSystemService } from './system/admin-system.service';
@Module({ controllers: [AdminCasesController, AdminCatalogController, AdminDashboardController, AdminIssuesController, AdminResourcesController, AdminSystemController], providers: [AdminCasesService, AdminCatalogService, AdminDashboardService, AdminIssuesService, AdminResourcesService, AdminSystemService] })
export class AdminModule {}