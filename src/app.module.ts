import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './features/user-accounts/user-accounts.module';

@Module({
  imports: [UserAccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
