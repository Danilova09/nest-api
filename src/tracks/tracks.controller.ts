import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { CreateTrackDto } from './create-track.dto';
import { Album, AlbumDocument } from '../schemas/album.schema';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  async getTracks(@Query('album') albumId: string) {
    if (albumId) {
      const tracksByAlbum = await this.trackModel
        .find({ album: albumId })
        .populate('album');
      return tracksByAlbum;
    }
    return this.trackModel.find().populate('album');
  }

  @Get('byAlbum/:albumID')
  async getTracksByAlbum(@Param('albumID') albumID: string) {
    if (!mongoose.isValidObjectId(albumID)) {
      return { error: 'Incorrect id of album ' + albumID };
    }

    const album = await this.albumModel.findById(albumID).populate('artist');

    if (!album) {
      return { error: 'Album with id = ' + albumID + ' not found' };
    }

    const tracks = await this.trackModel.find({ album: albumID });

    const albumData = JSON.parse(JSON.stringify(album));
    const albumInfo = { ...albumData, artist: albumData.artist._id };

    const tracksByAlbum = {
      artist: albumData.artist,
      album: albumInfo,
      tracks,
    };
    return tracksByAlbum;
  }

  @Post()
  createTrack(@Body() trackDto: CreateTrackDto) {
    const track = new this.trackModel({
      album: trackDto.album,
      title: trackDto.title,
      duration: trackDto.duration,
      isPublished: trackDto.isPublished,
    });

    void track.save();
    return track;
  }

  @Delete(':id')
  async deleteAlbum(@Param('id') id: string) {
    if (!mongoose.isValidObjectId(id)) {
      return { error: 'Incorrect id' };
    }

    const track = await this.trackModel.findById(id);

    if (!track) {
      return { error: 'track with id = ' + id + ' not found!' };
    }

    track.deleteOne();

    return { message: 'track with id = ' + id + ' is deleted!' };
  }

  @Post(':id/publish')
  async publishTrack(@Param('id') id: string) {
    const track = await this.trackModel.findById(id);
    track.set({ isPublished: true });
    return track;
  }
}
