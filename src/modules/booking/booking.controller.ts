import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Controller('/api/booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService, private prisma: PrismaService) {}

    // Get all bookings
    @Get()
    findAll(@Req() req: Request) {
        return this.bookingService.findAll(req as any);
    }

    // Create a new booking
    @Post()
    createBooking(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingService.createBooking(createBookingDto);
    }

    // Get booking by id
    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.bookingService.findById(id);
    }

    // Update booking
    @Put(':id')
    updateBooking(@Param('id', ParseIntPipe) id: number, @Body() updateBookingDto: UpdateBookingDto) {
        return this.bookingService.updateBooking(id, updateBookingDto);
    }

    // Delete booking
    @Delete(':id')
    deleteBooking(@Param('id', ParseIntPipe) id: number) {
        return this.bookingService.deleteBooking(id);
    }

    // Get booking by user id
    @Get('user/:id')
    findByUserId(@Param('id', ParseIntPipe) id: number) {
        return this.bookingService.findByUserId(id);
    }
}
