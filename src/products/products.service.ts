import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDTO } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { limit = 4, offset = 0 } = paginationDTO;
    try {
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
      });
      // ! TODO: RELACIONES
      return products;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({
      id,
    });
    if (!product) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }
    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    const productDeleted = await this.productRepository.remove(product);
    return `Producto ${productDeleted.id} eliminado`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
