import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(16)
  @MinLength(4)
  username: string;
}
