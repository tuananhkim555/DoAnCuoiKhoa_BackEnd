import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LocationDto } from './dto/location.dto';

@Injectable()
export class LocationService {
    constructor(private readonly prisma: PrismaService) {}

    // Get all locations
    getAllLocations = async (req: Request) => {
        let { pageIndex, pageSize } = req as any;

        pageIndex = +pageIndex > 0 ? +pageIndex : 1; //chuỗi convert '' sang Number
        pageSize = +pageSize > 0 ? +pageSize : 3;
    
        const skip = (pageIndex - 1) * pageSize;
        const totalItems = await this.prisma.location.count();
        const totalPages = Math.ceil(totalItems / pageSize);
        // skip: (page -1) * pageSize,
    
    const locations = await this.prisma.location.findMany({
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
          items: locations || [],
        };
      };
    
      // Create a new location
      createLocation = async (locationDto: LocationDto) => {
        const { name_location, province, country, image } = locationDto;
        if (!name_location || !province || !country || !image) {
            return {
                statusCode: 400,
                message: 'Vui lòng điền đầy đủ thông tin địa điểm'
            };
        }
        return await this.prisma.location.create({
          data: {
            name_location: locationDto.name_location,
            province: locationDto.province,
            country: locationDto.country,
            image: locationDto.image,
          },
        });
      };

      // Tìm kiếm địa điểm
      searchLocations = async (query: any) => {
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

      // Get location by id
      getLocationById = async (id: number) => {
        const location = await this.prisma.location.findUnique({
          where: { id },
        });
        if(!location) {
          return {
            statusCode: 400,
            message: 'Id không đúng kiểm tra lại'
          };
        }
        return await this.prisma.location.findUnique({
          where: { id },
        });
      };

      // Update location by id
      updateLocation = async (id: number, locationDto: LocationDto) => {
        const { name_location, province, country, image } = locationDto;
        if(!name_location || !province || !country || !image) {
          return {
            statusCode: 400,
            message: 'Vui lòng điền đầy đủ thông tin địa điểm'
          };
        }
        return await this.prisma.location.update({
          where: { id },
          data: { name_location, province, country, image},
        });
      };

      // Delete location by id
      deleteLocation = async (id: number) => {
        const location = await this.prisma.location.findUnique({
          where: { id },
        });
        if(!location) {
          return {
            statusCode: 400,
            message: 'Id không đúng kiểm tra lại'
          };
        }
        return await this.prisma.location.delete({
          where: { id },
        });
      };

      // Upload image Location
      uploadImageLocation = async (id: number, file: Express.Multer.File) => {
        return await this.prisma.location.update({
          where: { id },
          data: { image: file.filename },
        });
      };
}
