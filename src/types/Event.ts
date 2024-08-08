import { Document } from "mongoose";

export interface Event extends Document{
    title: string;
    date: Date;
    location: string;
    description?: string;
    capacity: number;
    seatsOccupied: number;
    createdAt: Date;
    updatedAt: Date;
    imageUrl?: string;
    imageAlt?: string;
    price: number;
    _id: string;
  }