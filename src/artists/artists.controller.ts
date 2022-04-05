import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import mongoose, { Model } from 'mongoose';
import { CreateArtistDto } from './create-artist.dto';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
  ) {}

  @Get()
  getArtists() {
    return this.artistModel.find();
  }

  @Get(':id')
  getArtistById(@Param('id') id: string) {
    if (!mongoose.isValidObjectId(id)) {
      return { error: 'Incorrect id' };
    }

    const artist = this.artistModel.findById(id);
    return artist;
  }

  @Post()
  createArtist(@Body() artistDto: CreateArtistDto) {
    const artist = new this.artistModel({
      name: artistDto.name,
      info: artistDto.info,
      isPublished: artistDto.isPublished,
    });
    void artist.save();
    return artist;
  }

  @Post(':id/publish')
  async publishArtist(@Param('id') id: string) {
    const artist = await this.artistModel.findById(id);
    artist.set({ isPublished: true });
    return artist;
  }

  @Delete(':id')
  async deleteArtistById(@Param('id') id: string) {
    if (!mongoose.isValidObjectId(id)) {
      return { error: 'Incorrect id' };
    }

    const artist = await this.artistModel.findById(id);

    if (!artist) {
      return { error: 'Artist with id = ' + id + ' not found!' };
    }

    await this.artistModel.findByIdAndRemove(id);
    return { message: 'Artist with id = ' + id + ' was deleted' };
  }
}
