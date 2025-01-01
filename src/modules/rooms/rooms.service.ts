import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RoomDto, RoomFilterDto } from './dto/room.dto';

@Injectable()
export class RoomsService {
    constructor(private readonly prisma: PrismaService) {}

    // Get all rooms
    getAllRooms = async (req: Request) => {
        const totalRooms = await this.prisma.room.findMany();
        if(!totalRooms) {
            return {
                statusCode: 400,
                message: 'Không tìm thấy phòng'
            };
        }
        let { pageIndex, pageSize } = req as any;

        pageIndex = +pageIndex > 0 ? +pageIndex : 1; //chuỗi convert '' sang Number
        pageSize = +pageSize > 0 ? +pageSize : 3;
    
        const skip = (pageIndex - 1) * pageSize;
        const totalItems = await this.prisma.room.count();
        const totalPages = Math.ceil(totalItems / pageSize);
        // skip: (page -1) * pageSize,
    
    const rooms = await this.prisma.room.findMany({
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
          items: rooms || [],
        };
      };

    // Create a room
    createRoom = async (body: RoomDto) => {
        // Check if location exists first
        const location = await this.prisma.location.findUnique({
            where: {
                id: body.maViTri,
            },
        });

        if (!location) {
            return {
                statusCode: 400,
                message: 'Không tìm thấy mã vị trí'
            };
        }

        // If location exists, create the room
        const room = await this.prisma.room.create({
            data: {
                name: body.tenPhong,
                guestCount: body.khach,
                bedroom: body.phongNgu,
                bed: body.giuong,
                bathroom: body.phongTam,
                description: body.moTa,
                price: body.giaTien,
                washer: body.mayGiat,
                iron: body.banLa,
                tv: body.tivi,
                airCon: body.dieuHoa,
                wifi: body.wifi,
                kitchen: body.bep,
                parking: body.doXe,
                pool: body.hoBoi,
                flatIron: body.banUi,
                locationId: body.maViTri,
                image: body.hinhAnh,
            },
        });

        return {
            statusCode: 200,
            message: 'Tạo phòng thành công',
            data: room
        };
    }

    // get a room by Location ID
    getRoomByLocationId = async (locationId: number) => {
        const room = await this.prisma.room.findMany({
            where: {
                locationId: +locationId,
            },
        });
        if(!room || room.length === 0) {
            return {
                statusCode: 400,
                message: 'Không tìm thấy vị trí'
            };
        }

        const location = await this.prisma.location.findUnique({
            where: {
                id: +locationId,
            },
        });
        if(!location) {
            return {
                statusCode: 400,
                message: 'Không tìm thấy vị trí'
            };
        }
        return {
            statusCode: 200,
            message: 'Vị trí đã được tìm thấy',
            data: room,
        };
    }

    // Get a room by id
    getRoomById = async (id: number) => {
        const room = await this.prisma.room.findMany({
            where: {
                id: +id,
            },
        });
        if(!room || room.length === 0) {
            return {
                statusCode: 400,
                message: 'Không tìm thấy phòng'
            };
        }
        return {
            statusCode: 200,
            message: 'Phòng đã được tìm thấy',
            data: room,
        };
        }

        // Phân trang tìm kiếm
    searchPaginationRooms = async (query: RoomFilterDto) => {
            const { pageIndex, pageSize, keyword } = query;
            const items_per_page = (pageSize);
            const page = (pageIndex);
            const search = keyword || '';
        
            const skip = page > 1 ? (page - 1) * items_per_page : 0;
            const users = await this.prisma.user.findMany({
              take: items_per_page,
              skip,
              where: {
                OR: [
                  {
                    name: {
                      contains: search,
                    },
                  },
                  {
                    email: {
                      contains: search,
                    },
                  },
                ],
                AND: [
                  {
                    status: 1,
                  },
                ],
              },
              orderBy: {
                createdAt: 'desc',
              },
            });
        
            const total = await this.prisma.user.count({
              where: {
                OR: [
                  {
                    name: {
                      contains: search,
                    },
                  },
                  {
                    email: {
                      contains: search,
                    },
                  },
                ],
                AND: [
                  {
                    status: 2,
                  },
                ],
              },
            });
        
            return {
              data: users,
              total,
              currentPage: page,
              itemsPerPage: items_per_page,
            };
          };

          // Update a room
          updateRoom = async (id: number, body: RoomDto) => {
            
            const room = await this.prisma.room.update({
              where: { id: +id },
              data: {
                name: body.tenPhong,
                guestCount: body.khach,
                bedroom: body.phongNgu,
                bed: body.giuong,
                bathroom: body.phongTam,
                description: body.moTa,
                price: body.giaTien,
                washer: body.mayGiat,
                iron: body.banLa,
                tv: body.tivi,
                airCon: body.dieuHoa,
                wifi: body.wifi,
                kitchen: body.bep,
                parking: body.doXe,
                pool: body.hoBoi,
                flatIron: body.banUi,
                locationId: body.maViTri,
                image: body.hinhAnh,
              },
            });
            return {
                statusCode: 200,
                message: 'Phòng đã được cập nhật',
                data: room,
            };
          }

          // Delete a room
          deleteRoom = async (id: number) => {
            if(!id) {
                return {
                    statusCode: 400,
                    message: 'Không tìm thấy phòng'
                };
            }
            const room = await this.prisma.room.delete({
              where: { id: +id },
            });
            return {
              statusCode: 200,
              message: 'Phòng đã được xóa',
              data: room,
            };
          }

           // Upload image Room
      uploadImageRoom = async (id: number, file: Express.Multer.File) => {
        const room = await this.prisma.room.findUnique({
          where: { id },
        });
        if(!room) {
          return {
            statusCode: 400,
            message: ' ID không tồn tại'
          };
        }
        return await this.prisma.location.update({
          where: { id },
          data: { image: file.filename },
        });
      };
        }
       