import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  displayName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 'user', enum: ['admin', 'user'] })
  role: string;

  @Prop({ required: true, default: nanoid() })
  token: string;

  @Prop()
  facebookId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
