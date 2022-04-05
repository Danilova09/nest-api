import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({ ref: 'Album', required: true })
  album: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true, default: false })
  isPublished: boolean;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
