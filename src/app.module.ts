import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsController } from './artists/artists.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistsSchema } from './schemas/artist.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/wave'),
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistsSchema }]),
  ],
  controllers: [AppController, ArtistsController],
  providers: [AppService],
})
export class AppModule {}
