import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import mongoose, { Model } from 'mongoose';
import { CreateAlbumDto } from './create-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  async getAlbums(@Query('artist') artistId: string) {
    if (artistId) {
      const albumsByArtist = await this.albumModel
        .find({ artist: artistId })
        .populate('artist');
      return albumsByArtist;
    }
    return this.albumModel.find().populate('artist');
  }

  @Get(':id')
  async getAlbumById(@Param('id') id: string) {
    if (!mongoose.isValidObjectId(id)) {
      return { error: 'Incorrect id' };
    }
    const album = await this.albumModel.findById(id);

    if (!album) {
      return { error: 'album with id = ' + id + ' not found!' };
    }

    return album;
  }

  @Post()
  createAlbum(@Body() albumDto: CreateAlbumDto) {
    const album = new this.albumModel({
      artist: albumDto.artist,
      title: albumDto.title,
      releaseDate: albumDto.releaseDate,
      isPublished: albumDto.isPublished,
    });
    void album.save();
    return album;
  }

  @Delete(':id')
  async deleteAlbum(@Param('id') id: string) {
    if (!mongoose.isValidObjectId(id)) {
      return { error: 'Incorrect id' };
    }
    const album = await this.albumModel.findById(id);

    if (!album) {
      return { error: 'album with id = ' + id + ' not found!' };
    }

    album.deleteOne();

    return { message: 'album with id = ' + id + ' is deleted!' };
  }

  @Post(':id/publish')
  async publishAlbum(@Param('id') id: string) {
    const album = await this.albumModel.findById(id);
    album.set({ isPublished: true });
    return album;
  }
}
