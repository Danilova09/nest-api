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
  publishArtist(@Param('id') id: string) {
    const filter = { _id: id };
    const params = { isPublished: true };
    const artist = this.artistModel.findOneAndUpdate(filter, params);
    return artist;
  }

  @Delete(':id')
  async deleteArtistById(@Param('id') id: string) {
    if (!mongoose.isValidObjectId(id)) {
      return { error: 'Incorrect id' };
    }

    const artist = this.artistModel.findById(id);

    if (!artist) {
      return { error: 'Artist with id = ' + id + ' wasnt found!' };
    }

    await this.artistModel.findByIdAndRemove(id);
    return { message: 'Artist with id = ' + id + ' was deleted' };
  }
}
