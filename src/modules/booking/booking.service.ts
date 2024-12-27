import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all bookings
  findAll = async (req: Request) => {
    let { pageIndex, pageSize } = req as any;

    pageIndex = +pageIndex > 0 ? +pageIndex : 1; //chuỗi convert '' sang Number
    pageSize = +pageSize > 0 ? +pageSize : 3;

    const skip = (pageIndex - 1) * pageSize;
    const totalItems = await this.prisma.user.count();
    const totalPages = Math.ceil(totalItems / pageSize);
    // skip: (page -1) * pageSize,

    const bookings = await this.prisma.booking.findMany({
      take: pageSize, //Limit
      skip: skip, //Offset

      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      statusCode: 200,
      pageIndex: pageIndex,
      pageSize: pageSize,
      totalItems: totalItems,
      totalPages: totalPages,
      items: bookings || [],
    };
  };

  // Create a new booking
  createBooking = async (createBookingDto: CreateBookingDto) => {

    const userExists = await this.prisma.user.findUnique({
      where: {
        id: createBookingDto.maNguoiDung,
      },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const roomExists = await this.prisma.room.findUnique({
      where: {
        id: createBookingDto.maPhong,
      },
    });

    if (!roomExists) {
      throw new NotFoundException('Room not found');
    }

    const bookingExists = await this.prisma.booking.findFirst({
      where: {
        roomId: createBookingDto.maPhong,
        checkIn: createBookingDto.ngayDen,
        checkOut: createBookingDto.ngayDi,
      },
    });

    if (bookingExists) {
      throw new BadRequestException('Phòng đã được đặt');
    }

    return this.prisma.booking.create({
      data: {
        roomId: createBookingDto.maPhong,
        checkIn: createBookingDto.ngayDen,
        checkOut: createBookingDto.ngayDi,
        userId: createBookingDto.maNguoiDung,
        guestCount: createBookingDto.soLuongKhach,
      },
    });
  };

  // Get booking by id
  findById = async (id: number) => {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking không có thông tin đặt phòng');
    }

    return booking;
  };

  // Update booking
  updateBooking = async (id: number, updateBookingDto: UpdateBookingDto) => {

    const bookingExists = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!bookingExists) {
      throw new NotFoundException('Booking không có thông tin đặt phòng');
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        roomId: updateBookingDto.maPhong,
        checkIn: updateBookingDto.ngayDen,
        checkOut: updateBookingDto.ngayDi,
        userId: updateBookingDto.maNguoiDung,
        guestCount: updateBookingDto.soLuongKhach,
      },
    });
  };


  // Delete booking
  deleteBooking = async (id:number) => {
    const bookingExists = await this.prisma.booking.findUnique({
        where: {
            id,
        },
    })

    if (!bookingExists) {
        throw new NotFoundException('Booking không có thông tin đặt phòng');
    }

    return this.prisma.booking.delete({
        where: { id },
    });
  };

  // Get booking by user id
  findByUserId = async (id: number) => {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.booking.findMany({
        where: { userId: id },
    });
  };
}
