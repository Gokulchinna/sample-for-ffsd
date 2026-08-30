import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ServicesModule } from './modules/services/services.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { GrievancesModule } from './modules/grievances/grievances.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { MockDbService } from './database/mock-db.service';
import { LoggingMiddleware } from './common/middlewares/logging.middleware';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ServicesModule,
    WorkflowModule,
    ApplicationsModule,
    GrievancesModule,
    NotificationsModule,
    AdminModule,
  ],
  providers: [MockDbService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
